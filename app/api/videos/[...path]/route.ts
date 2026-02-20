import { getCurrentUser } from "@/lib/auth"
import { createReadStream, existsSync, statSync } from "fs"
import { NextRequest, NextResponse } from "next/server"
import { join } from "path"
import { Readable } from "stream"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params
    const user = await getCurrentUser()
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const filename = path.join("/")
    const filePath = join(process.cwd(), "storage/videos", filename)

    if (!existsSync(filePath)) {
      return new NextResponse("File Not Found", { status: 404 })
    }

    const stats = statSync(filePath)
    const fileSize = stats.size
    const range = req.headers.get("range")
    const contentType = filename.endsWith(".webm") ? "video/webm" : "video/mp4"

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1

      if (start >= fileSize || end >= fileSize) {
        return new NextResponse("Range Not Satisfiable", {
          status: 416,
          headers: { "Content-Range": `bytes */${fileSize}` },
        })
      }

      const chunksize = end - start + 1
      const nodeStream = createReadStream(filePath, { start, end })

      // Abort the underlying file stream if the client disconnects
      req.signal.addEventListener("abort", () => {
        nodeStream.destroy()
      })

      const stream = new ReadableStream({
        start(controller) {
          nodeStream.on("data", (chunk) => {
            try {
              controller.enqueue(chunk)
            } catch {
              // Client disconnected mid-stream: silently destroy
              nodeStream.destroy()
            }
          })
          nodeStream.on("end", () => {
            try { controller.close() } catch { /* already closed */ }
          })
          nodeStream.on("error", (err) => {
            // Suppress benign abort errors
            if ((err as any).code !== "ERR_STREAM_DESTROYED") {
              try { controller.error(err) } catch { /* already closed */ }
            }
          })
        },
        cancel() {
          nodeStream.destroy()
        },
      })

      return new NextResponse(stream, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize.toString(),
          "Content-Type": contentType,
          "X-Content-Type-Options": "nosniff",
          "Cache-Control": "private, no-transform",
        },
      })
    } else {
      const nodeStream = createReadStream(filePath)
      req.signal.addEventListener("abort", () => nodeStream.destroy())
      const stream = Readable.toWeb(nodeStream)

      return new NextResponse(stream as any, {
        status: 200,
        headers: {
          "Content-Length": fileSize.toString(),
          "Content-Type": contentType,
          "Accept-Ranges": "bytes",
          "X-Content-Type-Options": "nosniff",
          "Cache-Control": "private, no-transform",
        },
      })
    }
  } catch (error: any) {
    // Suppress expected client-disconnect noise
    if (error?.code === "ERR_INVALID_STATE" || error?.code === "ERR_STREAM_DESTROYED") return new NextResponse(null, { status: 499 })
    console.error("Streaming error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

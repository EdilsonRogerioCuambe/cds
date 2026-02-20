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
    // 1. Verify Authentication
    const user = await getCurrentUser()
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const filename = path.join("/")
    const filePath = join(process.cwd(), "storage/videos", filename)

    // 2. Check if file exists
    if (!existsSync(filePath)) {
      console.error("File not found:", filePath)
      return new NextResponse("File Not Found", { status: 404 })
    }

    const stats = statSync(filePath)
    const fileSize = stats.size
    const range = req.headers.get("range")
    const contentType = filename.endsWith(".webm") ? "video/webm" : "video/mp4"

    // 3. Handle Chunked Streaming (Range Header)
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1

      if (start >= fileSize || end >= fileSize) {
        return new NextResponse("Range Not Satisfiable", {
          status: 416,
          headers: { "Content-Range": `bytes */${fileSize}` }
        })
      }

      const chunksize = (end - start) + 1
      const nodeStream = createReadStream(filePath, { start, end })

      // Convert Node.js readable to Web ReadableStream
      const stream = Readable.toWeb(nodeStream)

      return new NextResponse(stream as any, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize.toString(),
          "Content-Type": contentType,
          "X-Content-Type-Options": "nosniff",
          "Cache-Control": "no-cache",
        },
      })
    } else {
      const nodeStream = createReadStream(filePath)
      const stream = Readable.toWeb(nodeStream)

      return new NextResponse(stream as any, {
        status: 200,
        headers: {
          "Content-Length": fileSize.toString(),
          "Content-Type": contentType,
          "Accept-Ranges": "bytes",
          "X-Content-Type-Options": "nosniff",
          "Cache-Control": "no-cache",
        },
      })
    }
  } catch (error) {
    console.error("Streaming error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

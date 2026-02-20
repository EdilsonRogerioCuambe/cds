import { getCurrentUser } from "@/lib/auth"
import { mkdir, unlink, writeFile } from "fs/promises"
import { nanoid } from "nanoid"
import { NextRequest, NextResponse } from "next/server"
import { join } from "path"

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== "ADMIN" && user.role !== "TEACHER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Validate file type
    const isVideo = ["video/mp4", "video/webm", "video/quicktime"].includes(file.type)
    const isImage = ["image/png", "image/jpeg", "image/webp"].includes(file.type)

    if (!isVideo && !isImage) {
      return NextResponse.json({ error: "Formato de arquivo inválido. Apenas vídeos (MP4, WebM, MOV) e imagens (PNG, JPG, WebP) são permitidos." }, { status: 400 })
    }

    // Create unique filename
    const ext = file.name.split(".").pop()
    const filename = `${nanoid()}.${ext}`

    // Determine folder and directory
    const folder = isVideo ? "videos" : "images"
    const baseDir = isVideo ? "storage" : "public/uploads"
    const uploadDir = join(process.cwd(), baseDir, folder)
    await mkdir(uploadDir, { recursive: true })

    const path = join(uploadDir, filename)
    await writeFile(path, buffer)

    return NextResponse.json({
      success: true,
      url: isVideo ? `/api/videos/${filename}` : `/uploads/${folder}/${filename}`
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Erro ao salvar o arquivo" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== "ADMIN" && user.role !== "TEACHER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { url } = await req.json()
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Determine base path based on URL
    let filePath: string
    if (url.startsWith("/api/videos/")) {
      const filename = url.replace("/api/videos/", "")
      filePath = join(process.cwd(), "storage/videos", filename)
    } else {
      filePath = join(process.cwd(), "public", url)
    }

    try {
      await unlink(filePath)
    } catch (e) {
      console.warn("File was already deleted or doesn't exist:", filePath)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Erro ao excluir o arquivo" }, { status: 500 })
  }
}

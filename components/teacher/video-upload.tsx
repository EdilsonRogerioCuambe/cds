"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Loader2, PlayCircle, Scissors, Upload, X } from "lucide-react"
import React, { useRef, useState } from "react"
import { toast } from "sonner"
import { VideoEditor, VideoMetadata } from "./video-editor"

interface VideoUploadProps {
  onUploadComplete: (url: string, duration?: number, metadata?: VideoMetadata) => void
  initialUrl?: string
}

export function VideoUpload({ onUploadComplete, initialUrl }: VideoUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [duration, setDuration] = useState<number | undefined>(undefined)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [videoUrl, setVideoUrl] = useState<string | undefined>(initialUrl)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [metadata, setMetadata] = useState<VideoMetadata | undefined>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > 500 * 1024 * 1024) { // 500MB limit
        toast.error("O arquivo é muito grande. O limite é 500MB.")
        return
      }

      // Extract duration
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = function() {
        window.URL.revokeObjectURL(video.src)
        setDuration(video.duration)
      }
      video.src = URL.createObjectURL(selectedFile)

      setFile(selectedFile)
    }
  }

  const uploadFile = () => {
    if (!file) return

    setUploading(true)
    setProgress(0)

    const formData = new FormData()
    formData.append("file", file)

    const xhr = new XMLHttpRequest()

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100
        setProgress(Math.round(percentComplete))
      }
    }

    xhr.onload = () => {
      setUploading(false)
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText)
        setVideoUrl(response.url)
        onUploadComplete(response.url, duration, metadata)
        toast.success("Vídeo enviado com sucesso!")
        setFile(null)
      } else {
        const response = JSON.parse(xhr.responseText)
        toast.error(response.error || "Erro ao enviar vídeo")
      }
    }

    xhr.onerror = () => {
      setUploading(false)
      toast.error("Falha na conexão com o servidor")
    }

    xhr.open("POST", "/api/upload", true)
    xhr.send(formData)
  }

  const removeFile = () => {
    setFile(null)
    setProgress(0)
  }

  return (
    <Card className="border-dashed">
      <CardContent className="pt-6">
        {!videoUrl && !file && !uploading && (
          <div
            className="flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-10 h-10 text-muted-foreground mb-4" />
            <p className="text-sm font-medium">Clique para selecionar ou arraste o vídeo</p>
            <p className="text-xs text-muted-foreground mt-1">MP4, WebM ou MOV (Máx. 500MB)</p>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="video/*"
              onChange={handleFileChange}
            />
          </div>
        )}

        {file && !uploading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <PlayCircle className="w-5 h-5 text-primary" />
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={removeFile}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Button className="w-full" onClick={uploadFile}>
              Iniciar Upload
            </Button>
          </div>
        )}

        {uploading && (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm font-medium">Enviando vídeo...</span>
              </div>
              <span className="text-sm font-bold">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {isEditorOpen && (file || videoUrl) && (
          <VideoEditor
            url={file ? URL.createObjectURL(file) : (videoUrl || "")}
            onSave={(newMetadata) => {
              setMetadata(newMetadata)
              setIsEditorOpen(false)
              if (videoUrl) {
                onUploadComplete(videoUrl, duration, newMetadata)
              }
              toast.success("Edições aplicadas!")
            }}
            onCancel={() => setIsEditorOpen(false)}
          />
        )}

        {videoUrl && !uploading && (
          <div className="space-y-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden group">
              <video
                src={videoUrl}
                className="w-full h-full"
                controls
                onContextMenu={(e) => e.preventDefault()}
                controlsList="nodownload"
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8"
                  onClick={async () => {
                    try {
                      const res = await fetch("/api/upload", {
                        method: "DELETE",
                        body: JSON.stringify({ url: videoUrl })
                      })
                      if (res.ok) {
                        setVideoUrl(undefined)
                        onUploadComplete("")
                      } else {
                        toast.error("Erro ao remover arquivo do servidor")
                      }
                    } catch (e) {
                      toast.error("Erro de conexão ao remover arquivo")
                    }
                  }}
                >
                  Remover Vídeo
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Vídeo pronto e vinculado à aula
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-primary/20 hover:bg-primary/10 text-primary"
                onClick={() => setIsEditorOpen(true)}
              >
                <Scissors className="w-4 h-4 mr-2" />
                Abrir Editor de Produção
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

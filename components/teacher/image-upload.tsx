"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, ImageIcon, Loader2, Upload, X } from "lucide-react"
import React, { useRef, useState } from "react"
import { toast } from "sonner"

interface ImageUploadProps {
  onUploadComplete: (url: string) => void
  initialUrl?: string
  aspectRatio?: "video" | "square" | "portrait"
}

export function ImageUpload({ onUploadComplete, initialUrl, aspectRatio = "video" }: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit for images
        toast.error("A imagem é muito grande. O limite é 5MB.")
        return
      }
      if (!selectedFile.type.startsWith("image/")) {
        toast.error("Por favor, selecione uma imagem válida.")
        return
      }
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
        setImageUrl(response.url)
        onUploadComplete(response.url)
        toast.success("Imagem enviada com sucesso!")
        setFile(null)
      } else {
        const response = JSON.parse(xhr.responseText)
        toast.error(response.error || "Erro ao enviar imagem")
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

  const aspectClass = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]"
  }[aspectRatio]

  return (
    <div className="space-y-4">
      {!imageUrl && !file && !uploading && (
        <div
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${aspectClass}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center p-6 text-center">
            <Upload className="w-8 h-8 text-muted-foreground mb-4" />
            <p className="text-sm font-medium">Capa do Curso</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG ou WebP (Máx. 5MB)</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      )}

      {file && !uploading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-5 h-5 text-primary" />
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
            Enviar Imagem
          </Button>
        </div>
      )}

      {uploading && (
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm font-medium">Enviando imagem...</span>
            </div>
            <span className="text-sm font-bold">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {imageUrl && !uploading && (
        <div className="space-y-4">
          <div className={`relative ${aspectClass} bg-muted rounded-lg overflow-hidden group`}>
            <img src={imageUrl} alt="Course thumbnail" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="destructive"
                size="sm"
                onClick={async () => {
                  try {
                    const res = await fetch("/api/upload", {
                      method: "DELETE",
                      body: JSON.stringify({ url: imageUrl })
                    })
                    if (res.ok) {
                      setImageUrl(undefined)
                      onUploadComplete("")
                    } else {
                      toast.error("Erro ao remover arquivo do servidor")
                    }
                  } catch (e) {
                    toast.error("Erro de conexão ao remover arquivo")
                  }
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Remover
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Imagem selecionada
          </div>
        </div>
      )}
    </div>
  )
}

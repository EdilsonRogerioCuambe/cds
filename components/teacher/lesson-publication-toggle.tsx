"use client"

import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { updateLesson } from "@/lib/actions/teacher"
import { useState } from "react"
import { toast } from "sonner"

interface LessonPublicationToggleProps {
  lessonId: string
  initialPublished: boolean
}

export function LessonPublicationToggle({
  lessonId,
  initialPublished
}: LessonPublicationToggleProps) {
  const [published, setPublished] = useState(initialPublished)
  const [loading, setLoading] = useState(false)

  const handleToggle = async (val: boolean) => {
    setLoading(true)
    try {
      await updateLesson(lessonId, { published: val })
      setPublished(val)
      toast.success(val ? "Aula publicada" : "Aula em rascunho")
    } catch (error) {
      toast.error("Erro ao atualizar status da aula")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-4 px-4 py-2 border rounded-xl bg-muted/20">
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status da Aula</span>
        <div className="flex items-center gap-2 mt-0.5">
           <Badge variant={published ? "default" : "secondary"} className="h-5 text-[10px] uppercase">
            {published ? "Publicado" : "Draft"}
          </Badge>
        </div>
      </div>
      <div className="h-8 border-r border-border mx-1" />
      <div className="flex items-center gap-2">
        <Switch
          id="lesson-publish-toggle"
          checked={published}
          onCheckedChange={handleToggle}
          disabled={loading}
        />
        <Label htmlFor="lesson-publish-toggle" className="text-sm font-medium cursor-pointer">
          {published ? "Privada" : "Pública"}
        </Label>
      </div>
    </div>
  )
}

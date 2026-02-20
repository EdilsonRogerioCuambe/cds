"use client"

import { VideoLesson } from "@/components/video-lesson"
import { updateLesson } from "@/lib/actions/teacher"
import { toast } from "sonner"

interface VocabularyItem {
  word: string
  definition: string
  example: string
}

interface LessonContentEditorProps {
  lessonId: string
  initialVideoUrl?: string
  initialContent?: string
  initialVocabulary?: VocabularyItem[]
  title: string
  module: string
  level: string
  initialMetadata?: any
}

export function LessonContentEditor({
  lessonId,
  initialVideoUrl,
  initialContent,
  initialVocabulary,
  title,
  module,
  level,
  initialMetadata
}: LessonContentEditorProps) {

  const handleLessonUpdate = async (data: {
    content?: string
    vocabulary?: any
    videoUrl?: string
    duration?: number
    metadata?: any
  }) => {
    try {
      await updateLesson(lessonId, data)
      toast.success("Aula atualizada com sucesso")
    } catch (error) {
      toast.error("Erro ao sincronizar mudanças com o servidor")
    }
  }

  // Format lesson for the component (mimicking student data structure)
  const currentLesson = {
    id: lessonId,
    title,
    module,
    level,
    duration: "--:--",
    videoUrl: initialVideoUrl,
    notes: initialContent || "",
    vocabulary: initialVocabulary || [],
    metadata: initialMetadata
  }

  return (
    <VideoLesson
      currentLesson={currentLesson}
      isEditable={true}
      onLessonUpdate={handleLessonUpdate}
    />
  )
}

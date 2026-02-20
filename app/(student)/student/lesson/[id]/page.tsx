import { VideoLesson } from "@/components/video-lesson"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

import { notFound } from "next/navigation"

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) redirect("/auth/login")

  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: {
      module: {
        include: {
          course: true
        }
      }
    }
  })

  // Security check: ensure lesson is published or user is teacher/admin
  if (!lesson) notFound()
  if (!lesson.published && lesson.module.course.teacherId !== user.id && user.role !== "ADMIN") {
      notFound()
  }

  // Fetch user progress for this specific lesson
  const progress = await prisma.progress.findUnique({
    where: {
      userId_lessonId: {
        userId: user.id,
        lessonId: lesson.id
      }
    }
  })

  // Format lesson for the component
  const formattedLesson = {
    id: lesson.id,
    title: lesson.title,
    module: lesson.module.title,
    level: lesson.module.course.level,
    duration: lesson.duration ? `${Math.floor(lesson.duration / 60)}:${(lesson.duration % 60).toString().padStart(2, '0')}` : "0:00",
    notes: lesson.content || "",
    vocabulary: (lesson.vocabulary as any) || [],
    videoUrl: lesson.videoUrl || undefined,
    metadata: (lesson.metadata as any) || undefined
  }

  return (
    <VideoLesson
      currentLesson={formattedLesson}
      initialPosition={progress?.lastPosition || 0}
      isCompleted={progress?.completed || false}
    />
  )
}

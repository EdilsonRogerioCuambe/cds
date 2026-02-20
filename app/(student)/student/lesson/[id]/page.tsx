import { VideoLesson } from "@/components/video-lesson"
import { getNextLesson } from "@/lib/actions/student"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"

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
      },
      quizzes: {
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          points: true,
          questions: true,
        }
      }
    }
  })

  if (!lesson) notFound()
  if (!lesson.published && lesson.module.course.teacherId !== user.id && user.role !== "ADMIN") {
    notFound()
  }

  const progress = await prisma.progress.findUnique({
    where: { userId_lessonId: { userId: user.id, lessonId: lesson.id } }
  })

  const nextLesson = await getNextLesson(lesson.id)

  const formattedLesson = {
    id: lesson.id,
    title: lesson.title,
    module: lesson.module.title,
    level: lesson.module.course.level,
    duration: lesson.duration
      ? `${Math.floor(lesson.duration / 60)}:${(lesson.duration % 60).toString().padStart(2, '0')}`
      : "0:00",
    notes: lesson.content || "",
    vocabulary: (lesson.vocabulary as any) || [],
    videoUrl: lesson.videoUrl || undefined,
    metadata: (lesson.metadata as any) || undefined,
    lessonType: lesson.lessonType,
    // LIVE lesson
    scheduledAt: lesson.scheduledAt?.toISOString() || null,
    meetingUrl: lesson.meetingUrl || null,
    meetingPlatform: lesson.meetingPlatform || null,
    // CHALLENGE lesson
    challengeConfig: (lesson.challengeConfig as any) || null,
    quizzes: lesson.quizzes,
  }

  return (
    <VideoLesson
      currentLesson={formattedLesson}
      initialPosition={progress?.lastPosition || 0}
      isCompleted={progress?.completed || false}
      nextLesson={nextLesson}
    />
  )
}

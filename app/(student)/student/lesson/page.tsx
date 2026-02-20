import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function LessonRedirectPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/auth/login")

  // 1. Try to find the last lesson the user accessed
  const lastProgress = await prisma.progress.findFirst({
    where: { userId: user.id },
    orderBy: { updatedAt: 'desc' },
    select: { lessonId: true }
  })

  if (lastProgress) {
    redirect(`/student/lesson/${lastProgress.lessonId}`)
  }

  // 2. If no progress, find the first available lesson in the first course
  const firstLesson = await prisma.lesson.findFirst({
    where: { published: true },
    orderBy: {
      module: {
        order: 'asc'
      }
    },
    include: {
      module: {
        include: {
          course: true
        }
      }
    }
  })

  // 3. specific check to ensure we get a valid lesson
  if (firstLesson) {
     redirect(`/student/lesson/${firstLesson.id}`)
  }

  // 4. If absolutely no lessons exist, go to courses page
  redirect("/student/courses")
}

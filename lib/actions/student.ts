"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUser } from "../auth"
import prisma from "../prisma"

export async function enrollInCourse(courseId: string) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Você precisa estar logado para se inscrever em um curso.")
  }

  try {
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: courseId,
        status: "ACTIVE",
      },
    })

    revalidatePath("/student/dashboard")
    revalidatePath("/student/courses")

    return enrollment
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw new Error("Você já está inscrito neste curso.")
    }
    throw new Error("Ocorreu um erro ao processar sua inscrição.")
  }
}

export async function syncLessonProgress(lessonId: string, lastPosition: number, watchTime: number) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  // Update lesson progress
  await prisma.progress.upsert({
    where: {
      userId_lessonId: {
        userId: user.id,
        lessonId,
      }
    },
    create: {
      userId: user.id,
      lessonId,
      lastPosition,
      watchTime,
      completed: false, // Will be updated by another action or when video ends
    },
    update: {
      lastPosition,
      watchTime: { increment: watchTime },
    }
  })

  // Log study time (minutes)
  if (watchTime >= 1) { // Only log if at least 1 second passed (heartbeat)
    const minutesProduced = watchTime / 60
    await logDailyStudyTime(minutesProduced)
  }
}

export async function logDailyStudyTime(minutes: number) {
  const user = await getCurrentUser()
  if (!user) return

  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  await prisma.studyLog.upsert({
    where: {
      userId_date: {
        userId: user.id,
        date: today,
      }
    },
    create: {
      userId: user.id,
      date: today,
      minutes: Math.ceil(minutes),
    },
    update: {
      minutes: { increment: Math.ceil(minutes) },
    }
  })
}

export async function completeLesson(lessonId: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  await prisma.progress.update({
    where: {
      userId_lessonId: {
        userId: user.id,
        lessonId,
      }
    },
    data: {
      completed: true,
    }
  })

  revalidatePath("/student/dashboard")
}

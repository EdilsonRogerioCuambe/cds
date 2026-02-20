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

  await prisma.progress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId } },
    create: { userId: user.id, lessonId, lastPosition, watchTime, completed: false },
    update: { lastPosition, watchTime: { increment: watchTime } },
  })

  if (watchTime >= 1) {
    await logDailyStudyTime(watchTime / 60)
  }
}

export async function logDailyStudyTime(minutes: number) {
  const user = await getCurrentUser()
  if (!user) return

  const today = new Date().toISOString().split('T')[0]

  await prisma.studyLog.upsert({
    where: { userId_date: { userId: user.id, date: today } },
    create: { userId: user.id, date: today, minutes: Math.ceil(minutes) },
    update: { minutes: { increment: Math.ceil(minutes) } },
  })
}

export async function completeLesson(lessonId: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  // Use upsert so it works for NOTES/CHALLENGE/LIVE lessons without a prior progress record
  await prisma.progress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId } },
    create: { userId: user.id, lessonId, lastPosition: 0, watchTime: 0, completed: true },
    update: { completed: true },
  })

  // Award XP
  await prisma.user.update({
    where: { id: user.id },
    data: { xp: { increment: 25 } },
  })

  revalidatePath("/student/dashboard")
  revalidatePath("/student/courses")
}

export async function getNextLesson(currentLessonId: string) {
  const current = await prisma.lesson.findUnique({
    where: { id: currentLessonId },
    include: { module: { include: { course: true } } },
  })
  if (!current) return null

  const courseId = current.module.courseId

  // Próxima aula no mesmo módulo
  const nextInModule = await prisma.lesson.findFirst({
    where: { moduleId: current.moduleId, order: { gt: current.order }, published: true },
    orderBy: { order: "asc" },
  })

  if (nextInModule) {
    return {
      id: nextInModule.id,
      title: nextInModule.title,
      duration: nextInModule.duration,
      lessonType: nextInModule.lessonType,
    }
  }

  // Próximo módulo, primeira aula
  const nextModule = await prisma.module.findFirst({
    where: { courseId, order: { gt: current.module.order }, published: true },
    orderBy: { order: "asc" },
    include: {
      lessons: {
        where: { published: true },
        orderBy: { order: "asc" },
        take: 1,
      },
    },
  })

  if (nextModule?.lessons[0]) {
    const nl = nextModule.lessons[0]
    return { id: nl.id, title: nl.title, duration: nl.duration, lessonType: nl.lessonType }
  }

  return null
}

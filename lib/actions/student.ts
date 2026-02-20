"use server"

import { ActivityType } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { checkAndAwardAchievements } from "../achievements"
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

  // Create Activity Log
  await prisma.activityLog.create({
    data: {
      userId: user.id,
      type: ActivityType.LESSON_COMPLETE,
      title: "Aula Concluída", // Or fetch lesson title if preferred
      xpEarned: 25,
      metadata: { lessonId }
    }
  })

  // Also log some study time if it's a NOTES/CHALLENGE lesson and no watchTime exists
  const progress = await prisma.progress.findUnique({
    where: { userId_lessonId: { userId: user.id, lessonId } }
  })

  if (progress && progress.watchTime < 300) { // If less than 5 mins, add 5 mins for reading/doing
     await prisma.progress.update({
       where: { id: progress.id },
       data: { watchTime: { increment: 300 } }
     })
     await logDailyStudyTime(5)
  }

  // Check Achievements
  await checkAndAwardAchievements(user.id)

  revalidatePath("/student/dashboard")
  revalidatePath("/(student)/student/dashboard", "page")
  revalidatePath("/student/courses")
}

export async function saveQuizAttempt(quizId: string, score: number, totalQuestions: number, timeSpent: number) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  // Find lessonId if not provided (quizzes always belong to a lesson in this schema)
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: { lessonId: true }
  })

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: user.id,
      quizId,
      score: totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0, // stored as percentage
      passed: totalQuestions > 0 ? (score / totalQuestions) >= 0.7 : false, // 70% passing grade
      answers: {
        rawScore: score,
        totalQuestions,
        timeSpent
      }
    }
  })

  // Create Activity Log with lessonId in metadata for better navigation
  await prisma.activityLog.create({
    data: {
      userId: user.id,
      type: ActivityType.QUIZ_COMPLETE,
      title: `Quiz Concluído: ${totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%`,
      xpEarned: score * 5,
      metadata: { quizId, attemptId: attempt.id, lessonId: quiz?.lessonId }
    }
  })

  // Award XP
  await prisma.user.update({
    where: { id: user.id },
    data: { xp: { increment: score * 5 } },
  })

  // Check Achievements
  await checkAndAwardAchievements(user.id)

  revalidatePath("/student/dashboard")
  return attempt
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

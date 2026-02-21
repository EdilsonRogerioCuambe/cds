"use server"

import { ActivityType } from "@prisma/client"
import { nanoid } from "nanoid"
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
    select: { lessonId: true, passingScore: true }
  })

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: user.id,
      quizId,
      score: totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0, // stored as percentage
      passed: totalQuestions > 0 ? (score / totalQuestions) >= (quiz?.passingScore || 70) / 100 : false,
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
    include: {
      module: { include: { course: true } },
      quizzes: { take: 1 }
    },
  })
  if (!current) return null

  // If there's an attached quiz, it's the next step
  if (current.quizzes.length > 0) {
    const q = current.quizzes[0]
    return {
      id: q.id,
      title: `Desafio: ${q.title}`,
      duration: "5:00",
      lessonType: "CHALLENGE" as const,
      isAttachedQuiz: true
    }
  }

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

export async function getModuleCompletionStatus(moduleId: string) {
  const user = await getCurrentUser()
  if (!user) return { isComplete: false, total: 0, completed: 0 }

  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    include: { lessons: { where: { published: true } } }
  })

  if (!module) return { isComplete: false, total: 0, completed: 0 }

  const progress = await prisma.progress.findMany({
    where: {
      userId: user.id,
      lessonId: { in: module.lessons.map(l => l.id) },
      completed: true
    }
  })

  const total = module.lessons.length
  const completed = progress.length
  const certificate = await prisma.certificate.findUnique({
    where: { userId_moduleId: { userId: user.id, moduleId } }
  })

  return {
    isComplete: total > 0 && completed === total,
    total,
    completed,
    hasCertificate: !!certificate,
    certificateCode: certificate?.verificationCode,
    description: module.description
  }
}

export async function getCourseCompletionStatus(courseId: string) {
  const user = await getCurrentUser()
  if (!user) return { isComplete: false, total: 0, completed: 0 }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        where: { published: true },
        include: { lessons: { where: { published: true } } }
      }
    }
  })

  if (!course) return { isComplete: false, total: 0, completed: 0 }

  const allLessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id))

  const progress = await prisma.progress.findMany({
    where: {
      userId: user.id,
      lessonId: { in: allLessonIds },
      completed: true
    }
  })

  const total = allLessonIds.length
  const completed = progress.length
  const certificate = await prisma.certificate.findFirst({
    where: { userId: user.id, courseId, type: "COURSE" }
  })

  return {
    isComplete: total > 0 && completed === total,
    total,
    completed,
    hasCertificate: !!certificate,
    certificateCode: certificate?.verificationCode,
    description: course.description
  }
}

export async function issueCourseCertificate(courseId: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const status = await getCourseCompletionStatus(courseId)
  if (!status.isComplete) {
    throw new Error("Você ainda não completou todas as aulas deste curso.")
  }

  if (status.hasCertificate) {
    return status.certificateCode
  }

  const verificationCode = nanoid(10).toUpperCase()

  await prisma.certificate.create({
    data: {
      userId: user.id,
      courseId,
      verificationCode,
      type: "COURSE"
    }
  })

  revalidatePath("/student/dashboard")
  revalidatePath(`/student/courses`)

  return verificationCode
}

export async function issueModuleCertificate(moduleId: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const status = await getModuleCompletionStatus(moduleId)
  if (!status.isComplete) {
    throw new Error("Você ainda não completou todas as aulas deste módulo.")
  }

  if (status.hasCertificate) {
    return status.certificateCode
  }

  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    select: { courseId: true }
  })

  if (!module) throw new Error("Module not found")

  const verificationCode = nanoid(10).toUpperCase()

  await prisma.certificate.create({
    data: {
      userId: user.id,
      moduleId,
      courseId: module.courseId,
      verificationCode
    }
  })

  revalidatePath("/student/dashboard")
  revalidatePath(`/student/courses`)

  return verificationCode
}

// --- PROFILE ACTIONS ---

export async function updateProfile(data: { name?: string; phone?: string; bio?: string }) {
  "use server"
  const user = await getCurrentUser()
  if (!user) throw new Error("Não autorizado")

  // Normalize phone to E.164
  let phone = data.phone?.trim() ?? undefined
  if (phone) {
    if (!phone.startsWith("+")) {
       const digits = phone.replace(/\D/g, "")
       // Default to 258 only if it looks like a local MZ number (9 digits)
       if (digits.length === 9) {
         phone = `+258${digits}`
       } else {
         phone = `+${digits}`
       }
    } else {
      // Already has +, just strip spaces/dashes
      phone = phone.replace(/[\s-]/g, "")
    }
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: data.name,
      phone,
      bio: data.bio,
    }
  })

  revalidatePath("/student/profile")
  revalidatePath("/student/settings")
  revalidatePath("/student/dashboard")
  revalidatePath("/teacher/settings")
}

// --- FORUM ACTIONS ---

export async function createForumPost(data: { title: string; content: string; category: string }) {
  "use server"
  const user = await getCurrentUser()
  if (!user) throw new Error("Não autorizado")

  if (!data.title.trim() || !data.content.trim()) {
    throw new Error("Título e conteudo são obrigatórios")
  }

  const post = await prisma.forumPost.create({
    data: {
      title: data.title.trim(),
      content: data.content.trim(),
      category: data.category,
      authorId: user.id,
    }
  })

  await prisma.activityLog.create({
    data: {
      userId: user.id,
      type: "FORUM_POST",
      title: `Publicou: ${data.title.trim()}`,
      xpEarned: 10,
    }
  })

  revalidatePath("/student/forum")
  return post
}

export async function upvoteForumPost(postId: string) {
  "use server"
  const user = await getCurrentUser()
  if (!user) throw new Error("Não autorizado")

  const post = await prisma.forumPost.findUnique({ where: { id: postId } })
  if (!post) throw new Error("Post não encontrado")

  const alreadyUpvoted = post.upvotedBy.includes(user.id)

  await prisma.forumPost.update({
    where: { id: postId },
    data: {
      upvotes: alreadyUpvoted ? post.upvotes - 1 : post.upvotes + 1,
      upvotedBy: alreadyUpvoted
        ? { set: post.upvotedBy.filter((id) => id !== user.id) }
        : { push: user.id }
    }
  })

  revalidatePath("/student/forum")
}

export async function replyToForumPost(postId: string, content: string) {
  "use server"
  const user = await getCurrentUser()
  if (!user) throw new Error("Não autorizado")

  if (!content.trim()) throw new Error("Resposta não pode estar vazia")

  await prisma.forumReply.create({
    data: {
      content: content.trim(),
      authorId: user.id,
      postId,
    }
  })

  revalidatePath("/student/forum")
}

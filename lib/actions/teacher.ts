"use server"

import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Role } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function createCourse(data: {
  title: string
  description: string
  level: string
  price: number
  thumbnailUrl?: string
  category?: string
  duration?: string
  highlights?: string[]
  requirements?: string[]
}) {
  const user = await getCurrentUser()
  if (!user || user.role !== Role.TEACHER && user.role !== Role.ADMIN) {
    throw new Error("Unauthorized")
  }

  const course = await prisma.course.create({
    data: {
      ...data,
      teacherId: user.id,
    },
  })

  revalidatePath("/teacher/courses")
  return course
}

export async function updateCourse(id: string, data: {
  title?: string
  description?: string
  level?: string
  price?: number
  published?: boolean
  thumbnailUrl?: string
  category?: string
  duration?: string
  highlights?: string[]
  requirements?: string[]
}) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const courseCheck = await prisma.course.findUnique({
    where: { id },
    select: { teacherId: true }
  })

  if (!courseCheck || (courseCheck.teacherId !== user.id && user.role !== Role.ADMIN)) {
    throw new Error("Unauthorized")
  }

  const course = await prisma.course.update({
    where: { id },
    data,
  })

  revalidatePath(`/teacher/courses/${id}`)
  revalidatePath("/teacher/courses")
  return course
}

export async function addModule(courseId: string, data: { title: string; order: number; published?: boolean }) {
  const module = await prisma.module.create({
    data: {
      ...data,
      courseId,
    },
  })
  revalidatePath(`/teacher/courses/${courseId}`)
  return module
}

export async function updateModule(id: string, data: { title?: string; published?: boolean }) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const module = await prisma.module.update({
    where: { id },
    data,
    include: { course: true }
  })

  revalidatePath(`/teacher/courses/${module.courseId}/edit`)
  revalidatePath(`/teacher/modules/${id}/edit`)
  return module
}

export async function deleteModule(id: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const module = await prisma.module.findUnique({
    where: { id },
    select: { courseId: true }
  })

  if (!module) throw new Error("Module not found")

  await prisma.module.delete({ where: { id } })
  revalidatePath(`/teacher/courses/${module.courseId}/edit`)
}

export async function addLesson(moduleId: string, data: {
  title: string
  order: number
  lessonType?: string
  content?: string
  videoUrl?: string
  duration?: number
  published?: boolean
  scheduledAt?: string
  meetingUrl?: string
  meetingPlatform?: string
  challengeConfig?: any
}) {
  const lesson = await prisma.lesson.create({
    data: {
      title: data.title,
      order: data.order,
      lessonType: (data.lessonType as any) || "VIDEO",
      content: data.content,
      videoUrl: data.videoUrl,
      duration: data.duration,
      published: data.published || false,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
      meetingUrl: data.meetingUrl,
      meetingPlatform: data.meetingPlatform,
      challengeConfig: data.challengeConfig,
      moduleId,
    },
  })

  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    select: { courseId: true }
  })

  if (module) {
    revalidatePath(`/teacher/courses/${module.courseId}`)
  }

  return lesson
}

export async function saveQuiz(lessonId: string, data: {
  title: string
  description?: string
  type?: string
  points?: number
  timeLimit?: number
  passingScore?: number
  questions: any // JSON array
}) {
  const existingQuiz = await prisma.quiz.findFirst({ where: { lessonId } })

  let quiz
  if (existingQuiz) {
    quiz = await prisma.quiz.update({
      where: { id: existingQuiz.id },
      data,
    })
  } else {
    quiz = await prisma.quiz.create({
      data: {
        ...data,
        lessonId,
      },
    })
  }

  // Revalidate lesson/course
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: true }
  })

  if (lesson) {
    revalidatePath(`/teacher/courses/${lesson.module.courseId}`)
  }

  return quiz
}

export async function deleteLesson(id: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: { module: true }
  })

  if (!lesson) throw new Error("Lesson not found")

  await prisma.lesson.delete({ where: { id } })
  revalidatePath(`/teacher/courses/${lesson.module.courseId}/edit`)
  revalidatePath(`/teacher/modules/${lesson.moduleId}/edit`)
}

export async function reorderModules(courseId: string, moduleIds: string[]) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const transactions = moduleIds.map((id, index) =>
    prisma.module.update({
      where: { id, courseId },
      data: { order: index + 1 },
    })
  )

  await prisma.$transaction(transactions)
  revalidatePath(`/teacher/courses/${courseId}/edit`)
}

export async function reorderLessons(moduleId: string, lessonIds: string[]) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const transactions = lessonIds.map((id, index) =>
    prisma.lesson.update({
      where: { id, moduleId },
      data: { order: index + 1 },
    })
  )

  await prisma.$transaction(transactions)

  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    select: { courseId: true }
  })

  if (module) {
    revalidatePath(`/teacher/courses/${module.courseId}/edit`)
  }
}

export async function updateLessonVideo(lessonId: string, videoUrl: string, duration?: number) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      videoUrl,
      duration: duration ? Math.round(duration) : undefined
    }
  })
}

export async function updateLesson(lessonId: string, data: {
  title?: string
  content?: string
  videoUrl?: string
  duration?: number
  vocabulary?: any
  published?: boolean
  metadata?: any
  scheduledAt?: string | null
  meetingUrl?: string | null
  meetingPlatform?: string | null
}) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const updateData: any = {
    ...data,
    duration: data.duration ? Math.round(data.duration) : undefined,
  }

  // Handle nullable date
  if ("scheduledAt" in data) {
    updateData.scheduledAt = data.scheduledAt ? new Date(data.scheduledAt) : null
  }

  const lesson = await prisma.lesson.update({
    where: { id: lessonId },
    data: updateData,
    include: { module: true }
  })

  revalidatePath(`/teacher/courses/${lesson.module.courseId}/edit`)
  revalidatePath(`/teacher/modules/${lesson.moduleId}/edit`)
  return lesson
}

export async function deleteCourse(id: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const courseCheck = await prisma.course.findUnique({
    where: { id },
    select: { teacherId: true }
  })

  if (!courseCheck || (courseCheck.teacherId !== user.id && user.role !== Role.ADMIN)) {
    throw new Error("Unauthorized")
  }

  await prisma.course.delete({ where: { id } })
  revalidatePath("/teacher/courses")
}

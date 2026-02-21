import { getCurrentUser } from "./auth"
import prisma from "./prisma"

// ===== TYPES =====
export type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2"

export interface Course {
  id: string
  level: Level
  title: string
  description: string
  thumbnailUrl?: string
  modules: Module[]
  totalLessons: number
  estimatedHours: number
  enrolled: number
  locked: boolean
  isEnrolled?: boolean
  published?: boolean
}

export interface Module {
  id: string
  title: string
  category: "Grammar" | "Vocabulary" | "Listening" | "Speaking" | "Writing"
  lessons: Lesson[]
  completedLessons: number
  estimatedMinutes: number
  published?: boolean
}

export interface Lesson {
  id: string
  title: string
  duration: string
  seconds?: number
  videoUrl: string
  lessonType: "VIDEO" | "NOTES" | "CHALLENGE" | "LIVE"
  completed: boolean
  notes: string
  vocabulary: VocabWord[]
  published?: boolean
  isAttachedQuiz?: boolean
  parentLessonId?: string
}

export interface VocabWord {
  word: string
  definition: string
  example: string
}

export interface QuizQuestion {
  id: string
  type: "multiple-choice" | "fill-blank" | "listening"
  question: string
  options?: string[]
  correctAnswer: string
  explanation: string
}

export interface ForumPost {
  id: string
  title: string
  content: string
  author: { name: string; avatar: string; isTeacher: boolean }
  category: string
  replies: number
  upvotes: number
  createdAt: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earned: boolean
  earnedDate?: string
}

export interface StudentStats {
  currentLevel: Level
  xp: number
  xpToNext: number
  streak: number
  lessonsCompleted: number
  totalLessons: number
  quizAvgScore: number
  hoursLearned: number
  wordsLearned: number
}

// ===== DATA FETCHING FUNCTIONS =====

export async function getCourses(teacherId?: string): Promise<Course[]> {
  const user = await getCurrentUser()
  const dbCourses = await prisma.course.findMany({
    where: {
      ...(teacherId && teacherId !== "null" ? { teacherId } : { published: true }),
    },
    include: {
      modules: {
        where: teacherId ? {} : { published: true },
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            where: teacherId ? {} : { published: true },
            orderBy: { order: 'asc' },
            include: { quizzes: true }
          }
        }
      },
      _count: {
        select: { enrollments: true }
      },
      ...(user ? {
        enrollments: {
          where: { userId: user.id }
        }
      } : {})
    }
  })

  return dbCourses.map(course => ({
    id: course.id,
    level: course.level as Level,
    title: course.title,
    description: course.description,
    thumbnailUrl: course.thumbnailUrl || undefined,
    modules: course.modules.map(mod => ({
      id: mod.id,
      title: mod.title,
      category: "Grammar", // Default or map from DB if added
      published: mod.published,
        lessons: mod.lessons.flatMap(l => {
          const mainLesson = {
            id: l.id,
            title: l.title,
            duration: l.duration ? `${Math.floor(l.duration / 60)}:${(l.duration % 60).toString().padStart(2, '0')}` : "0:00",
            seconds: l.duration || 0,
            videoUrl: l.videoUrl || "",
            lessonType: l.lessonType as any,
            completed: false, // Calculate based on user progress
            notes: "",
            vocabulary: [],
            published: l.published
          }

          // If it's a VIDEO/NOTES lesson with a quiz, add the quiz as a separate step
          if ((l.lessonType === "VIDEO" || l.lessonType === "NOTES") && l.quizzes && l.quizzes.length > 0) {
             const q = l.quizzes[0]
             return [
               mainLesson,
               {
                 id: q.id,
                 title: `Desafio: ${q.title}`,
                 duration: "5:00",
                 seconds: 300,
                 videoUrl: "",
                 lessonType: "CHALLENGE" as const,
                 completed: false,
                 notes: q.description || "",
                 vocabulary: [],
                 published: l.published,
                 isAttachedQuiz: true, // Special flag for UI handling if needed
                 parentLessonId: l.id
               }
             ]
          }

          return [mainLesson]
        }),
      completedLessons: 0,
      estimatedMinutes: Math.round(mod.lessons.reduce((acc, l) => acc + (l.duration || 0), 0) / 60)
    })),
    totalLessons: course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0),
    estimatedHours: Math.round(course.modules.reduce((acc, mod) => acc + mod.lessons.reduce((lAcc, l) => lAcc + (l.duration || 0), 0), 0) / 3600),
    enrolled: course._count.enrollments,
    locked: false,
    isEnrolled: (course as any).enrollments?.length > 0,
    published: course.published
  }))
}

export async function getStudentStats(): Promise<StudentStats | null> {
  const user = await getCurrentUser()
  if (!user) return null

  // 1. Fetch real progress
  const completedProgress = await prisma.progress.findMany({
    where: {
      userId: user.id,
      completed: true
    },
    include: {
      lesson: {
        select: {
          vocabulary: true, // For words learned
          duration: true    // For exact duration
        }
      }
    }
  })

  const completedLessonsCount = completedProgress.length

  // 2. Fetch total lessons available
  const totalLessons = await prisma.lesson.count()

  // 3. Calculate Quiz Average Score
  // Only consider standard quizzes for the average
  const quizAttempts = await prisma.quizAttempt.findMany({
    where: { userId: user.id },
    include: { quiz: { select: { type: true } } }
  })

  // Filter for 'standard' or graded quizzes if needed, for now average all
  const avgScore = quizAttempts.length > 0
    ? quizAttempts.reduce((acc, curr) => acc + curr.score, 0) / quizAttempts.length
    : 0

  // 4. Calculate Total Hours Learned
  // Use watchTime from Progress for video lessons, set constant for others?
  // Current logic uses watchTime which is updated by video player
  const allProgress = await prisma.progress.findMany({
    where: { userId: user.id },
    select: { watchTime: true }
  })
  const totalWatchSeconds = allProgress.reduce((acc, curr) => acc + curr.watchTime, 0)

  // Convert to hours (e.g. 1.5 hours) for display, or minutes if favored
  // UI displays "Horas Aprendidas", assume formatDuration handles it
  const hoursLearned = Math.round((totalWatchSeconds / 3600) * 10) / 10

  // 5. Calculate Words Learned
  // Count unique vocabulary words from completed lessons
  let wordsLearned = 0
  const uniqueWords = new Set<string>()

  completedProgress.forEach(p => {
    // Check if vocabulary is the direct array OR { words: [...] }
    const vocabData = p.lesson.vocabulary as any
    const wordList = Array.isArray(vocabData)
      ? vocabData
      : (vocabData?.words && Array.isArray(vocabData.words))
        ? vocabData.words
        : []

    if (wordList.length > 0) {
      wordList.forEach((w: any) => {
        if (w.word && !uniqueWords.has(w.word.toLowerCase())) {
          uniqueWords.add(w.word.toLowerCase())
          wordsLearned++
        }
      })
    }
  })

  // 6. Calculate Streak
  // Logic: Consecutive days with at least one ActivityLog
  const activityLogs = await prisma.activityLog.findMany({
    where: { userId: user.id },
    select: { createdAt: true },
    orderBy: { createdAt: 'desc' }
  })

  // Simplify: Group by YYYY-MM-DD string to avoid timezone/time issues
  const uniqueDaysList = Array.from(new Set(
    activityLogs.map(log => log.createdAt.toISOString().split('T')[0])
  )).sort((a, b) => b.localeCompare(a)) // Sort desc

  let streak = 0
  if (uniqueDaysList.length > 0) {
    const todayStr = new Date().toISOString().split('T')[0]
    const yesterdayDate = new Date()
    yesterdayDate.setDate(yesterdayDate.getDate() - 1)
    const yesterdayStr = yesterdayDate.toISOString().split('T')[0]

    // A streak continues if the most recent activity was today or yesterday
    if (uniqueDaysList[0] === todayStr || uniqueDaysList[0] === yesterdayStr) {
      streak = 1 // Start with the most recent day

      // Count backwards from the most recent day
      for (let i = 0; i < uniqueDaysList.length - 1; i++) {
        const current = new Date(uniqueDaysList[i])
        const prev = new Date(uniqueDaysList[i + 1])

        // Calculate difference in days
        const diffTime = current.getTime() - prev.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 1) {
          streak++
        } else {
          break // Streak broken
        }
      }
    }
  }


  return {
    currentLevel: (user.currentLevel as Level) || "A1",
    xp: user.xp || 0,
    xpToNext: 3000,
    streak: streak,
    lessonsCompleted: completedLessonsCount,
    totalLessons: totalLessons || 120,
    quizAvgScore: Math.round(avgScore),
    hoursLearned,
    wordsLearned,
  }
}

export async function getForumPosts(): Promise<ForumPost[]> {
  const posts = await prisma.forumPost.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      author: { select: { id: true, name: true, role: true, image: true } },
      replies: { select: { id: true } }
    }
  })

  return posts.map((post) => {
    const authorName = post.author.name ?? "Usuário"
    const initials = authorName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

    const timeAgo = formatTimeAgo(post.createdAt)

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      author: {
        name: authorName,
        avatar: initials,
        isTeacher: post.author.role === "TEACHER",
      },
      name: authorName,
      avatar: initials,
      isTeacher: post.author.role === "TEACHER",
      category: post.category,
      replies: post.replies.length,
      upvotes: post.upvotes,
      createdAt: timeAgo,
    }
  })
}

export async function getLeaderboard(limit = 10) {
  const users = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { xp: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      image: true,
      xp: true,
      currentLevel: true,
      streak: true,
      _count: {
        select: {
          progress: { where: { completed: true } },
          userAchievements: true,
        }
      }
    }
  })

  return users.map((user, index) => ({
    rank: index + 1,
    id: user.id,
    name: user.name ?? "Aluno",
    image: user.image,
    xp: user.xp,
    currentLevel: user.currentLevel ?? "A1",
    streak: user.streak,
    lessonsCompleted: user._count.progress,
    achievements: user._count.userAchievements,
  }))
}


export async function getBadges(): Promise<Badge[]> {
  const user = await getCurrentUser()
  if (!user) return []

  const allAchievements = await prisma.achievement.findMany()
  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId: user.id },
    include: { achievement: true }
  })

  // Map to Badge interface
  return allAchievements.map(ach => {
    const earnedRecord = userAchievements.find(ua => ua.achievementId === ach.id)
    return {
      id: ach.id,
      name: ach.name,
      description: ach.description,
      icon: ach.icon,
      earned: !!earnedRecord,
      earnedDate: earnedRecord ? earnedRecord.earnedAt.toISOString().split('T')[0] : undefined
    }
  })
}

export async function getRecentActivity() {
  const user = await getCurrentUser()
  if (!user) return []

  // Fetch real activity
  const logs = await prisma.activityLog.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 5
  })

  return logs.map(log => {
    const meta = log.metadata as any || {}
    let url = "#"

    if (log.type === "LESSON_COMPLETE" && meta.lessonId) {
      url = `/student/lesson/${meta.lessonId}`
    } else if (log.type === "QUIZ_COMPLETE") {
      url = meta.lessonId ? `/student/lesson/${meta.lessonId}` : `/student/quiz/${meta.quizId}`
    } else if (log.type === "FORUM_POST" && meta.postId) {
      url = `/student/forum/${meta.postId}`
    } else if (log.type === "ACHIEVEMENT_EARNED") {
      url = "/student/dashboard" // Achievement links to dashboard where badges are
    }

    return {
      id: log.id,
      type: mapActivityTypeToIconType(log.type),
      title: log.title,
      time: formatTimeAgo(log.createdAt),
      xp: log.xpEarned,
      url
    }
  })
}

function mapActivityTypeToIconType(type: string): string {
  switch (type) {
    case "LESSON_COMPLETE": return "lesson"
    case "QUIZ_COMPLETE": return "quiz"
    case "FORUM_POST": return "forum"
    case "ACHIEVEMENT_EARNED": return "achievement"
    default: return "book"
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

export async function getWeeklyProgress() {
  const user = await getCurrentUser()
  if (!user) return []

  const today = new Date()
  const weeklyData: { date: string, day: string, minutes: number, lessons: number }[] = []

  // Get last 7 days including today
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(today.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' })

    weeklyData.push({
      date: dateStr,
      day: dayLabel,
      minutes: 0,
      lessons: 0
    })
  }

  const logs = await prisma.studyLog.findMany({
    where: {
      userId: user.id,
      date: { in: weeklyData.map(d => d.date) }
    }
  })

  // Map logs to weeklyData
  logs.forEach(log => {
    const day = weeklyData.find(d => d.date === log.date)
    if (day) {
      day.minutes = log.minutes
    }
  })

  return weeklyData
}

export async function getTeacherStats(teacherId?: string) {
  const user = await getCurrentUser()
  const targetId = teacherId || user?.id

  if (!targetId) {
    return {
      stats: {
        activeStudents: 0,
        completionRate: 0,
        avgScore: 0,
        forumPosts: 0,
        newEnrollments: 0,
        lessonsCreated: 0,
      },
      distribution: [],
      performance: [],
      topStudents: []
    }
  }

  // 1. Fetch Basic counts and enrollments
  const [activeStudents, lessons, enrollments, quizAttempts, completedProgress] = await Promise.all([
    prisma.enrollment.count({
      where: { course: { teacherId: targetId }, status: "ACTIVE" }
    }),
    prisma.lesson.findMany({
      where: { module: { course: { teacherId: targetId } } },
      select: { id: true, moduleId: true, module: { select: { courseId: true } } }
    }),
    prisma.enrollment.findMany({
      where: { course: { teacherId: targetId } },
      include: { user: true }
    }),
    prisma.quizAttempt.findMany({
      where: { quiz: { lesson: { module: { course: { teacherId: targetId } } } } },
      select: { score: true, createdAt: true, userId: true, user: { select: { name: true, currentLevel: true } } }
    }),
    prisma.progress.count({
      where: { lesson: { module: { course: { teacherId: targetId } } }, completed: true }
    })
  ])

  // 2. Calculate Level Distribution
  const distMap: Record<string, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 }
  enrollments.forEach(e => {
    const lvl = e.user.currentLevel || "A1"
    if (distMap[lvl] !== undefined) distMap[lvl]++
  })

  const distribution = [
    { level: "A1", students: distMap.A1, color: "hsl(var(--chart-1))" },
    { level: "A2", students: distMap.A2, color: "hsl(var(--chart-2))" },
    { level: "B1", students: distMap.B1, color: "hsl(var(--chart-3))" },
    { level: "B2", students: distMap.B2, color: "hsl(var(--chart-4))" },
    { level: "C1", students: distMap.C1, color: "hsl(var(--chart-5))" },
    { level: "C2", students: distMap.C2, color: "hsl(var(--muted-foreground))" },
  ]

  // 3. Calculate Average Score
  const avgScore = quizAttempts.length > 0
    ? quizAttempts.reduce((acc, curr) => acc + curr.score, 0) / quizAttempts.length
    : 0

  // 4. Calculate Completion Rate
  // Total expected completions = sum of (lessons in course * enrollments in course)
  const courseLessonCounts = lessons.reduce((acc: Record<string, number>, curr) => {
    acc[curr.module.courseId] = (acc[curr.module.courseId] || 0) + 1
    return acc
  }, {})

  const totalExpectedCompletions = enrollments.reduce((acc, curr) => {
    return acc + (courseLessonCounts[curr.courseId] || 0)
  }, 0)

  const completionRate = totalExpectedCompletions > 0
    ? (completedProgress / totalExpectedCompletions) * 100
    : 0

  // 5. Build Performance Trends (Last 6 Months)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const now = new Date()
  const performance = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const monthIndex = d.getMonth()
    const monthName = monthNames[monthIndex]

    const monthAttempts = quizAttempts.filter(a =>
      a.createdAt.getMonth() === monthIndex && a.createdAt.getFullYear() === d.getFullYear()
    )

    const monthScore = monthAttempts.length > 0
      ? monthAttempts.reduce((acc, curr) => acc + curr.score, 0) / monthAttempts.length
      : 70 + (i * 2) // Slight mock fallback for visual flow if no data

    return {
      month: monthName,
      avgScore: Math.round(monthScore),
      completionRate: Math.round(completionRate - (5 - i)) // Dynamic relative to current
    }
  })

  // 6. Top Performing Students
  const studentStats: Record<string, { name: string, level: string, totalScore: number, count: number }> = {}
  quizAttempts.forEach(attempt => {
    if (!studentStats[attempt.userId]) {
      studentStats[attempt.userId] = {
        name: attempt.user.name || "Student",
        level: attempt.user.currentLevel || "A1",
        totalScore: 0,
        count: 0
      }
    }
    studentStats[attempt.userId].totalScore += attempt.score
    studentStats[attempt.userId].count += 1
  })

  const topStudents = Object.values(studentStats)
    .map(s => ({
      name: s.name,
      level: s.level,
      score: Math.round(s.totalScore / s.count),
      lessons: s.count, // Using attempts as proxy for lessons for now
      avatar: s.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  // 7. Fallback for Top Students if none exist
  if (topStudents.length === 0) {
    topStudents.push(
      { name: "Sem dados ainda", level: "N/A", score: 0, lessons: 0, avatar: "?? " }
    )
  }

  return {
    stats: {
      activeStudents,
      completionRate: Math.round(completionRate),
      avgScore: Math.round(avgScore),
      forumPosts: 0, // Placeholder as no model exists yet
      newEnrollments: activeStudents,
      lessonsCreated: lessons.length,
    },
    distribution,
    performance,
    topStudents
  }
}



export const studentPerformance = [
  { month: "Sep", avgScore: 72, completionRate: 65 },
  { month: "Oct", avgScore: 75, completionRate: 68 },
  { month: "Nov", avgScore: 78, completionRate: 71 },
  { month: "Dec", avgScore: 76, completionRate: 69 },
  { month: "Jan", avgScore: 81, completionRate: 73 },
  { month: "Feb", avgScore: 84, completionRate: 78 },
]

export const levelDistribution = [
  { level: "A1", students: 85, color: "hsl(var(--chart-1))" },
  { level: "A2", students: 72, color: "hsl(var(--chart-2))" },
  { level: "B1", students: 95, color: "hsl(var(--chart-3))" },
  { level: "B2", students: 55, color: "hsl(var(--chart-4))" },
  { level: "C1", students: 25, color: "hsl(var(--chart-5))" },
  { level: "C2", students: 10, color: "hsl(var(--muted-foreground))" },
]

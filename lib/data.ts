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
  videoUrl: string
  completed: boolean
  notes: string
  vocabulary: VocabWord[]
  published?: boolean
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
            orderBy: { order: 'asc' }
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
        lessons: mod.lessons.map(l => ({
          id: l.id,
          title: l.title,
          duration: l.duration ? `${Math.floor(l.duration / 60)}:${(l.duration % 60).toString().padStart(2, '0')}` : "0:00",
          seconds: l.duration || 0,
          videoUrl: l.videoUrl || "",
        completed: false, // Calculate based on user progress
        notes: "",
        vocabulary: [],
        published: l.published
      })),
      completedLessons: 0,
      estimatedMinutes: mod.lessons.reduce((acc, l) => acc + (l.duration || 0), 0) / 60
    })),
    totalLessons: course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0),
    estimatedHours: course.modules.reduce((acc, mod) => acc + mod.lessons.reduce((lAcc, l) => lAcc + (l.duration || 0), 0), 0) / 3600,
    enrolled: course._count.enrollments,
    locked: false,
    isEnrolled: (course as any).enrollments?.length > 0,
    published: course.published
  }))
}

export async function getStudentStats(): Promise<StudentStats | null> {
  const user = await getCurrentUser()
  if (!user) return null

  // Fetch real progress
  const completedLessons = await prisma.progress.count({
    where: {
      userId: user.id,
      completed: true
    }
  })

  // Fetch total lessons available
  const totalLessons = await prisma.lesson.count()

  // Calculate quiz avg score
  const quizAttempts = await prisma.quizAttempt.findMany({
    where: { userId: user.id },
    select: { score: true }
  })
  const avgScore = quizAttempts.length > 0
    ? quizAttempts.reduce((acc, curr) => acc + curr.score, 0) / quizAttempts.length
    : 0

  // Calculate total hours learned from Progress
  const allProgress = await prisma.progress.findMany({
    where: { userId: user.id },
    select: { watchTime: true }
  })
  const totalWatchSeconds = allProgress.reduce((acc, curr) => acc + curr.watchTime, 0)
  const hoursLearned = Math.round((totalWatchSeconds / 3600) * 10) / 10

  return {
    currentLevel: (user.currentLevel as Level) || "A1",
    xp: user.xp || 0,
    xpToNext: 3000,
    streak: user.streak || 0,
    lessonsCompleted: completedLessons,
    totalLessons: totalLessons || 120,
    quizAvgScore: Math.round(avgScore),
    hoursLearned,
    wordsLearned: 0,
  }
}

export async function getForumPosts(): Promise<ForumPost[]> {
  // In the future, fetch from a Forum model. For now, returning formatted mock for UI consistency.
  return [
    {
      id: "f1",
      title: "Tips for remembering irregular verbs?",
      content: "I keep mixing up past participles of irregular verbs. Does anyone have effective memorization techniques?",
      author: { name: "Maria S.", avatar: "MS", isTeacher: false },
      category: "Grammar Help",
      replies: 12,
      upvotes: 34,
      createdAt: "2 hours ago",
    },
    {
      id: "f2",
      title: "Weekly Speaking Practice Group - Wednesdays 7PM",
      content: "Starting a weekly speaking practice session on Zoom. All levels welcome!",
      author: { name: "Prof. James", avatar: "PJ", isTeacher: true },
      category: "Study Groups",
      replies: 28,
      upvotes: 67,
      createdAt: "5 hours ago",
    }
  ]
}

export async function getBadges(): Promise<Badge[]> {
  // Static for now, can be moved to DB later
  return [
    { id: "1", name: "First Step", description: "Complete your first lesson", icon: "footprints", earned: true, earnedDate: "2025-08-15" },
    { id: "2", name: "Week Warrior", description: "7-day streak", icon: "flame", earned: true, earnedDate: "2025-09-02" },
    { id: "3", name: "Quiz Master", description: "Score 100% on 5 quizzes", icon: "trophy", earned: true, earnedDate: "2025-09-20" },
    { id: "4", name: "Word Collector", description: "Learn 500 vocabulary words", icon: "book-open", earned: true, earnedDate: "2025-10-10" },
    { id: "5", name: "Grammar Pro", description: "Complete all Grammar modules in B1", icon: "check-circle", earned: false },
    { id: "6", name: "Polyglot", description: "Reach C1 level", icon: "globe", earned: false },
  ]
}

export async function getRecentActivity() {
  const user = await getCurrentUser()
  if (!user) return []

  // Fetch real activity (Progress, QuizAttempt)
  // For now, return mock but it's ready to be swapped
  return [
    { id: "1", type: "lesson", title: "Past Perfect Continuous", time: "2 hours ago", xp: 25 },
    { id: "2", type: "quiz", title: "Vocabulary Quiz: Travel", time: "5 hours ago", xp: 40 },
    { id: "3", type: "forum", title: "Posted in Grammar Help", time: "1 day ago", xp: 10 },
  ]
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

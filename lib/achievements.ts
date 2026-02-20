import { ActivityType } from "@prisma/client"
import prisma from "./prisma"

/**
 * Service to evaluate and award achievements to users
 */
export async function checkAndAwardAchievements(userId: string) {
  // 1. Fetch user data for evaluation
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userAchievements: true,
      progress: {
        where: { completed: true },
        include: { lesson: true }
      },
      quizAttempts: true
    }
  })

  if (!user) return []

  const earnedAchievementIds = new Set(user.userAchievements.map(ua => ua.achievementId))
  const newlyEarned: string[] = []

  // Helper to award
  const award = async (slug: string) => {
    const achievement = await prisma.achievement.findUnique({ where: { slug } })
    if (achievement && !earnedAchievementIds.has(achievement.id)) {
      await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id
        }
      })

      // Log it
      await prisma.activityLog.create({
        data: {
          userId,
          type: ActivityType.ACHIEVEMENT_EARNED,
          title: `Conquista Ganha: ${achievement.name}`,
          xpEarned: 50,
          metadata: { achievementSlug: slug }
        }
      })

      // Award XP
      await prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: 50 } }
      })

      newlyEarned.push(achievement.name)
    }
  }

  // --- Evaluation Logic ---

  // 1. First Step: Complete your first lesson
  if (user.progress.length >= 1) {
    await award("first-step")
  }

  // 2. Week Warrior: 7-day streak
  // We can calculate streak here or rely on user.streak if it's updated
  if ((user.streak || 0) >= 7) {
    await award("week-warrior")
  }

  // 3. Quiz Master: Score 100% on 5 quizzes
  const perfectQuizzes = user.quizAttempts.filter(a => a.score === 100).length
  if (perfectQuizzes >= 5) {
    await award("quiz-master")
  }

  // 4. Word Collector: Learn 500 vocabulary words
  let wordsLearned = 0
  const uniqueWords = new Set<string>()
  user.progress.forEach(p => {
    const vocabData = p.lesson.vocabulary as any
    const wordList = Array.isArray(vocabData)
      ? vocabData
      : (vocabData?.words && Array.isArray(vocabData.words))
        ? vocabData.words
        : []

    if (wordList.length > 0) {
      wordList.forEach((w: any) => {
        if (w.word) uniqueWords.add(w.word.toLowerCase())
      })
    }
  })
  if (uniqueWords.size >= 500) {
    await award("word-collector")
  }

  // 5. Grammar Pro: Complete all Grammar modules in B1
  // This is more complex, might need more queries
  const grammarModules = await prisma.module.findMany({
    where: {
      course: { level: "B1" },
      title: { contains: "Grammar", mode: "insensitive" }
    },
    include: { lessons: true }
  })

  if (grammarModules.length > 0) {
    const allGrammarLessons = grammarModules.flatMap(m => m.lessons.map(l => l.id))
    const completedLessonIds = new Set(user.progress.map(p => p.lessonId))
    const allCompleted = allGrammarLessons.every(id => completedLessonIds.has(id))
    if (allCompleted && allGrammarLessons.length > 0) {
      await award("grammar-pro")
    }
  }

  // 6. Polyglot: Reach C1 level
  if (user.currentLevel === "C1") {
    await award("polyglot")
  }

  return newlyEarned
}

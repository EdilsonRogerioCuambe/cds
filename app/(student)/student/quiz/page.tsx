import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { QuizClient } from "./quiz-client"

export default async function QuizPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/auth/login")

  const userLevel = user.currentLevel || "A1"

  // Fetch quizzes for the user's level or standalone ones (lessonId: null)
  const quizzes = await prisma.quiz.findMany({
    where: {
      OR: [
        { level: userLevel },
        { level: null, lessonId: null } // Optional global quizzes
      ]
    },
    orderBy: { title: 'asc' }
  })

  return <QuizClient initialQuizzes={quizzes} userLevel={userLevel} />
}

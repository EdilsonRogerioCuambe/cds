import { QuizPage } from "@/components/quiz-page"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function Quiz() {
  const user = await getCurrentUser()
  if (!user) redirect("/auth/login")

  const quiz = await prisma.quiz.findFirst()

  if (!quiz) {
    return <div>No quiz available.</div>
  }

  return <QuizPage quiz={quiz} questions={quiz.questions as any[]} />
}

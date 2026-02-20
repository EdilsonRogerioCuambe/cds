import { QuizPage } from "@/components/quiz-page"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function StudentQuizDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const quiz = await prisma.quiz.findUnique({
    where: { id },
  })

  if (!quiz) {
    notFound()
  }

  const questions = Array.isArray(quiz.questions)
    ? quiz.questions
    : (typeof quiz.questions === "string" ? JSON.parse(quiz.questions) : [])

  return (
    <div className="min-h-screen bg-background">
      <QuizPage
        quiz={quiz}
        questions={questions}
      />
    </div>
  )
}

"use client"

import { QuizList } from "@/components/quiz-list"
import { QuizPage } from "@/components/quiz-page"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useState } from "react"

export function QuizClient({ initialQuizzes, userLevel }: { initialQuizzes: any[]; userLevel: string }) {
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)

  const selectedQuiz = initialQuizzes.find(q => q.id === selectedQuizId)

  if (selectedQuizId && selectedQuiz) {
    return (
      <div className="relative">
        <div className="absolute top-4 left-4 z-50">
           <Button variant="ghost" size="sm" onClick={() => setSelectedQuizId(null)} className="gap-2 text-muted-foreground hover:text-foreground">
             <ChevronLeft className="w-4 h-4" />
             Voltar
           </Button>
        </div>
        <QuizPage
          quiz={selectedQuiz}
          questions={Array.isArray(selectedQuiz.questions) ? selectedQuiz.questions : []}
        />
      </div>
    )
  }

  return (
    <QuizList
      quizzes={initialQuizzes}
      onSelect={setSelectedQuizId}
    />
  )
}

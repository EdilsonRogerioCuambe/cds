"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
    ArrowRight,
    Award,
    CheckCircle2,
    ChevronRight,
    Clock,
    RotateCcw,
    XCircle,
    Zap,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"
type QuizState = "intro" | "active" | "feedback" | "results"

export function QuizPage({ quiz, questions: quizQuestions }: { quiz: any; questions: any[] }) {
  const [state, setState] = useState<QuizState>("intro")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answers, setAnswers] = useState<
    { questionId: string; answer: string; correct: boolean }[]
  >([])
  const [timer, setTimer] = useState(600) // 10 minutes
  const [timerActive, setTimerActive] = useState(false)

  const currentQuestion = quizQuestions[currentIndex]
  const totalQuestions = quizQuestions.length

  useEffect(() => {
    if (!timerActive || timer <= 0) return
    const interval = setInterval(() => setTimer((t) => t - 1), 1000)
    return () => clearInterval(interval)
  }, [timerActive, timer])

  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }, [])

  const startQuiz = () => {
    setState("active")
    setTimerActive(true)
  }

  const submitAnswer = () => {
    if (!selectedAnswer) return
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    setAnswers([
      ...answers,
      {
        questionId: currentQuestion.id,
        answer: selectedAnswer,
        correct: isCorrect,
      },
    ])
    setState("feedback")
  }

  const nextQuestion = () => {
    if (currentIndex + 1 >= totalQuestions) {
      setState("results")
      setTimerActive(false)
    } else {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(null)
      setState("active")
    }
  }

  const resetQuiz = () => {
    setState("intro")
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setAnswers([])
    setTimer(600)
    setTimerActive(false)
  }

  const score = answers.filter((a) => a.correct).length
  const scorePercent = Math.round((score / totalQuestions) * 100)

  // INTRO
  if (state === "intro") {
    return (
      <div className="p-4 lg:p-8 max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto mb-5">
              <Zap className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold font-display text-foreground mb-2">
              B1 Grammar Quiz
            </h1>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Test your knowledge of intermediate grammar including perfect
              tenses, conditionals, and vocabulary. {totalQuestions} questions,
              10 minutes.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground mb-8">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                10 minutes
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {totalQuestions} questions
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                50 XP reward
              </span>
            </div>
            <Button size="lg" onClick={startQuiz} className="px-8">
              Start Quiz
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // RESULTS
  if (state === "results") {
    return (
      <div className="p-4 lg:p-8 max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div
              className={cn(
                "flex items-center justify-center w-20 h-20 rounded-full mx-auto mb-5",
                scorePercent >= 70
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive"
              )}
            >
              {scorePercent >= 70 ? (
                <Award className="w-10 h-10" />
              ) : (
                <RotateCcw className="w-10 h-10" />
              )}
            </div>
            <h1 className="text-3xl font-bold font-display text-foreground mb-1">
              {scorePercent >= 90
                ? "Excellent!"
                : scorePercent >= 70
                  ? "Great Job!"
                  : scorePercent >= 50
                    ? "Keep Practicing"
                    : "Try Again"}
            </h1>
            <p className="text-muted-foreground mb-6">
              You scored {score} out of {totalQuestions}
            </p>

            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold font-display text-foreground">
                  {scorePercent}%
                </div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <div className="text-3xl font-bold font-display text-foreground">
                  {formatTime(600 - timer)}
                </div>
                <div className="text-sm text-muted-foreground">Time</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <div className="text-3xl font-bold font-display text-primary">
                  +{score * 5}
                </div>
                <div className="text-sm text-muted-foreground">XP Earned</div>
              </div>
            </div>

            {/* Answers Review */}
            <div className="space-y-2 mb-8 text-left">
              {quizQuestions.map((q: any, i: number) => {
                const ans = answers[i]
                return (
                  <div
                    key={q.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border text-sm",
                      ans?.correct
                        ? "border-success/20 bg-success/[0.03]"
                        : "border-destructive/20 bg-destructive/[0.03]"
                    )}
                  >
                    {ans?.correct ? (
                      <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive shrink-0" />
                    )}
                    <span className="text-foreground flex-1 truncate">
                      {q.question.slice(0, 60)}...
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={resetQuiz}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Retry Quiz
              </Button>
              <Button asChild>
                <a href="/courses">Back to Courses</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ACTIVE / FEEDBACK
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer

  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="font-medium">
            {currentIndex + 1} / {totalQuestions}
          </Badge>
          <Badge variant="outline" className="text-xs capitalize">
            {currentQuestion.type.replace("-", " ")}
          </Badge>
        </div>
        <div
          className={cn(
            "flex items-center gap-1.5 text-sm font-medium",
            timer < 60 ? "text-destructive" : "text-muted-foreground"
          )}
        >
          <Clock className="w-4 h-4" />
          {formatTime(timer)}
        </div>
      </div>

      {/* Progress */}
      <Progress
        value={((currentIndex + (state === "feedback" ? 1 : 0)) / totalQuestions) * 100}
        className="h-2 mb-6"
      />

      {/* Question Card */}
      <Card className="mb-4">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6 leading-relaxed">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options?.map((option: string) => {
              const isSelected = selectedAnswer === option
              const isAnswer = option === currentQuestion.correctAnswer
              const showResult = state === "feedback"

              return (
                <button
                  key={option}
                  onClick={() =>
                    state === "active" ? setSelectedAnswer(option) : undefined
                  }
                  disabled={state === "feedback"}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 rounded-xl border text-left text-sm transition-all",
                    state === "active" && !isSelected && "border-border hover:border-primary/40 hover:bg-primary/[0.02]",
                    state === "active" && isSelected && "border-primary bg-primary/5 ring-1 ring-primary/20",
                    showResult && isAnswer && "border-success bg-success/5",
                    showResult && isSelected && !isAnswer && "border-destructive bg-destructive/5",
                    showResult && !isAnswer && !isSelected && "border-border opacity-50"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg text-xs font-semibold shrink-0",
                      state === "active" && !isSelected && "bg-muted text-muted-foreground",
                      state === "active" && isSelected && "bg-primary text-primary-foreground",
                      showResult && isAnswer && "bg-success text-success-foreground",
                      showResult && isSelected && !isAnswer && "bg-destructive text-destructive-foreground",
                      showResult && !isAnswer && !isSelected && "bg-muted text-muted-foreground"
                    )}
                  >
                    {showResult && isAnswer ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : showResult && isSelected && !isAnswer ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      String.fromCharCode(
                        65 + (currentQuestion.options?.indexOf(option) ?? 0)
                      )
                    )}
                  </div>
                  <span className="text-foreground">{option}</span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Feedback */}
      {state === "feedback" && (
        <Card
          className={cn(
            "mb-4 border",
            isCorrect ? "border-success/30 bg-success/[0.03]" : "border-destructive/30 bg-destructive/[0.03]"
          )}
        >
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold text-foreground text-sm mb-1">
                  {isCorrect ? "Correct!" : "Not quite right"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {state === "active" && (
          <Button
            onClick={submitAnswer}
            disabled={!selectedAnswer}
            className="px-6"
          >
            Check Answer
          </Button>
        )}
        {state === "feedback" && (
          <Button onClick={nextQuestion} className="px-6">
            {currentIndex + 1 >= totalQuestions ? "See Results" : "Next Question"}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  )
}

"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { saveQuizAttempt } from "@/lib/actions/student"
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
import { toast } from "sonner"

type QuizState = "intro" | "active" | "feedback" | "results"

export function QuizPage({ quiz, questions: quizQuestions }: { quiz: any; questions: any[] }) {
  const [state, setState] = useState<QuizState>("intro")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answers, setAnswers] = useState<
    { questionId: string; answer: string; correct: boolean }[]
  >([])
  const [timer, setTimer] = useState(quiz.timeLimit || 600)
  const [timerActive, setTimerActive] = useState(false)
  const [hasSaved, setHasSaved] = useState(false)

  const currentQuestion = quizQuestions[currentIndex]
  const totalQuestions = quizQuestions.length

  useEffect(() => {
    if (state === "results" && !hasSaved) {
      const score = answers.filter((a) => a.correct).length
      const timeSpent = (quiz.timeLimit || 600) - timer
      saveQuizAttempt(quiz.id, score, totalQuestions, timeSpent)
        .then(() => {
          setHasSaved(true)
          toast.success("Progresso salvo com sucesso! 🏆")
        })
        .catch(err => {
          console.error(err)
          toast.error("Erro ao salvar progresso.")
        })
    }
  }, [state, hasSaved, answers, quiz.id, totalQuestions, timer, quiz.timeLimit])

  useEffect(() => {
    if (!timerActive || timer <= 0) return
    const interval = setInterval(() => setTimer((t: number) => t - 1), 1000)
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
    if (selectedAnswer === null || selectedAnswer === "") return

    // Normalize comparison for fill_blank
    const isCorrect = selectedAnswer.toString().toLowerCase().trim() ===
                      (currentQuestion.correctAnswer || "").toString().toLowerCase().trim()

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
    setTimer(quiz.timeLimit || 600)
    setTimerActive(false)
    setHasSaved(false)
  }

  const score = answers.filter((a) => a.correct).length
  const scorePercent = Math.round((score / totalQuestions) * 100)

  // INTRO
  if (state === "intro") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="max-w-xl w-full border-primary/20 bg-primary/[0.02] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full -ml-12 -mb-12 blur-2xl" />

          <CardContent className="p-10 text-center relative">
            <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-primary text-primary-foreground mx-auto mb-8 shadow-xl shadow-primary/20 animate-in zoom-in duration-500">
              <Zap className="w-10 h-10 fill-current" />
            </div>

            <Badge variant="outline" className="mb-4 bg-primary/5 border-primary/20 text-primary">
              Nível {quiz.level || "Iniciante"}
            </Badge>

            <h1 className="text-3xl font-bold font-display text-foreground mb-3 tracking-tight">
              {quiz.title}
            </h1>

            <p className="text-muted-foreground mb-8 text-balance leading-relaxed">
              {quiz.description || "Teste seus conhecimentos e ganhe XP extra para subir de nível."}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-10 pb-8 border-b border-primary/10">
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-primary">
                   <Clock className="w-4 h-4" />
                   <span className="font-bold">{Math.floor((quiz.timeLimit || 600) / 60)}m</span>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Tempo</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-primary">
                   <CheckCircle2 className="w-4 h-4" />
                   <span className="font-bold">{totalQuestions}</span>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Questões</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-primary">
                   <Award className="w-4 h-4" />
                   <span className="font-bold">+{quiz.points || 50} XP</span>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Recompensa</p>
              </div>
            </div>

            <Button size="lg" onClick={startQuiz} className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg shadow-primary/30 transition-all hover:scale-[1.02]">
              Começar Desafio
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // RESULTS
  if (state === "results") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-border bg-card shadow-2xl overflow-hidden">
          <div className={cn(
             "h-48 flex flex-col items-center justify-center text-white relative overflow-hidden",
             scorePercent >= 70 ? "bg-gradient-to-br from-success/80 to-success" : "bg-gradient-to-br from-destructive/80 to-destructive"
          )}>
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <Zap key={i} className="absolute w-8 h-8 rotate-12" style={{ top: `${Math.random()*100}%`, left: `${Math.random()*100}%` }} />
              ))}
            </div>

            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 border border-white/30 animate-in zoom-in duration-700">
               {scorePercent >= 70 ? <Award className="w-12 h-12" /> : <RotateCcw className="w-12 h-12" />}
            </div>
            <h2 className="text-3xl font-bold font-display uppercase tracking-widest">
               {scorePercent >= 70 ? "Missão Cumprida!" : "Tente Novamente"}
            </h2>
          </div>

          <CardContent className="p-8 text-center -mt-6">
            <Card className="border-border/50 shadow-xl mb-8 translate-y-0">
               <CardContent className="p-6">
                  <div className="grid grid-cols-3 divide-x divide-border/50">
                    <div className="px-2">
                       <div className="text-3xl font-black font-display text-foreground">{scorePercent}%</div>
                       <p className="text-[10px] uppercase font-bold text-muted-foreground mt-1">Pontuação</p>
                    </div>
                    <div className="px-2">
                       <div className="text-3xl font-black font-display text-foreground">{formatTime((quiz.timeLimit || 600) - timer)}</div>
                       <p className="text-[10px] uppercase font-bold text-muted-foreground mt-1">Tempo</p>
                    </div>
                    <div className="px-2">
                       <div className="text-3xl font-black font-display text-primary">+{score * 5}</div>
                       <p className="text-[10px] uppercase font-bold text-muted-foreground mt-1">XP Ganho</p>
                    </div>
                  </div>
               </CardContent>
            </Card>

            <div className="space-y-3 mb-8 text-left max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-1">Revisão de Respostas</p>
              {quizQuestions.map((q: any, i: number) => {
                const ans = answers[i]
                return (
                  <div key={q.id} className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border text-sm transition-colors",
                    ans?.correct ? "border-success/20 bg-success/[0.03]" : "border-destructive/20 bg-destructive/[0.03]"
                  )}>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      ans?.correct ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                    )}>
                      {ans?.correct ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0 pr-4">
                      <p className="font-semibold text-foreground truncate">{q.question}</p>
                      <p className="text-[10px] text-muted-foreground truncate italic">Sua resposta: {ans?.answer}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={resetQuiz} className="flex-1 h-12 font-bold rounded-xl border-2">
                <RotateCcw className="w-4 h-4 mr-2" />
                Refazer Quiz
              </Button>
              <Button asChild className="flex-1 h-12 font-bold rounded-xl shadow-lg shadow-primary/20">
                <a href="/student/dashboard">Continuar</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ACTIVE / FEEDBACK
  const isCorrect = selectedAnswer?.toString().toLowerCase().trim() === (currentQuestion.correctAnswer || "").toString().toLowerCase().trim()

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* TOP STATUS BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/50 backdrop-blur-sm border border-border p-4 rounded-2xl shadow-sm">
          <div className="flex items-center gap-4 w-full sm:w-auto">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-bold font-display uppercase tracking-widest text-foreground">
                   Questão {currentIndex + 1} de {totalQuestions}
                </span>
             </div>
             <Badge variant="secondary" className="hidden sm:inline-flex bg-primary/10 text-primary border-none text-[10px] font-bold">
                {currentQuestion.type?.replace("_", " ") || "QUIZ"}
             </Badge>
          </div>
          <div className={cn(
            "flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-mono font-bold",
            timer < 60 ? "bg-destructive/10 border-destructive animate-pulse text-destructive" : "bg-muted border-border text-muted-foreground"
          )}>
            <Clock className="w-4 h-4" />
            {formatTime(timer)}
          </div>
        </div>

        <Progress value={(currentIndex / totalQuestions) * 100} className="h-2 rounded-full overflow-hidden bg-primary/10" />

        {/* QUESTION AREA */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <Card className="border-2 border-border shadow-2xl overflow-hidden bg-card">
              {currentQuestion.type === "listening" && currentQuestion.audioScript && (
                 <div className="bg-primary/5 p-6 border-b border-border text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-3 shadow-inner">
                       <Zap className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-4">Listening Script</p>
                    <div className="bg-card/80 p-4 rounded-xl border border-primary/10 italic text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
                       "{currentQuestion.audioScript}"
                    </div>
                 </div>
              )}

              <CardContent className="p-8 sm:p-12">
                 <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground text-center mb-10 leading-tight">
                    {currentQuestion.question}
                 </h2>

                 <div className="grid grid-cols-1 gap-4">
                    {currentQuestion.options && currentQuestion.options.length > 0 ? (
                       currentQuestion.options.map((option: string, i: number) => {
                          const isSelected = selectedAnswer === option
                          const isAnswer = option === currentQuestion.correctAnswer
                          const showResult = state === "feedback"

                          return (
                             <button
                                key={i}
                                onClick={() => state === "active" ? setSelectedAnswer(option) : undefined}
                                disabled={state === "feedback"}
                                className={cn(
                                   "group relative flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-300",
                                   state === "active" && !isSelected && "border-border hover:border-primary/40 hover:bg-primary/[0.03] hover:-translate-y-0.5",
                                   state === "active" && isSelected && "border-primary bg-primary/[0.05] ring-4 ring-primary/5",
                                   showResult && isAnswer && "border-success bg-success/5 animate-pulse",
                                   showResult && isSelected && !isAnswer && "border-destructive bg-destructive/5",
                                   showResult && !isAnswer && !isSelected && "border-border/50 opacity-40 grayscale-[0.5]"
                                )}
                             >
                                <div className={cn(
                                   "flex items-center justify-center w-10 h-10 rounded-xl text-sm font-black transition-colors duration-300",
                                   state === "active" && !isSelected && "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
                                   state === "active" && isSelected && "bg-primary text-primary-foreground",
                                   showResult && isAnswer && "bg-success text-success-foreground",
                                   showResult && isSelected && !isAnswer && "bg-destructive text-destructive-foreground",
                                   showResult && !isAnswer && !isSelected && "bg-muted text-muted-foreground"
                                )}>
                                   {showResult && isAnswer ? <CheckCircle2 className="w-5 h-5" /> :
                                    showResult && isSelected && !isAnswer ? <XCircle className="w-5 h-5" /> :
                                    String.fromCharCode(65 + i)}
                                </div>
                                <span className="font-semibold text-lg">{option}</span>
                                {state === "active" && isSelected && (
                                   <div className="absolute right-6 animate-in fade-in zoom-in">
                                      <div className="w-2 h-2 rounded-full bg-primary" />
                                   </div>
                                )}
                             </button>
                          )
                       })
                    ) : (
                       <div className="space-y-6 max-w-md mx-auto w-full">
                          <div className="relative group">
                             <Input
                                placeholder="Digite sua resposta..."
                                value={selectedAnswer || ""}
                                onChange={(e) => setSelectedAnswer(e.target.value)}
                                disabled={state === "feedback"}
                                className="h-16 text-xl text-center rounded-2xl border-2 border-primary/20 focus-visible:ring-primary focus-visible:border-primary transition-all bg-muted/30"
                             />
                             <div className="absolute -bottom-1 -right-1 w-full h-full bg-primary/5 rounded-2xl -z-10 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
                          </div>
                          {state === "feedback" && !isCorrect && (
                             <div className="animate-in slide-in-from-top-2 flex items-center justify-center gap-2 text-success font-bold text-lg bg-success/5 p-4 rounded-xl border border-success/20">
                                <CheckCircle2 className="w-5 h-5" />
                                <span>Resposta: {currentQuestion.correctAnswer}</span>
                             </div>
                          )}
                       </div>
                    )}
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* FEEDBACK & NAVIGATION */}
        <div className="min-h-[100px] transition-all">
           {state === "feedback" && (
              <div className={cn(
                "animate-in slide-in-from-top-6 duration-500 p-6 rounded-2xl border-2 flex items-start gap-5",
                isCorrect ? "bg-success/5 border-success/30" : "bg-destructive/5 border-destructive/30"
              )}>
                 <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                    isCorrect ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"
                 )}>
                    {isCorrect ? <Zap className="w-6 h-6 fill-current" /> : <XCircle className="w-6 h-6" />}
                 </div>
                 <div className="space-y-1">
                    <h3 className="font-black font-display text-lg uppercase tracking-tight">
                       {isCorrect ? "Incrível! +XP para você" : "Quase lá!"}
                    </h3>
                    <p className="text-muted-foreground text-sm font-medium leading-relaxed italic">
                       {currentQuestion.explanation || (isCorrect ? "Você acertou em cheio!" : "Continue firme, o aprendizado virá com o erro.")}
                    </p>
                 </div>
              </div>
           )}
        </div>

        <div className="flex justify-center sm:justify-end pb-12">
           {state === "active" ? (
              <Button
                onClick={submitAnswer}
                disabled={!selectedAnswer}
                className="h-16 px-12 text-lg font-black rounded-2xl shadow-xl shadow-primary/30 transition-all hover:scale-[1.03] active:scale-[0.98]"
              >
                 FINALIZAR RESPOSTA
                 <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
           ) : (
              <Button
                onClick={nextQuestion}
                className="h-16 px-12 text-lg font-black rounded-2xl shadow-xl shadow-primary/30 transition-all hover:scale-[1.03] active:scale-[0.98]"
              >
                 {currentIndex + 1 >= totalQuestions ? "VER RESULTADOS" : "PRÓXIMA QUESTÃO"}
                 <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
           )}
        </div>
      </div>
    </div>
  )
}

"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { saveQuizAttempt } from "@/lib/actions/student"
import { cn } from "@/lib/utils"
import {
    ArrowLeft,
    ArrowRight,
    Award,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    FileText,
    Music,
    Pause,
    Play,
    RotateCcw,
    Trophy,
    XCircle,
    Zap
} from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

type QuizState = "intro" | "active" | "results"

interface Question {
  id: string
  type: "multiple-choice" | "true-false" | "fill-blank" | "matching" | "ordering" | "listening" | "essay"
  question: string
  options?: string[]
  correctAnswer: any
  explanation?: string
  pairs?: { left: string, right: string }[]
  items?: string[]
  mediaUrl?: string
  audioScript?: string
}

export function QuizPage({ quiz, questions: quizQuestions }: { quiz: any; questions: Question[] }) {
  const [state, setState] = useState<QuizState>("intro")
  const [currentIndex, setCurrentIndex] = useState(0)

  // Answers state
  // For multiple-choice/true-false/fill-blank/essay: string
  // For matching: Record<string, string> (left id -> right value)
  // For ordering: string[] (ordered items)
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, any>>({})

  const [timer, setTimer] = useState(quiz.timeLimit || 600)
  const [timerActive, setTimerActive] = useState(false)
  const [hasSaved, setHasSaved] = useState(false)
  const [results, setResults] = useState<{ score: number, total: number, timeSpent: number } | null>(null)
  const [isCurrentChecked, setIsCurrentChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const currentQuestion = quizQuestions[currentIndex] || { id: "empty", type: "multiple-choice", question: "Questão não encontrada" }
  const totalQuestions = quizQuestions.length

  // Audio state for listening questions
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (state === "active" && !timerActive) {
      setTimerActive(true)
    }
  }, [state])

  useEffect(() => {
    if (!timerActive || timer <= 0) return
    if (timer === 0 && state === "active") {
        submitQuiz()
        return
    }
    const interval = setInterval(() => setTimer((t: number) => t - 1), 1000)
    return () => clearInterval(interval)
  }, [timerActive, timer, state])

  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }, [])

  const startQuiz = () => {
    setState("active")
  }

  const handleAnswerChange = (value: any) => {
    setCurrentAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }))
  }

  const validateAnswer = (q: Question, answer: any): boolean => {
    if (!answer) return false
    const type = q.type.replace("_", "-")

    switch (type) {
      case "multiple-choice":
      case "true-false":
      case "fill-blank":
        return answer.toString().toLowerCase().trim() === q.correctAnswer.toString().toLowerCase().trim()

      case "matching":
        // answer is Record<string, string>
        // q.pairs is {left, right}[]
        const userPairs = answer as Record<string, string>
        return q.pairs?.every(p => userPairs[p.left] === p.right) || false

      case "ordering":
        // answer is string[]
        // q.items is string[] in correct order
        const userOrder = answer as string[]
        return userOrder.every((item, idx) => item === q.items?.[idx])

      case "listening":
         return answer.toString().toLowerCase().trim() === q.correctAnswer.toString().toLowerCase().trim()

      case "essay":
        return true // Essays are always "correct" for auto-scoring, or require manual grading

      default:
        return false
    }
  }

  const getQuestionText = (q: Question) => {
    return q.question || (q as any).text || "Enunciado não disponível"
  }

  const submitQuiz = async () => {
    setTimerActive(false)
    const finalAnswers = quizQuestions.map(q => ({
      questionId: q.id,
      answer: currentAnswers[q.id],
      correct: validateAnswer(q, currentAnswers[q.id])
    }))

    const score = finalAnswers.filter(a => a.correct).length
    const timeSpent = (quiz.timeLimit || 600) - timer

    setResults({ score, total: totalQuestions, timeSpent })
    setState("results")

    try {
      await saveQuizAttempt(quiz.id, score, totalQuestions, timeSpent)
      setHasSaved(true)
      toast.success("Progresso salvo com sucesso! 🏆")
    } catch (err) {
      console.error(err)
      toast.error("Erro ao salvar progresso.")
    }
  }

  const resetQuiz = () => {
    setState("intro")
    setCurrentIndex(0)
    setCurrentAnswers({})
    setIsCurrentChecked(false)
    setIsCorrect(null)
    setTimer(quiz.timeLimit || 600)
    setTimerActive(false)
    setHasSaved(false)
    setResults(null)
  }

  const checkCurrentAnswer = () => {
    const answer = currentAnswers[currentQuestion.id]
    if (!answer) return
    const correct = validateAnswer(currentQuestion, answer)
    setIsCorrect(correct)
    setIsCurrentChecked(true)
    if (!correct) {
      toast.error("Resposta incorreta. Tente novamente ou avance.")
    } else {
      toast.success("Correto! Bom trabalho.")
    }
  }

  const nextQuestion = () => {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex(prev => prev + 1)
      setIsCurrentChecked(false)
      setIsCorrect(null)
    }
  }

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setIsCurrentChecked(false)
      setIsCorrect(null)
    }
  }

  // --- RENDERERS FOR DIFFERENT TYPES ---

  const renderMultipleChoice = () => (
    <div className={cn(
      "grid gap-4",
      (currentQuestion.options || []).some(o => o.length > 30) ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
    )}>
      {(currentQuestion.options || []).length > 0 ? (
        currentQuestion.options?.map((option, i) => {
          const isSelected = currentAnswers[currentQuestion.id] === option
          return (
            <button
              key={i}
              disabled={isCurrentChecked}
              onClick={() => handleAnswerChange(option)}
              className={cn(
                "flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all",
                isSelected
                  ? isCurrentChecked
                    ? isCorrect
                      ? "border-success bg-success/10"
                      : "border-destructive bg-destructive/10"
                    : "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/40 hover:bg-muted/50",
                isCurrentChecked && !isSelected && "opacity-50"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0 transition-colors",
                isSelected
                  ? isCurrentChecked
                    ? isCorrect ? "bg-success text-white" : "bg-destructive text-white"
                    : "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              )}>
                {String.fromCharCode(65 + i)}
              </div>
              <span className="font-bold text-sm flex-1">{option}</span>
              {isCurrentChecked && isSelected && (
                isCorrect ? <CheckCircle2 className="w-5 h-5 text-success" /> : <XCircle className="w-5 h-5 text-destructive" />
              )}
            </button>
          )
        })
      ) : (
        <div className="p-8 text-center border-2 border-dashed rounded-2xl text-muted-foreground w-full col-span-full">
          Nenhuma opção configurada para esta questão.
        </div>
      )}
    </div>
  )

  const renderTrueFalse = () => (
    <div className="grid grid-cols-2 gap-4">
      {["true", "false"].map((val) => {
        const isSelected = currentAnswers[currentQuestion.id] === val
        return (
          <button
            key={val}
            disabled={isCurrentChecked}
            onClick={() => handleAnswerChange(val)}
            className={cn(
              "p-8 rounded-3xl border-2 font-display text-lg font-black transition-all flex flex-col items-center gap-4",
              isSelected
                ? isCurrentChecked
                  ? isCorrect
                    ? "border-success bg-success/10 text-success"
                    : "border-destructive bg-destructive/10 text-destructive"
                  : "border-primary bg-primary/5 text-primary shadow-lg"
                : "border-border hover:border-primary/40 text-muted-foreground",
              isCurrentChecked && !isSelected && "opacity-50"
            )}
          >
            <div className={cn(
               "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
               isSelected ? (isCurrentChecked ? (isCorrect ? "bg-success text-white" : "bg-destructive text-white") : "bg-primary text-white") : "bg-muted text-muted-foreground"
            )}>
               {val === "true" ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            </div>
            {val === "true" ? "Verdadeiro" : "Falso"}
          </button>
        )
      })}
    </div>
  )

  const renderFillBlank = () => (
    <div className="max-w-md mx-auto space-y-4">
      <Input
        disabled={isCurrentChecked}
        value={currentAnswers[currentQuestion.id] || ""}
        onChange={(e) => handleAnswerChange(e.target.value)}
        className={cn(
          "h-16 text-2xl font-bold bg-muted/30 border-2 rounded-2xl text-center transition-all",
          isCurrentChecked && (isCorrect ? "border-success bg-success/10 text-success" : "border-destructive bg-destructive/10 text-destructive")
        )}
        placeholder="Digite sua resposta aqui..."
      />
      <p className="text-center text-xs text-muted-foreground italic">
        Preencha a lacuna com a palavra ou frase correta conforme o contexto.
      </p>
    </div>
  )

  const renderMatching = () => {
    const pairs = currentQuestion.pairs || []
    const leftItems = pairs.map(p => p.left)
    const rightItems = pairs.map(p => p.right).sort(() => Math.random() - 0.5)
    const currentMatches = currentAnswers[currentQuestion.id] || {}

    return (
      <div className="space-y-6">
        <p className="text-center text-xs text-muted-foreground uppercase tracking-widest font-bold">Associe os termos às suas definições</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
           <div className="space-y-3">
              {leftItems.map((left, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-1 p-4 rounded-xl border border-muted-foreground/20 bg-muted/30 font-bold text-sm">
                    {left}
                  </div>
                </div>
              ))}
           </div>
            <div className="space-y-3">
              {leftItems.map((left, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-4 h-0.5 bg-primary/20 shrink-0 hidden md:block" />
                  <select
                    disabled={isCurrentChecked}
                    value={currentMatches[left] || ""}
                    onChange={(e) => {
                      const newMatches = { ...currentMatches, [left]: e.target.value }
                      handleAnswerChange(newMatches)
                    }}
                    className={cn(
                       "flex-1 h-13 p-4 rounded-xl border-2 bg-card text-sm font-semibold outline-none transition-all",
                       isCurrentChecked
                          ? (currentMatches[left] === pairs.find(p => p.left === left)?.right ? "border-success bg-success/5" : "border-destructive bg-destructive/5")
                          : "border-primary/20 focus:border-primary"
                    )}
                  >
                    <option value="">Selecionar par...</option>
                    {rightItems.map((right, rIdx) => (
                      <option key={rIdx} value={right}>{right}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
        </div>
      </div>
    )
  }

  const renderOrdering = () => {
    const items = currentAnswers[currentQuestion.id] || [...(currentQuestion.items || [])].sort(() => Math.random() - 0.5)
    const move = (from: number, to: number) => {
      const newItems = [...items]
      const [removed] = newItems.splice(from, 1)
      newItems.splice(to, 0, removed)
      handleAnswerChange(newItems)
    }

    return (
      <div className="space-y-4 max-w-lg mx-auto">
        <p className="text-center text-xs text-muted-foreground uppercase tracking-widest font-bold mb-6">Coloque os itens na ordem correta</p>
        <div className="space-y-2">
          {items.map((item: string, idx: number) => (
            <div key={idx} className={cn(
               "flex items-center gap-3 p-4 rounded-xl border-2 bg-card group transition-all",
               isCurrentChecked
                  ? (items[idx] === (currentQuestion.items || [])[idx] ? "border-success bg-success/5" : "border-destructive bg-destructive/5")
                  : "border-border hover:border-primary/30"
            )}>
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-black text-xs shrink-0">
                {idx + 1}
              </div>
              <span className="flex-1 text-sm font-semibold">{item}</span>
              {!isCurrentChecked && (
                <div className="flex flex-col gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6" disabled={idx === 0} onClick={() => move(idx, idx - 1)}>
                    <ChevronLeft className="w-4 h-4 rotate-90" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" disabled={idx === items.length - 1} onClick={() => move(idx, idx + 1)}>
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderListening = () => (
    <div className="space-y-8 max-w-xl mx-auto">
      <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto shadow-lg">
          <Music className="w-8 h-8" />
        </div>
        <div>
          <h4 className="font-bold text-lg mb-1">Reprodutor de Áudio</h4>
          <p className="text-sm text-muted-foreground">Ouça atentamente antes de responder.</p>
        </div>
        <div className="flex items-center justify-center gap-4 py-4">
           <Button
            size="icon"
            className="w-14 h-14 rounded-full shadow-xl"
            onClick={() => {
              if (isPlaying) audioRef.current?.pause()
              else audioRef.current?.play()
              setIsPlaying(!isPlaying)
            }}
           >
             {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
           </Button>
           <audio ref={audioRef} src={currentQuestion.mediaUrl} onEnded={() => setIsPlaying(false)} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
        </div>
        {currentQuestion.audioScript && (
          <details className="text-left group">
            <summary className="text-xs font-bold text-primary cursor-pointer hover:underline list-none text-center">Mostrar Transcrição (Dica)</summary>
            <div className="mt-4 p-4 bg-card rounded-xl border text-sm italic text-muted-foreground leading-relaxed">"{currentQuestion.audioScript}"</div>
          </details>
        )}
      </div>
      <div className="space-y-4">
        <Label className="text-center block font-bold text-foreground">Sua resposta baseada no áudio:</Label>
        <Input
          disabled={isCurrentChecked}
          placeholder="Digite o que você ouviu ou a resposta..."
          value={currentAnswers[currentQuestion.id] || ""}
          onChange={(e) => handleAnswerChange(e.target.value)}
          className={cn(
             "h-14 text-center text-lg border-2 transition-all",
             isCurrentChecked && (isCorrect ? "border-success bg-success/10" : "border-destructive bg-destructive/10")
          )}
        />
      </div>
    </div>
  )

  const renderEssay = () => (
    <div className="space-y-4">
      <Textarea
        disabled={isCurrentChecked}
        placeholder="Escreva sua resposta detalhada aqui..."
        value={currentAnswers[currentQuestion.id] || ""}
        onChange={(e) => handleAnswerChange(e.target.value)}
        className={cn(
           "min-h-[250px] text-lg leading-relaxed p-6 rounded-2xl border-2 transition-all focus-visible:ring-primary",
           isCurrentChecked && "bg-muted/30 opacity-80"
        )}
      />
      <div className="flex justify-between items-center text-xs text-muted-foreground font-medium uppercase tracking-wider">
        <span>Responda com clareza e objetividade</span>
        <span>{(currentAnswers[currentQuestion.id] || "").length} caracteres</span>
      </div>
    </div>
  )

  const renderCurrentQuestion = () => {
    const type = currentQuestion.type.replace("_", "-")
    switch (type) {
      case "multiple-choice": return renderMultipleChoice()
      case "true-false": return renderTrueFalse()
      case "fill-blank": return renderFillBlank()
      case "matching": return renderMatching()
      case "ordering": return renderOrdering()
      case "listening": return renderListening()
      case "essay": return renderEssay()
      default: return null
    }
  }

  // --- MAIN STATES ---

  if (state === "intro") {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-card rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.1)] overflow-hidden border border-border/50 transition-all hover:shadow-[0_40px_120px_rgba(0,0,0,0.15)]">
           {/* Left side: Artwork/Visual */}
           <div className="hidden md:flex flex-col bg-[#132747] text-white p-12 justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#10D79E]/10 rounded-full -ml-32 -mb-32 blur-[80px]" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-12">
                   <div className="w-10 h-10 rounded-xl bg-[#10D79E] flex items-center justify-center">
                     <Zap className="w-6 h-6 text-[#132747] fill-current" />
                   </div>
                   <span className="font-display font-black text-xl tracking-tighter">CDS Challenge</span>
                </div>

                <h1 className="text-5xl font-display font-black leading-[1.1] mb-6">
                   {quiz.title}
                </h1>
                <p className="text-white/60 text-lg leading-relaxed max-w-xs">
                   {quiz.description || "Desafios dinâmicos projetados para acelerar seu aprendizado de inglês."}
                </p>
              </div>

              <div className="relative z-10 bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#10D79E]/20 text-[#10D79E] flex items-center justify-center">
                       <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-xs uppercase font-black tracking-widest text-[#10D79E]">Recompensa Total</p>
                       <p className="text-2xl font-display font-black">{quiz.points || 100} XP</p>
                    </div>
                 </div>
                 <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#10D79E] w-2/3" />
                 </div>
              </div>
           </div>

           {/* Right side: Actions */}
           <div className="p-12 md:p-16 flex flex-col justify-center">
              <Badge variant="secondary" className="mb-6 w-fit bg-primary/10 text-primary border-none text-[10px] font-black tracking-[0.2em] uppercase py-1 px-3">
                 Level {quiz.level || "Any"}
              </Badge>
              <h2 className="text-3xl font-bold font-display text-foreground mb-4 leading-tight">{quiz.title}</h2>
              <p className="text-muted-foreground mb-10 leading-relaxed italic border-l-4 border-primary/20 pl-4 py-2">
                 "{quiz.description || "Este desafio testará sua compreensão auditiva, gramática e vocabulário contextual."}"
              </p>

              <div className="space-y-4 mb-12">
                 {[
                   { icon: Clock, label: "Tempo Limite", value: `${Math.floor((quiz.timeLimit || 600) / 60)} minutos` },
                   { icon: FileText, label: "Questões", value: `${totalQuestions} itens variados` },
                   { icon: Award, label: "Meta de Aprovação", value: `${quiz.passingScore || 70}% de acerto` }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 border-b border-border transition-colors pb-1 group-hover:border-primary/20">
                         <p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider mb-0.5">{item.label}</p>
                         <p className="text-sm font-bold text-foreground">{item.value}</p>
                      </div>
                   </div>
                 ))}
              </div>

              <Button size="lg" onClick={startQuiz} className="w-full h-16 text-xl font-black rounded-2xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all gap-3 bg-primary text-primary-foreground border-b-4 border-primary-foreground/20">
                 INICIAR AGORA
                 <ArrowRight className="w-6 h-6" />
              </Button>
           </div>
        </div>
      </div>
    )
  }

  if (state === "results") {
    const scorePercent = results ? Math.round((results.score / results.total) * 100) : 0
    const isPassed = scorePercent >= (quiz.passingScore || 70)

    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full space-y-8 animate-in zoom-in duration-500">
           <Card className="rounded-[3rem] border-none shadow-[0_40px_100px_rgba(0,0,0,0.15)] overflow-hidden">
              <div className={cn(
                "h-64 flex flex-col items-center justify-center text-white relative",
                isPassed ? "bg-gradient-to-br from-[#10D79E] to-[#0ba076]" : "bg-gradient-to-br from-destructive to-destructive/80"
              )}>
                 {/* Success Particles simulation */}
                 <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
                    {[...Array(30)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute text-2xl animate-float"
                        style={{
                          top: `${Math.random()*100}%`,
                          left: `${Math.random()*100}%`,
                          animationDelay: `${Math.random()*2}s`,
                          animationDuration: `${3 + Math.random()*2}s`
                        }}
                      >
                         {isPassed ? "🏆" : "⚡"}
                      </div>
                    ))}
                 </div>

                 <div className="relative z-10 flex flex-col items-center animate-in zoom-in slide-in-from-top-4 duration-700">
                    <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center mb-4 shadow-2xl">
                       {isPassed ? <Award className="w-12 h-12" /> : <RotateCcw className="w-12 h-12" />}
                    </div>
                    <h2 className="text-4xl font-display font-black tracking-tight mb-2 uppercase">
                       {isPassed ? "Sensacional!" : "Não Desista!"}
                    </h2>
                    <p className="text-white/80 font-medium">
                       {isPassed ? "Você dominou este desafio." : "O aprendizado é feito de tentativas."}
                    </p>
                 </div>
              </div>

              <CardContent className="p-10 -mt-8 relative z-20">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                   <Card className="p-6 text-center shadow-xl border-none bg-background transform hover:-translate-y-1 transition-transform">
                      <p className="text-4xl font-display font-black text-foreground">{scorePercent}%</p>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mt-1 tracking-widest">Aproveitamento</p>
                   </Card>
                   <Card className="p-6 text-center shadow-xl border-none bg-background transform hover:-translate-y-1 transition-transform">
                      <p className="text-4xl font-display font-black text-foreground">{formatTime(results?.timeSpent || 0)}</p>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mt-1 tracking-widest">Tempo Total</p>
                   </Card>
                   <Card className="p-6 text-center shadow-xl border-none bg-primary text-primary-foreground transform hover:-translate-y-1 transition-transform">
                      <p className="text-4xl font-display font-black">+{results ? results.score * 10 : 0}</p>
                      <p className="text-[10px] uppercase font-bold opacity-70 mt-1 tracking-widest">XP Adquirido</p>
                   </Card>
                 </div>

                 <div className="space-y-4 mb-10">
                    <h3 className="text-lg font-black font-display uppercase tracking-tight flex items-center gap-2">
                       <FileText className="w-5 h-5 text-primary" />
                       Revisão de Desempenho
                    </h3>
                    <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                       {quizQuestions.map((q, i) => {
                         const userAns = currentAnswers[q.id]
                         const correct = validateAnswer(q, userAns)
                         return (
                           <div key={i} className={cn(
                             "p-4 rounded-2xl border-2 flex items-center justify-between gap-4 transition-colors",
                             correct ? "bg-success/5 border-success/20" : "bg-destructive/5 border-destructive/20"
                           )}>
                              <div className="flex items-center gap-4">
                                <div className={cn(
                                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                  correct ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"
                                )}>
                                   {correct ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                </div>
                                 <div className="space-y-0.5">
                                    <p className="text-sm font-bold text-foreground truncate max-w-[400px]">{getQuestionText(q)}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">
                                      {q.type.replace("-", " ")}
                                    </p>
                                 </div>
                              </div>
                              <Badge variant="outline" className={correct ? "text-success border-success/30" : "text-destructive border-destructive/30"}>
                                 {correct ? "Correto" : "Incorreto"}
                              </Badge>
                           </div>
                         )
                       })}
                    </div>
                 </div>

                 <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="outline" onClick={resetQuiz} className="flex-1 h-14 rounded-2xl font-black text-lg border-2 hover:bg-muted transition-all">
                       <RotateCcw className="w-5 h-5 mr-2" />
                       REFAZER DESAFIO
                    </Button>
                    <Button asChild className="flex-1 h-14 rounded-2xl font-black text-lg shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                       <a href="/student/dashboard">VOLTAR AO PAINEL</a>
                    </Button>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    )
  }

  // --- ACTIVE LAYOUT ---

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
       {/* Top Navigation */}
       <header className="h-20 bg-card border-b border-border px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" onClick={() => setState("intro")} className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
             </Button>
             <div className="h-8 w-px bg-border hidden md:block" />
             <div className="hidden md:block">
                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Progresso</p>
                <p className="text-sm font-bold text-foreground">{quiz.title}</p>
             </div>
          </div>

          <div className="flex items-center gap-8">
             <div className="hidden lg:flex flex-col items-center">
                <div className="flex items-center gap-1.5 mb-1">
                   {[...Array(totalQuestions)].map((_, i) => (
                     <div
                        key={i}
                        className={cn(
                          "w-2.5 h-2.5 rounded-full transition-all duration-300",
                          i < currentIndex ? "bg-success" :
                          i === currentIndex ? "bg-primary ring-4 ring-primary/20" : "bg-muted-foreground/30"
                        )}
                     />
                   ))}
                </div>
                <p className="text-[9px] uppercase font-black text-muted-foreground tracking-tighter">
                   Questão {currentIndex + 1} de {totalQuestions}
                </p>
             </div>

             <div className={cn(
               "flex items-center gap-3 px-6 py-2.5 rounded-2xl border-2 font-mono font-black shadow-inner",
               timer < 60 ? "bg-destructive/10 border-destructive animate-pulse text-destructive" : "bg-card border-border text-foreground"
             )}>
                <Clock className="w-5 h-5" />
                {formatTime(timer)}
             </div>
          </div>
       </header>

       <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative">
          <div className="max-w-4xl w-full">
            {/* Sidebar-like indicator for mobile */}
            <div className="lg:hidden mb-8">
               <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase text-muted-foreground tracking-widest">Acompanhamento</span>
                  <span className="text-xs font-bold">{currentIndex + 1} / {totalQuestions}</span>
               </div>
               <Progress value={((currentIndex + 1) / totalQuestions) * 100} className="h-2 bg-muted-foreground/10" />
            </div>

            {/* Focused Question Area */}
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
               <div className="text-center space-y-4 max-w-2xl mx-auto">
                  <Badge variant="outline" className="rounded-full border-primary/30 text-primary font-bold px-4 py-1 uppercase tracking-tighter text-[10px] bg-primary/5">
                    {(() => {
                      const t = currentQuestion?.type?.replace("-", " ").replace("_", " ") || "Questão"
                      if (t.includes("multiple")) return "Múltipla Escolha"
                      if (t.includes("true")) return "Verdadeiro ou Falso"
                      if (t.includes("fill")) return "Preencha a Lacuna"
                      if (t.includes("matching")) return "Associação"
                      if (t.includes("ordering")) return "Ordenação"
                      if (t.includes("listening")) return "Listening"
                      if (t.includes("essay")) return "Dissertativa"
                      return t
                    })()}
                  </Badge>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-display font-black text-foreground leading-tight tracking-tight">
                    {getQuestionText(currentQuestion)}
                  </h3>
               </div>

               <div className="bg-card/50 backdrop-blur-sm rounded-[3rem] p-8 md:p-12 border-2 border-border shadow-2xl">
                  {renderCurrentQuestion()}
               </div>

               {/* Footer Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 border-t border-border/50">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      disabled={currentIndex === 0}
                      onClick={prevQuestion}
                      className="h-14 px-8 rounded-2xl border-2 font-bold hover:bg-card transition-all flex-1 sm:flex-none"
                    >
                      <ChevronLeft className="w-5 h-5 mr-2" />
                      ANTERIOR
                    </Button>

                    {!isCurrentChecked && currentAnswers[currentQuestion.id] && (
                      <Button
                        size="lg"
                        onClick={checkCurrentAnswer}
                        className="h-14 px-8 rounded-2xl font-black bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex-1 sm:flex-none animate-in fade-in zoom-in"
                      >
                        <Zap className="w-5 h-5 mr-2 fill-current" />
                        VERIFICAR
                      </Button>
                    )}
                  </div>

                  {currentIndex + 1 === totalQuestions ? (
                    <Button
                      size="lg"
                      onClick={submitQuiz}
                      className="h-14 px-12 rounded-2xl font-black text-lg bg-success hover:bg-success/90 text-white shadow-xl shadow-success/20 transition-all flex-1 sm:flex-none"
                    >
                      FINALIZAR E ENVIAR
                      <CheckCircle2 className="w-5 h-5 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      onClick={nextQuestion}
                      className={cn(
                        "h-14 px-12 rounded-2xl font-black text-lg shadow-xl transition-all flex-1 sm:flex-none hover:scale-[1.02]",
                        isCurrentChecked
                          ? "bg-primary text-primary-foreground shadow-primary/30"
                          : "bg-muted/80 text-muted-foreground border-2 border-border/50"
                      )}
                    >
                      PRÓXIMA
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  )}
               </div>
            </div>
          </div>
       </div>

       {/* Floating help / tips */}
       <div className="absolute bottom-12 right-12 hidden lg:block">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center cursor-help hover:bg-primary hover:text-white transition-all peer">
             <Trophy className="w-6 h-6" />
          </div>
          <div className="absolute bottom-full right-0 mb-4 w-60 p-4 bg-card rounded-2xl border-2 shadow-2xl opacity-0 translate-y-2 pointer-events-none transition-all peer-hover:opacity-100 peer-hover:translate-y-0">
             <p className="text-xs font-bold mb-1">Dica do Professor</p>
             <p className="text-xs text-muted-foreground leading-relaxed">
                Leia o enunciado com calma. Este desafio foca em {currentQuestion.type === "listening" ? "compreensão auditiva" : "aplicação prática"}.
             </p>
          </div>
       </div>

       <style jsx global>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0); }
            50% { transform: translateY(-20px) rotate(12deg); }
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
       `}</style>
    </div>
  )
}

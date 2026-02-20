"use client"

import SplashScreen from "@/components/splash-screen"
import { VideoMetadata } from "@/components/teacher/video-editor"
import { VideoUpload } from "@/components/teacher/video-upload"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { completeLesson, syncLessonProgress } from "@/lib/actions/student"
import { cn } from "@/lib/utils"
import {
    BookOpen,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    ChevronUp,
    Clock,
    ExternalLink,
    FileText,
    Maximize,
    Minimize,
    Monitor,
    Pause,
    Play,
    Plus,
    Settings,
    SkipForward,
    Star,
    Timer,
    Trash2,
    Trophy,
    Video,
    Volume2,
    VolumeX,
    Zap
} from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { toast } from "sonner"

// ─── Types ───────────────────────────────────────────────────────────────────

interface NextLesson {
  id: string
  title: string
  duration: number | null
  lessonType: string
}

interface VideoLessonProps {
  currentLesson: {
    id: string
    title: string
    module: string
    level: string
    duration: string
    notes: string
    vocabulary: any[]
    videoUrl?: string
    metadata?: VideoMetadata
    lessonType: "VIDEO" | "NOTES" | "CHALLENGE" | "LIVE"
    scheduledAt?: string | null
    meetingUrl?: string | null
    meetingPlatform?: string | null
    challengeConfig?: { timeLimit?: number; passingScore?: number; xpReward?: number } | null
    quizzes?: any[]
  }
  isEditable?: boolean
  initialPosition?: number
  isCompleted?: boolean
  nextLesson?: NextLesson | null
  onLessonUpdate?: (data: {
    content?: string
    vocabulary?: any
    videoUrl?: string
    duration?: number
    metadata?: VideoMetadata
  }) => Promise<void>
}

// ─── Lesson Type Icon helper ──────────────────────────────────────────────────

function lessonTypeIcon(type: string) {
  switch (type) {
    case "NOTES": return <FileText className="w-3.5 h-3.5" />
    case "CHALLENGE": return <Zap className="w-3.5 h-3.5" />
    case "LIVE": return <Video className="w-3.5 h-3.5" />
    default: return <Play className="w-3.5 h-3.5" />
  }
}

function lessonTypeLabel(type: string) {
  switch (type) {
    case "NOTES": return "Notas"
    case "CHALLENGE": return "Desafio"
    case "LIVE": return "Ao Vivo"
    default: return "Vídeo"
  }
}

// ─── NOTES Lesson ────────────────────────────────────────────────────────────

function NotesLesson({
  currentLesson,
  completed,
  onComplete,
  nextLesson,
  markdownComponents,
}: {
  currentLesson: VideoLessonProps["currentLesson"]
  completed: boolean
  onComplete: () => Promise<void>
  nextLesson?: NextLesson | null
  markdownComponents: any
}) {
  return (
    <div className="max-w-screen-lg mx-auto p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="gap-1 text-xs">
              <FileText className="w-3 h-3" /> Notas de Aula
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground leading-tight">
            {currentLesson.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {currentLesson.module} · Nível {currentLesson.level}
          </p>
        </div>
        {nextLesson && (
          <Button size="sm" className="gap-1.5 w-fit shrink-0" asChild>
            <Link href={`/student/lesson/${nextLesson.id}`}>
              <SkipForward className="w-3.5 h-3.5" /> Próxima Aula
            </Link>
          </Button>
        )}
      </div>

      {/* Notes Content */}
      <Card className="border-border">
        <CardHeader className="pb-2 border-b border-border">
          <CardTitle className="text-base font-semibold font-display flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" /> Conteúdo da Aula
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {currentLesson.notes ? (
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
                {currentLesson.notes}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Nenhum conteúdo disponível ainda.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Complete Button */}
      <Card className={cn("border-primary/20 bg-primary/[0.03] transition-all", completed && "bg-success/5 border-success/20")}>
        <CardContent className="p-5 text-center">
          <div className={cn("flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-3", completed ? "bg-success/10 text-success" : "bg-primary/10 text-primary")}>
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-foreground mb-1">
            {completed ? "Aula Concluída!" : "Marcar como Concluída"}
          </p>
          <p className="text-xs text-muted-foreground mb-3">Ganhe 25 XP ao concluir</p>
          <Button size="sm" className="w-full max-w-xs" onClick={onComplete} disabled={completed} variant={completed ? "secondary" : "default"}>
            {completed ? <><CheckCircle2 className="w-4 h-4 mr-2" /> Concluída</> : "Marcou como Concluída"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── LIVE Lesson ─────────────────────────────────────────────────────────────

function LiveLesson({
  currentLesson,
  completed,
  onComplete,
  nextLesson,
}: {
  currentLesson: VideoLessonProps["currentLesson"]
  completed: boolean
  onComplete: () => Promise<void>
  nextLesson?: NextLesson | null
}) {
  const scheduledAt = currentLesson.scheduledAt ? new Date(currentLesson.scheduledAt) : null
  const now = new Date()
  const isLive = scheduledAt && Math.abs(now.getTime() - scheduledAt.getTime()) < 30 * 60 * 1000
  const isPast = scheduledAt && now > scheduledAt
  const isFuture = scheduledAt && now < scheduledAt

  const platformLabel: Record<string, string> = { zoom: "Zoom", meet: "Google Meet", teams: "Microsoft Teams" }
  const platformColor: Record<string, string> = { zoom: "bg-blue-500/10 text-blue-400", meet: "bg-green-500/10 text-green-400", teams: "bg-purple-500/10 text-purple-400" }

  return (
    <div className="max-w-screen-lg mx-auto p-4 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className={cn("gap-1 text-xs", isLive && "bg-red-500/10 text-red-400 border-red-500/30 animate-pulse")}>
              <Video className="w-3 h-3" /> {isLive ? "● AO VIVO AGORA" : "Aula Síncrona"}
            </Badge>
            {currentLesson.meetingPlatform && (
              <Badge variant="outline" className={cn("text-xs gap-1", platformColor[currentLesson.meetingPlatform] || "")}>
                {platformLabel[currentLesson.meetingPlatform] || currentLesson.meetingPlatform}
              </Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground leading-tight">{currentLesson.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{currentLesson.module} · Nível {currentLesson.level}</p>
        </div>
        {nextLesson && (
          <Button size="sm" className="gap-1.5 w-fit shrink-0" asChild>
            <Link href={`/student/lesson/${nextLesson.id}`}><SkipForward className="w-3.5 h-3.5" /> Próxima Aula</Link>
          </Button>
        )}
      </div>

      {/* Main Card */}
      <Card className={cn("overflow-hidden border-2 transition-all", isLive ? "border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.1)]" : "border-border")}>
        <CardContent className="p-0">
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-8 sm:p-12 text-center space-y-6">
            <div className={cn("flex items-center justify-center w-20 h-20 rounded-2xl mx-auto", isLive ? "bg-red-500/20 text-red-400" : "bg-primary/10 text-primary")}>
              <Video className="w-10 h-10" />
            </div>

            {scheduledAt ? (
              <div className="space-y-1">
                {isFuture && (
                  <>
                    <p className="text-sm text-muted-foreground">Agendada para</p>
                    <p className="text-xl font-bold text-foreground">
                      {scheduledAt.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                    <p className="text-primary font-mono text-lg font-bold">
                      {scheduledAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} (seu horário local)
                    </p>
                  </>
                )}
                {isLive && (
                  <p className="text-red-400 font-bold text-lg animate-pulse">Aula a decorrer agora!</p>
                )}
                {isPast && !isLive && (
                  <p className="text-muted-foreground">Esta sessão já terminou.</p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Horário a confirmar pelo professor.</p>
            )}

            {currentLesson.meetingUrl ? (
              <Button
                size="lg"
                className={cn("gap-2 text-base font-semibold", isLive && "bg-red-500 hover:bg-red-600")}
                disabled={!isLive && isFuture!}
                asChild
              >
                <a href={currentLesson.meetingUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-5 h-5" />
                  {isLive ? "Entrar na Aula Agora" : isFuture ? "Em Breve..." : "Ver Gravação"}
                </a>
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground italic">Link da reunião ainda não disponível.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notes if any */}
      {currentLesson.notes && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Materiais de Apoio</CardTitle></CardHeader>
          <CardContent className="pt-4">
            <div className="prose prose-invert max-w-none text-sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{currentLesson.notes}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion */}
      {isPast && (
        <Card className={cn("border-primary/20 bg-primary/[0.03]", completed && "border-success/20 bg-success/5")}>
          <CardContent className="p-5 text-center">
            <p className="text-sm font-semibold mb-3">{completed ? "Aula Marcada como Concluída" : "Participou desta aula?"}</p>
            <Button size="sm" className="w-full max-w-xs" onClick={onComplete} disabled={completed} variant={completed ? "secondary" : "default"}>
              {completed ? <><CheckCircle2 className="w-4 h-4 mr-2" /> Concluída</> : "Sim, Participei (+25 XP)"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ─── CHALLENGE Lesson ─────────────────────────────────────────────────────────

function ChallengeLesson({
  currentLesson,
  completed,
  onComplete,
  nextLesson,
}: {
  currentLesson: VideoLessonProps["currentLesson"]
  completed: boolean
  onComplete: () => Promise<void>
  nextLesson?: NextLesson | null
}) {
  const quiz = currentLesson.quizzes?.[0]
  const config = currentLesson.challengeConfig
  const totalTime = config?.timeLimit || 300
  const [started, setStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(totalTime)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const questions: any[] = quiz?.questions ? (typeof quiz.questions === "string" ? JSON.parse(quiz.questions) : quiz.questions) : []
  const passingScore = config?.passingScore || 70
  const xpReward = config?.xpReward || quiz?.points || 100
  const passed = score >= passingScore

  useEffect(() => {
    if (!started || submitted) return
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(interval); handleSubmit(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [started, submitted])

  const handleSubmit = () => {
    if (!quiz) return
    let correct = 0
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++
    })
    const pct = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0
    setScore(pct)
    setSubmitted(true)
  }

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
  const timerColor = timeLeft < 30 ? "text-red-400" : timeLeft < 60 ? "text-yellow-400" : "text-primary"

  if (!quiz || questions.length === 0) {
    return (
      <div className="max-w-screen-lg mx-auto p-4 sm:p-8 space-y-6">
        <div>
          <Badge variant="secondary" className="gap-1 text-xs mb-2"><Zap className="w-3 h-3" /> Desafio</Badge>
          <h1 className="text-2xl font-bold font-display">{currentLesson.title}</h1>
        </div>
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <Zap className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">Nenhum desafio disponível ainda. O professor irá adicionar em breve.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!started && !submitted) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-8 space-y-6">
        <div>
          <Badge variant="secondary" className="gap-1 text-xs mb-2 bg-amber-500/10 text-amber-400 border-amber-500/30"><Zap className="w-3 h-3" /> Desafio</Badge>
          <h1 className="text-2xl sm:text-3xl font-bold font-display">{currentLesson.title}</h1>
          <p className="text-muted-foreground text-sm mt-1">{currentLesson.module} · Nível {currentLesson.level}</p>
        </div>
        <Card className="overflow-hidden border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
          <CardContent className="p-8 text-center space-y-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-amber-500/10 text-amber-400 mx-auto">
              <Trophy className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">{quiz.title}</h2>
              {quiz.description && <p className="text-sm text-muted-foreground">{quiz.description}</p>}
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-background/50 rounded-xl">
                <p className="text-lg font-bold text-foreground">{questions.length}</p>
                <p className="text-xs text-muted-foreground">Questões</p>
              </div>
              <div className="p-3 bg-background/50 rounded-xl">
                <p className="text-lg font-bold text-foreground font-mono">{formatTime(totalTime)}</p>
                <p className="text-xs text-muted-foreground">Tempo</p>
              </div>
              <div className="p-3 bg-background/50 rounded-xl">
                <p className="text-lg font-bold text-amber-400">+{xpReward} XP</p>
                <p className="text-xs text-muted-foreground">Recompensa</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Pontuação mínima para passar: <span className="text-foreground font-bold">{passingScore}%</span></p>
            <Button size="lg" className="gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold" onClick={() => setStarted(true)}>
              <Zap className="w-5 h-5" /> Iniciar Desafio
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-8 space-y-6">
        <Card className={cn("overflow-hidden border-2", passed ? "border-success/30 bg-gradient-to-br from-success/5 to-success/10" : "border-destructive/30 bg-gradient-to-br from-destructive/5 to-destructive/10")}>
          <CardContent className="p-8 text-center space-y-4">
            <div className={cn("flex items-center justify-center w-20 h-20 rounded-2xl mx-auto", passed ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive")}>
              {passed ? <Trophy className="w-10 h-10" /> : <Zap className="w-10 h-10" />}
            </div>
            <h2 className="text-2xl font-bold">{passed ? "Desafio Concluído! 🎉" : "Quase lá!"}</h2>
            <div className="space-y-2">
              <p className="text-4xl font-black font-mono">{score}%</p>
              <Progress value={score} className="h-3 max-w-xs mx-auto" />
              <p className="text-sm text-muted-foreground">{Math.round(score / 100 * questions.length)} de {questions.length} corretas</p>
            </div>
            {passed && (
              <div className="flex items-center justify-center gap-2 p-3 bg-amber-500/10 rounded-xl">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-bold text-amber-400">+{xpReward} XP desbloqueados!</span>
              </div>
            )}
            <div className="flex gap-3 justify-center pt-2">
              {!passed && (
                <Button variant="outline" onClick={() => { setStarted(false); setSubmitted(false); setAnswers({}); setTimeLeft(totalTime); setCurrentQ(0) }}>
                  Tentar Novamente
                </Button>
              )}
              {passed && !completed && (
                <Button onClick={onComplete} className="gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Concluir Aula
                </Button>
              )}
              {nextLesson && (
                <Button asChild variant={passed ? "default" : "outline"}>
                  <Link href={`/student/lesson/${nextLesson.id}`}><SkipForward className="w-4 h-4 mr-1.5" /> Próxima Aula</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const q = questions[currentQ]
  const options: string[] = q.options || []

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8 space-y-4">
      {/* Timer & Progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Questão {currentQ + 1}/{questions.length}</span>
        </div>
        <div className={cn("flex items-center gap-1.5 font-mono font-bold text-lg tabular-nums", timerColor)}>
          <Timer className="w-4 h-4" /> {formatTime(timeLeft)}
        </div>
      </div>
      <Progress value={((currentQ + 1) / questions.length) * 100} className="h-1.5" />

      <Card className="border-amber-500/20">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <p className="text-base sm:text-lg font-semibold text-foreground leading-relaxed">{q.question}</p>
          <div className="space-y-3">
            {options.map((opt: string) => (
              <button
                key={opt}
                onClick={() => setAnswers(a => ({ ...a, [currentQ]: opt }))}
                className={cn(
                  "w-full text-left p-4 rounded-xl border-2 transition-all text-sm font-medium",
                  answers[currentQ] === opt
                    ? "border-amber-500 bg-amber-500/10 text-foreground"
                    : "border-border hover:border-amber-500/50 hover:bg-muted/50 text-foreground/80"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="flex justify-between pt-2">
            <Button variant="ghost" size="sm" onClick={() => setCurrentQ(q => Math.max(0, q - 1))} disabled={currentQ === 0}>
              Anterior
            </Button>
            {currentQ < questions.length - 1 ? (
              <Button size="sm" onClick={() => setCurrentQ(q => q + 1)} disabled={!answers[currentQ]}>
                Próxima
              </Button>
            ) : (
              <Button size="sm" onClick={handleSubmit} disabled={!answers[currentQ]} className="bg-amber-500 hover:bg-amber-600 text-white">
                Submeter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Lesson Quiz Card (sidebar, for VIDEO/NOTES lessons) ─────────────────────

function LessonQuizCard({ quiz, lessonId }: { quiz: any; lessonId: string }) {
  const questions: any[] = quiz.questions || []
  const [open, setOpen] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  if (!questions.length) return null

  const xp = quiz.points || 50

  const handleSubmit = () => {
    let correct = 0
    questions.forEach((q: any, i: number) => {
      if (answers[i] === q.answer || answers[i] === q.correctAnswer) correct++
    })
    const pct = Math.round((correct / questions.length) * 100)
    setScore(pct)
    setSubmitted(true)
  }

  const handleReset = () => {
    setCurrentQ(0)
    setAnswers({})
    setSubmitted(false)
    setScore(0)
  }

  const q = questions[currentQ]
  const options: string[] = q?.options || (q?.type === "true_false" ? ["Verdadeiro", "Falso"] : [])

  return (
    <Card className={cn(
      "border-2 transition-all overflow-hidden",
      submitted && score >= 70 ? "border-success/30" : submitted ? "border-destructive/20" : "border-amber-500/20"
    )}>
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
            submitted && score >= 70 ? "bg-success/10 text-success" : "bg-amber-500/10 text-amber-500"
          )}>
            {submitted && score >= 70 ? <Trophy className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{quiz.title || "Exercícios da Aula"}</p>
            <p className="text-xs text-muted-foreground">
              {submitted ? `${score}% · ` : ""}{questions.length} questões · +{xp} XP
            </p>
          </div>
        </div>
        {submitted && score >= 70 ? (
          <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-[10px]">Concluído</Badge>
        ) : (
          <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", open && "rotate-180")} />
        )}
      </button>

      {/* Expanded content */}
      {open && !submitted && (
        <div className="border-t px-4 pb-4 pt-4 space-y-4">
          {/* Progress */}
          <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
            <span>Questão {currentQ + 1}/{questions.length}</span>
            <Progress value={((currentQ) / questions.length) * 100} className="w-24 h-1.5" />
          </div>

          <p className="text-sm font-medium leading-snug">{q?.question}</p>

          <div className="space-y-2">
            {options.map((opt: string) => (
              <button
                key={opt}
                onClick={() => setAnswers(a => ({ ...a, [currentQ]: opt }))}
                className={cn(
                  "w-full text-left p-3 rounded-xl border-2 text-xs font-medium transition-all",
                  answers[currentQ] === opt
                    ? "border-amber-500 bg-amber-500/10 text-foreground"
                    : "border-border hover:border-amber-500/40 hover:bg-muted/40 text-foreground/80"
                )}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-1">
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setCurrentQ(q => Math.max(0, q - 1))} disabled={currentQ === 0}>
              ← Anterior
            </Button>
            {currentQ < questions.length - 1 ? (
              <Button size="sm" className="h-8 text-xs" onClick={() => setCurrentQ(q => q + 1)} disabled={!answers[currentQ]}>
                Próxima →
              </Button>
            ) : (
              <Button size="sm" className="h-8 text-xs bg-amber-500 hover:bg-amber-600 text-white" onClick={handleSubmit} disabled={!answers[currentQ]}>
                <Check className="w-3.5 h-3.5 mr-1" /> Submeter
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Result */}
      {open && submitted && (
        <div className="border-t px-4 pb-4 pt-4 text-center space-y-3">
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mx-auto", score >= 70 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
            {score >= 70 ? <Trophy className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
          </div>
          <p className="text-2xl font-black font-mono">{score}%</p>
          <Progress value={score} className="h-2 max-w-[120px] mx-auto" />
          {score >= 70 ? (
            <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/30">+{xp} XP desbloqueado!</Badge>
          ) : (
            <p className="text-xs text-muted-foreground">Precisa de 70% para passar</p>
          )}
          <Button size="sm" variant="outline" className="w-full text-xs h-8" onClick={handleReset}>
            Tentar novamente
          </Button>
        </div>
      )}
    </Card>
  )
}

// ─── Main VideoLesson Component ───────────────────────────────────────────────

export function VideoLesson({ currentLesson, isEditable = false, initialPosition = 0, isCompleted = false, nextLesson, onLessonUpdate }: VideoLessonProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const lastSyncTimeRef = useRef<number>(Date.now())
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [completed, setCompleted] = useState(isCompleted)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [isTheaterMode, setIsTheaterMode] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [notesExpanded, setNotesExpanded] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const [editableContent, setEditableContent] = useState(currentLesson.notes || "")
  const [editableVocab, setEditableVocab] = useState(currentLesson.vocabulary || [])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setEditableContent(currentLesson.notes || "")
    setEditableVocab(currentLesson.vocabulary || [])
  }, [currentLesson.notes, currentLesson.vocabulary])

  const markdownComponents = {
    h1: ({ ...props }) => <h1 className="text-2xl font-bold text-foreground mt-8 mb-4 border-l-4 border-primary pl-4 font-display" {...props} />,
    h2: ({ ...props }) => <h2 className="text-xl font-bold text-foreground mt-6 mb-3 border-l-2 border-primary/50 pl-3 font-display" {...props} />,
    h3: ({ ...props }) => <h3 className="text-lg font-semibold text-primary mt-6 mb-2" {...props} />,
    p: ({ ...props }) => <p className="text-foreground/70 leading-relaxed mb-4 text-[15px]" {...props} />,
    ul: ({ ...props }) => <ul className="list-none space-y-2 mb-6" {...props} />,
    li: ({ ...props }) => (
      <li className="flex items-start gap-3 text-foreground/70 text-[14px]">
        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
        <span {...props} />
      </li>
    ),
    strong: ({ ...props }) => <strong className="text-foreground font-bold border-b border-primary/30" {...props} />,
    blockquote: ({ ...props }) => <blockquote className="border-l-4 border-muted bg-muted/20 px-6 py-4 rounded-r-xl italic my-6 text-foreground/60" {...props} />,
    code: ({ ...props }) => <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono text-xs" {...props} />,
    table: ({ ...props }) => <div className="my-8 overflow-x-auto rounded-xl border border-white/5 bg-black/20"><table className="w-full border-collapse text-left" {...props} /></div>,
    thead: ({ ...props }) => <thead className="bg-primary/5 uppercase tracking-wider font-mono text-[10px] text-primary" {...props} />,
    th: ({ ...props }) => <th className="px-6 py-4 font-bold border-b border-white/10" {...props} />,
    td: ({ ...props }) => <td className="px-6 py-4 text-foreground/70 border-b border-white/5 text-[13px]" {...props} />,
    tr: ({ ...props }) => <tr className="hover:bg-white/5 transition-colors" {...props} />,
  }

  const handleComplete = async () => {
    try {
      await completeLesson(currentLesson.id)
      setCompleted(true)
      toast.success("Aula concluída! +25 XP 🎉")
    } catch {
      toast.error("Erro ao marcar como concluída.")
    }
  }

  // ── Sync heartbeat (VIDEO only — no-ops for other types)
  // IMPORTANT: all useEffect must be declared BEFORE any early returns (Rules of Hooks)
  useEffect(() => {
    if (isEditable || !isPlaying || currentLesson.lessonType !== "VIDEO") return
    const interval = setInterval(async () => {
      if (!videoRef.current) return
      const currentPos = Math.floor(videoRef.current.currentTime)
      const now = Date.now()
      const watchTimeSeconds = Math.round((now - lastSyncTimeRef.current) / 1000)
      if (watchTimeSeconds >= 5) {
        try {
          await syncLessonProgress(currentLesson.id, currentPos, watchTimeSeconds)
          lastSyncTimeRef.current = now
        } catch {}
      }
    }, 10000)
    return () => clearInterval(interval)
  }, [isPlaying, isEditable, currentLesson.id, currentLesson.lessonType])

  // ── Fullscreen
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener("fullscreenchange", handler)
    return () => document.removeEventListener("fullscreenchange", handler)
  }, [])

  // ── Init position (VIDEO only)
  useEffect(() => {
    if (videoRef.current && !isInitialized && currentLesson.videoUrl && currentLesson.lessonType === "VIDEO") {
      const trimStart = currentLesson.metadata?.trimStart || 0
      videoRef.current.currentTime = initialPosition > trimStart ? initialPosition : trimStart
      setIsInitialized(true)
    }
  }, [initialPosition, currentLesson.metadata?.trimStart, currentLesson.videoUrl, isInitialized])

  // ── Early returns for non-VIDEO types (MUST be after ALL hooks)
  if (isLoading) return <SplashScreen onComplete={() => setIsLoading(false)} minDuration={currentLesson.lessonType === "VIDEO" ? 1500 : 800} />

  if (!isEditable) {
    if (currentLesson.lessonType === "NOTES") {
      return <NotesLesson currentLesson={currentLesson} completed={completed} onComplete={handleComplete} nextLesson={nextLesson} markdownComponents={markdownComponents} />
    }
    if (currentLesson.lessonType === "LIVE") {
      return <LiveLesson currentLesson={currentLesson} completed={completed} onComplete={handleComplete} nextLesson={nextLesson} />
    }
    if (currentLesson.lessonType === "CHALLENGE") {
      return <ChallengeLesson currentLesson={currentLesson} completed={completed} onComplete={handleComplete} nextLesson={nextLesson} />
    }
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeout) clearTimeout(controlsTimeout)
    const t = setTimeout(() => { if (isPlaying) setShowControls(false) }, 3000)
    setControlsTimeout(t)
  }

  const togglePlay = async () => {
    if (!videoRef.current) return
    try {
      if (videoRef.current.paused) { await videoRef.current.play() } else { videoRef.current.pause() }
    } catch {}
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) { containerRef.current.requestFullscreen() } else { document.exitFullscreen() }
  }

  const toggleMute = () => { if (videoRef.current) { videoRef.current.muted = !isMuted; setIsMuted(!isMuted) } }
  const handleVolumeChange = (value: number[]) => { const v = value[0] / 100; setVolume(v); if (videoRef.current) videoRef.current.volume = v; if (v > 0) setIsMuted(false) }
  const handleSpeedChange = (speed: number) => { setPlaybackRate(speed); if (videoRef.current) videoRef.current.playbackRate = speed }
  const handleSeek = (value: number[]) => { if (videoRef.current) { const d = currentLesson.metadata?.trimEnd || duration || 1; videoRef.current.currentTime = (value[0] / 100) * d; setCurrentTime(videoRef.current.currentTime) } }
  const toggleTheaterMode = () => setIsTheaterMode(!isTheaterMode)
  const formatT = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`

  const addVocabItem = () => setEditableVocab([...editableVocab, { word: "", definition: "", example: "" }])
  const removeVocabItem = (i: number) => setEditableVocab(editableVocab.filter((_: any, idx: number) => idx !== i))
  const handleUpdateVocab = (i: number, field: string, value: string) => { const nv = [...editableVocab]; nv[i] = { ...nv[i], [field]: value }; setEditableVocab(nv) }

  const handleSave = async (data: any) => {
    if (!onLessonUpdate) return
    setIsSaving(true)
    try { await onLessonUpdate(data) } finally { setIsSaving(false) }
  }

  // VIDEO or EDITABLE view
  return (
    <div className="max-w-screen-2xl mx-auto p-4 sm:p-4 lg:p-8">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-muted-foreground mb-4 px-4 sm:px-0">
        {isEditable ? (
          <span className="text-muted-foreground">Edição de Aula</span>
        ) : (
          <Link href="/student/courses" className="hover:text-foreground transition-colors">Cursos</Link>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span>{currentLesson.level}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span>{currentLesson.module}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-medium">{currentLesson.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full">
        {/* Main */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Player or type placeholder */}
          <Card className="overflow-hidden">
            {isEditable ? (
              <div className="p-1">
                <VideoUpload initialUrl={currentLesson.videoUrl} onUploadComplete={(url, dur, meta) => handleSave({ videoUrl: url, duration: dur, metadata: meta })} />
              </div>
            ) : currentLesson.videoUrl ? (
              <div
                ref={containerRef}
                className={cn("relative bg-neutral-950 aspect-video flex items-center justify-center transition-all duration-500 overflow-hidden group", isTheaterMode && !isFullscreen ? "fixed inset-0 z-[100] bg-black/95" : "")}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => isPlaying && setShowControls(false)}
              >
                <video
                  key={currentLesson.id + (currentLesson.videoUrl || "")}
                  ref={videoRef}
                  src={currentLesson.videoUrl}
                  className="w-full h-full object-contain"
                  preload="metadata"
                  style={{ filter: currentLesson.metadata ? `brightness(${currentLesson.metadata.brightness}%) contrast(${currentLesson.metadata.contrast}%) saturate(${currentLesson.metadata.saturation}%)` : undefined }}
                  onPause={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
                  onDurationChange={e => setDuration(e.currentTarget.duration)}
                  onTimeUpdate={e => setCurrentTime(e.currentTarget.currentTime)}
                  onClick={togglePlay}
                  onContextMenu={e => e.preventDefault()}
                  controlsList="nodownload"
                />
                {/* HUD Top Left */}
                <div className={cn("absolute top-4 left-4 flex flex-col gap-1 transition-all duration-500", showControls ? "opacity-100" : "opacity-0")}>
                  <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="font-mono text-[10px] text-primary uppercase tracking-[0.2em]">Live Session</span>
                  </div>
                  <h3 className="text-white font-display font-bold text-lg drop-shadow-lg truncate max-w-xs">{currentLesson.title}</h3>
                </div>
                {/* Center Play */}
                {!isPlaying && (
                  <button type="button" onClick={e => { e.stopPropagation(); togglePlay() }} className="absolute inset-0 z-40 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors">
                    <div className="w-20 h-20 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-[0_0_50px_rgba(19,146,80,0.5)]">
                      <Play className="w-10 h-10 ml-1.5 fill-current" />
                    </div>
                  </button>
                )}
                {/* Controls */}
                <div className={cn("absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-20 pb-6 px-6 transition-all duration-500 flex flex-col gap-4", showControls ? "opacity-100" : "opacity-0 pointer-events-none")}>
                  <div className="relative h-1 flex items-center">
                    <Slider value={[((currentTime || 0) / (currentLesson.metadata?.trimEnd || duration || 1)) * 100]} max={100} step={0.1} onValueChange={handleSeek} className="cursor-pointer" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button onClick={togglePlay} className="text-white hover:text-primary transition-colors">
                        {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                      </button>
                      <div className="flex items-center gap-2 group/volume">
                        <button onClick={toggleMute} className="text-white hover:text-primary transition-colors">
                          {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                        <div className="w-0 group-hover/volume:w-20 overflow-hidden transition-all duration-300">
                          <Slider value={[isMuted ? 0 : volume * 100]} max={100} onValueChange={handleVolumeChange} className="w-20 cursor-pointer" />
                        </div>
                      </div>
                      <span className="text-white/80 font-mono text-xs"><span className="text-primary font-bold">{formatT(currentTime)}</span> / {formatT(duration)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <button className="text-white/80 hover:text-white flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase py-1 px-2.5 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10">
                            <Settings className="w-3.5 h-3.5" /> {playbackRate}x
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-black/90 backdrop-blur-xl border-white/10 text-white min-w-[80px]">
                          {[0.75, 1, 1.25, 1.5, 2].map(s => (
                            <DropdownMenuItem key={s} onClick={() => handleSpeedChange(s)} className={cn("flex justify-center text-xs font-mono py-2 focus:bg-primary focus:text-primary-foreground", playbackRate === s && "text-primary font-bold")}>{s}x</DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <button onClick={toggleTheaterMode} className={cn("hidden md:flex text-white/80 hover:text-white p-1.5 rounded-lg transition-colors", isTheaterMode && "text-primary bg-primary/10")}>
                        {isTheaterMode ? <Minimize className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                      </button>
                      <button onClick={toggleFullscreen} className="text-white/80 hover:text-white p-1">
                        {isFullscreen ? <Minimize className="w-5 h-5 text-primary" /> : <Maximize className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* No video uploaded yet — show clean placeholder */
              <div className="aspect-video bg-gradient-to-br from-muted/40 to-muted/20 flex flex-col items-center justify-center gap-4 text-muted-foreground border-b">
                <div className="p-4 rounded-2xl bg-muted/30">
                  <Video className="w-12 h-12 opacity-30" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Vídeo em preparação</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">O professor irá carregar o vídeo em breve</p>
                </div>
              </div>
            )}
          </Card>

          {/* Lesson title row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 sm:px-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-display text-foreground">{currentLesson.title}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 flex flex-wrap items-center gap-x-2">
                <span>{currentLesson.module}</span><span className="opacity-30">·</span>
                <span>Nível {currentLesson.level}</span><span className="opacity-30">·</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{currentLesson.duration}</span>
              </p>
            </div>
            {!isEditable && nextLesson && (
              <Button size="sm" className="gap-1.5 w-fit h-9 px-4 font-medium" asChild>
                <Link href={`/student/lesson/${nextLesson.id}`}>
                  <SkipForward className="w-3.5 h-3.5" /> Próxima Aula
                </Link>
              </Button>
            )}
          </div>

          {/* Notes */}
          <Card>
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between w-full">
                <CardTitle className="text-base font-semibold font-display flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Notas da Aula</CardTitle>
                {isEditable ? (
                  <Button size="sm" variant="ghost" onClick={() => handleSave({ content: editableContent })} disabled={isSaving}>
                    {isSaving ? "Salvando..." : "Salvar Notas"}
                  </Button>
                ) : (
                  <button onClick={() => setNotesExpanded(!notesExpanded)}>
                    {notesExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {isEditable ? (
                <Textarea value={editableContent} onChange={e => setEditableContent(e.target.value)} placeholder="Conteúdo da aula em Markdown..." rows={10} className="font-mono text-sm" />
              ) : notesExpanded && (
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown components={markdownComponents as any} remarkPlugins={[remarkGfm]}>{editableContent}</ReactMarkdown>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 w-full lg:w-80 shrink-0">
          {/* Vocabulary */}
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-semibold font-display flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary" />Vocabulário</CardTitle>
              {isEditable && (
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={addVocabItem}><Plus className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-[10px]" onClick={() => handleSave({ vocabulary: editableVocab })} disabled={isSaving}>{isSaving ? "..." : "Salvar"}</Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {isEditable ? (
                <div className="space-y-4">
                  {editableVocab.map((v: any, i: number) => (
                    <div key={i} className="p-3 border rounded-lg space-y-2 relative group">
                      <Button size="icon" variant="ghost" className="absolute top-1 right-1 h-6 w-6 text-destructive opacity-0 group-hover:opacity-100" onClick={() => removeVocabItem(i)}><Trash2 className="w-3 h-3" /></Button>
                      <Input placeholder="Palavra" value={v.word} onChange={e => handleUpdateVocab(i, "word", e.target.value)} className="h-7 text-xs" />
                      <Textarea placeholder="Definição" value={v.definition} onChange={e => handleUpdateVocab(i, "definition", e.target.value)} className="h-12 text-[10px] resize-none" />
                      <Input placeholder="Exemplo" value={v.example} onChange={e => handleUpdateVocab(i, "example", e.target.value)} className="h-7 text-[10px] italic" />
                    </div>
                  ))}
                  {editableVocab.length === 0 && <p className="text-center text-xs text-muted-foreground py-4 italic">Nenhum termo</p>}
                </div>
              ) : (
                editableVocab.length > 0 ? (
                  <Tabs defaultValue={editableVocab[0]?.word}>
                    <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-muted p-1">
                      {editableVocab.map((v: any) => <TabsTrigger key={v.word} value={v.word} className="text-xs px-2 py-1.5">{v.word}</TabsTrigger>)}
                    </TabsList>
                    {editableVocab.map((v: any) => (
                      <TabsContent key={v.word} value={v.word} className="mt-3">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-foreground">{v.word}</h4>
                          <p className="text-sm text-muted-foreground">{v.definition}</p>
                          <div className="bg-muted/50 p-3 rounded-lg"><p className="text-sm italic">{`"${v.example}"`}</p></div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                ) : (
                  <p className="text-center text-xs text-muted-foreground py-4 italic">Nenhum vocabulário desta aula</p>
                )
              )}
            </CardContent>
          </Card>

          {/* Exercises / Quiz Card — shown for all lesson types when quizzes exist */}
          {!isEditable && currentLesson.quizzes && currentLesson.quizzes.length > 0 && (
            <LessonQuizCard quiz={currentLesson.quizzes[0]} lessonId={currentLesson.id} />
          )}

          {/* Next lesson */}
          {!isEditable && nextLesson && (
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base font-semibold font-display">A Seguir</CardTitle></CardHeader>
              <CardContent>
                <Link href={`/student/lesson/${nextLesson.id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary shrink-0">
                    {lessonTypeIcon(nextLesson.lessonType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{nextLesson.title}</p>
                    <p className="text-xs text-muted-foreground">{lessonTypeLabel(nextLesson.lessonType)} {nextLesson.duration ? `· ${Math.floor(nextLesson.duration / 60)}m` : ""}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Completion */}
          {!isEditable && (
            <Card className={cn("border-primary/20 bg-primary/[0.03]", completed && "border-success/20 bg-success/5")}>
              <CardContent className="p-5 text-center">
                <div className={cn("flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-3", completed ? "bg-success/10 text-success" : "bg-primary/10 text-primary")}>
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">{completed ? "Aula Concluída" : "Marcar como Concluída"}</p>
                <p className="text-xs text-muted-foreground mb-3">Ganhe 25 XP ao finalizar</p>
                <Button size="sm" className="w-full" onClick={handleComplete} disabled={completed} variant={completed ? "secondary" : "default"}>
                  {completed ? <><CheckCircle2 className="w-4 h-4 mr-2" />Concluída</> : "Concluir Aula"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

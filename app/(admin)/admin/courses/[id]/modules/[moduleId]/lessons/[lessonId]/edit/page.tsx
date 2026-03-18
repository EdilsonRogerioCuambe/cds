import { LessonContentEditor } from "@/components/teacher/lesson-content-editor"
import { LessonPublicationToggle } from "@/components/teacher/lesson-publication-toggle"
import { LessonScheduler } from "@/components/teacher/lesson-scheduler"
import { QuizBuilder } from "@/components/teacher/quiz-builder"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { ArrowLeft, BookOpen, CalendarDays, FileText, HelpCircle, Layers, Video, Zap } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

const LESSON_TYPE_META: Record<string, { label: string; color: string; icon: any }> = {
  VIDEO:     { label: "Vídeo",    color: "bg-primary/10 text-primary border-primary/20",       icon: Video },
  NOTES:     { label: "Notas",    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",    icon: FileText },
  LIVE:      { label: "Ao Vivo",  color: "bg-red-500/10 text-red-500 border-red-500/20",       icon: Video },
  CHALLENGE: { label: "Desafio",  color: "bg-amber-500/10 text-amber-600 border-amber-500/20", icon: Zap },
}

export default async function AdminEditLessonPage({ params }: { params: Promise<{ id: string; moduleId: string; lessonId: string }> }) {
  const { id: courseId, moduleId, lessonId } = await params
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN") redirect("/auth/login")

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: { include: { course: true } },
      quizzes: true
    }
  })

  if (!lesson || lesson.module.id !== moduleId || lesson.module.courseId !== courseId) notFound()

  const quiz = lesson.quizzes[0]
  const lessonType = lesson.lessonType || "VIDEO"
  const typeMeta = LESSON_TYPE_META[lessonType] || LESSON_TYPE_META.VIDEO
  const TypeIcon = typeMeta.icon

  const showSchedulerTab = lessonType === "VIDEO" || lessonType === "NOTES"
  const showQuizTab = lessonType !== "LIVE"

  return (
    <div className="min-h-screen">
      {/* Sticky Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                <Link href="/admin/courses" className="hover:text-foreground transition-colors flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> Cursos
                </Link>
                <span>/</span>
                <Link href={`/admin/courses/${courseId}/edit`} className="hover:text-foreground transition-colors max-w-[100px] truncate">
                  {lesson.module.course.title}
                </Link>
                <span>/</span>
                <Link href={`/admin/courses/${courseId}/modules/${moduleId}/edit`} className="hover:text-foreground transition-colors flex items-center gap-1 max-w-[100px] truncate">
                  <Layers className="w-3 h-3" /> {lesson.module.title}
                </Link>
                <span>/</span>
                <span className="text-foreground/60 max-w-[100px] truncate">{lesson.title}</span>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-bold font-display text-foreground">{lesson.title}</h1>
                <Badge variant="outline" className={`text-[11px] px-2.5 py-1 flex items-center gap-1.5 ${typeMeta.color}`}>
                  <TypeIcon className="w-3 h-3" />
                  {typeMeta.label}
                </Badge>
              </div>

              {(lesson as any).scheduledAt && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 border border-primary/20 rounded-lg px-3 py-1.5 w-fit">
                  <CalendarDays className="w-3.5 h-3.5 text-primary" />
                  Disponível a partir de{" "}
                  <span className="font-medium text-foreground">
                    {new Date((lesson as any).scheduledAt).toLocaleString("pt-BR", {
                      day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                    })}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <LessonPublicationToggle lessonId={lesson.id} initialPublished={lesson.published || false} />
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/courses/${courseId}/modules/${moduleId}/edit`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
        <Tabs defaultValue="content" className="space-y-6">
          <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
            <TabsList className="h-10 gap-1 inline-flex w-auto">
              <TabsTrigger value="content" className="flex items-center gap-1.5">
                <TypeIcon className="w-3.5 h-3.5" />
                {lessonType === "NOTES" ? "Notas da Aula" : lessonType === "LIVE" ? "Sessão Ao Vivo" : lessonType === "CHALLENGE" ? "Configuração" : "Conteúdo"}
              </TabsTrigger>
              {showSchedulerTab && (
                <TabsTrigger value="scheduler" className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5" />
                  Agendamento
                  {(lesson as any).scheduledAt && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                </TabsTrigger>
              )}
              {showQuizTab && (
                <TabsTrigger value="quiz" className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  {lessonType === "CHALLENGE" ? "Questões" : "Desafios / Quiz"}
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <TabsContent value="content">
            <LessonContentEditor
              lessonId={lesson.id}
              lessonType={lessonType}
              initialVideoUrl={lesson.videoUrl || undefined}
              initialContent={lesson.content || ""}
              initialVocabulary={(lesson.vocabulary as any) || []}
              initialScheduledAt={(lesson as any).scheduledAt?.toISOString() || null}
              initialMeetingUrl={(lesson as any).meetingUrl || null}
              initialMeetingPlatform={(lesson as any).meetingPlatform || null}
              initialChallengeConfig={(lesson as any).challengeConfig || null}
              title={lesson.title}
              module={lesson.module.title}
              level={lesson.module.course.level}
              courseId={lesson.module.course.id}
              initialMetadata={(lesson.metadata as any) || undefined}
              initialPublished={lesson.published || false}
              initialVideoId={lesson.videoId || null}
            />
          </TabsContent>

          {showSchedulerTab && (
            <TabsContent value="scheduler">
              <LessonScheduler
                lessonId={lesson.id}
                initialScheduledAt={(lesson as any).scheduledAt}
                lessonTitle={lesson.title}
                published={lesson.published || false}
              />
            </TabsContent>
          )}

          {showQuizTab && (
            <TabsContent value="quiz">
              <QuizBuilder lessonId={lesson.id} initialData={quiz} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}

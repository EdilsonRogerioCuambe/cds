"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { type Course, type Module } from "@/lib/data"
import { cn, formatDuration } from "@/lib/utils"
import {
    BookOpen,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Clock,
    FileText,
    Loader2,
    Lock,
    Play,
    Trophy,
    Users,
    Video,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { CertificateDownloadButton } from "./certificate-download-button"

const levelColors: Record<string, string> = {
  A1: "bg-[#15b376]", // Brand Green
  A2: "bg-[#10b981]",
  B1: "bg-[#059669]",
  B2: "bg-[#047857]",
  C1: "bg-[#065f46]",
  C2: "bg-[#064e3b]",
}

const categoryIcons: Record<string, string> = {
  Grammar: "Aa",
  Vocabulary: "Ww",
  Listening: "Li",
  Speaking: "Sp",
  Writing: "Wr",
}

function ModuleCard({
  module: mod,
  courseId,
  courseTitle,
}: {
  module: Module
  courseId: string
  courseTitle: string
}) {
  const [expanded, setExpanded] = useState(false)
  const completionPercent = Math.round(
    (mod.completedLessons / mod.lessons.length) * 100
  )
  const isComplete = mod.completedLessons === mod.lessons.length

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded(!expanded)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setExpanded(!expanded)
          }
        }}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted/50 transition-colors cursor-pointer"
      >
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-lg text-xs font-bold shrink-0",
            isComplete
              ? "bg-success/10 text-success"
              : "bg-primary/10 text-primary"
          )}
        >
          {isComplete ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            categoryIcons[mod.category]
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground truncate">
              {mod.title}
            </p>
            <Badge variant="outline" className="text-xs shrink-0">
              {mod.category}
            </Badge>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-muted-foreground">
              {mod.completedLessons}/{mod.lessons.length} aulas
            </span>
            <span className="text-xs text-muted-foreground">
              {mod.estimatedMinutes} min
            </span>
          </div>
          <div className="flex items-center justify-between mt-2 gap-4">
            <Progress value={completionPercent} className="h-1.5 flex-1" />
            <CertificateDownloadButton
              type="MODULE"
              id={mod.id}
              title={mod.title}
              courseTitle={courseTitle}
            />
          </div>
        </div>
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </div>

      {expanded && (
        <div className="border-t border-border bg-muted/20">
          {(() => {
            let foundNext = false
            return mod.lessons.map((lesson, i) => {
              const isNext = !lesson.completed && !foundNext
              if (isNext) foundNext = true

              const LessonIcon = lesson.lessonType === "VIDEO" ? Video :
                                lesson.lessonType === "NOTES" ? FileText :
                                lesson.lessonType === "CHALLENGE" ? Trophy :
                                Users // LIVE

              return (
                <Link
                  key={lesson.id}
                  href={lesson.isAttachedQuiz ? `/student/quiz/${lesson.id}` : `/student/lesson/${lesson.id}`}
                  className={cn(
                    "flex items-center gap-3 px-4 py-4 hover:bg-muted/50 transition-all border-b last:border-b-0 border-border/50 relative group",
                    isNext && "bg-primary/[0.03] border-l-4 border-l-primary py-5 shadow-sm"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-9 h-9 rounded-xl text-xs font-medium shrink-0 transition-colors",
                      lesson.completed
                        ? "bg-success/20 text-success"
                        : isNext
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    )}
                  >
                    {lesson.completed ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <LessonIcon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                       <p
                        className={cn(
                          "text-sm truncate",
                          lesson.completed
                            ? "text-muted-foreground line-through opacity-70"
                            : "text-foreground font-bold"
                        )}
                      >
                        {lesson.title}
                      </p>
                      {isNext && (
                        <Badge className="bg-primary text-[10px] font-black tracking-tighter h-4 px-1 leading-none uppercase animate-pulse">
                          Próxima
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                       <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">
                          {lesson.lessonType === "VIDEO" ? "Vídeo Aula" :
                           lesson.lessonType === "NOTES" ? "Nota de Estudo" :
                           lesson.lessonType === "CHALLENGE" ? "Desafio/Quiz" : "Aula ao Vivo"}
                       </span>
                       <span className="text-[10px] text-muted-foreground/40">•</span>
                       <span className="text-[10px] text-muted-foreground font-medium">
                        {lesson.duration}
                      </span>
                    </div>
                  </div>

                  {!lesson.completed && (
                    <div className={cn(
                       "flex items-center justify-center w-8 h-8 rounded-full transition-all shrink-0",
                       isNext ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground"
                    )}>
                       <Play className={cn("w-3.5 h-3.5 fill-current", isNext ? "animate-pulse" : "")} />
                    </div>
                  )}
                </Link>
              )
            })
          })()}
        </div>
      )}
    </div>
  )
}

import { enrollInCourse } from "@/lib/actions/student"
import { toast } from "sonner"

// ... existing code ...

function CourseCard({ course }: { course: Course }) {
  const [expanded, setExpanded] = useState(false)
  const [isEnrolling, setIsEnrolling] = useState(false)

  const handleEnroll = async () => {
    setIsEnrolling(true)
    try {
      await enrollInCourse(course.id)
      toast.success(`Inscrito com sucesso em ${course.title}!`)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsEnrolling(false)
    }
  }

  const totalCompleted = course.modules.reduce(
    (acc, m) => acc + m.completedLessons,
    0
  )
  const totalInModules = course.modules.reduce(
    (acc, m) => acc + m.lessons.length,
    0
  )
  const progressPercent =
    totalInModules > 0 ? Math.round((totalCompleted / totalInModules) * 100) : 0

  return (
    <Card
      className={cn(
        "transition-all",
        course.locked && "opacity-60"
      )}
    >
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div
              className={cn(
                "flex items-center justify-center w-14 h-14 rounded-2xl text-white font-display text-lg font-bold shrink-0",
                levelColors[course.level]
              )}
            >
              {course.level}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-display text-foreground">
                  {course.title}
                </h3>
                {course.locked && (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {course.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  {course.totalLessons} aulas
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDuration(course.estimatedHours)}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {course.enrolled.toLocaleString()} alunos
                </span>
              </div>
            </div>
          </div>

          {!course.locked && totalInModules > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-foreground">
                  Progresso
                </span>
                <span className="text-xs text-muted-foreground">
                  {progressPercent}%
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          )}

          {!course.locked && course.modules.length > 0 && (
            <div className="mt-4 flex gap-2">
              {course.isEnrolled ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpanded(!expanded)}
                  className="text-primary hover:text-primary"
                >
                  {expanded ? "Ocultar Módulos" : "Ver Módulos"}
                  {expanded ? (
                    <ChevronDown className="w-4 h-4 ml-1" />
                  ) : (
                    <ChevronRight className="w-4 h-4 ml-1" />
                  )}
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isEnrolling ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Inscrevendo...
                    </>
                  ) : (
                    "Inscrever-se Agora"
                  )}
                </Button>
              )}
            </div>
          )}

          {course.locked && (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="w-4 h-4" />
              Conclua o nível anterior para desbloquear
            </div>
          )}
        </div>

        {expanded && course.modules.length > 0 && (
          <div className="px-5 pb-5 space-y-3">
            {course.modules.map((mod) => (
              <ModuleCard key={mod.id} module={mod} courseId={course.id} courseTitle={course.title} />
            ))}

            {/* Final Course Certificate Button */}
            <div className="mt-4 pt-4 border-t border-border">
               <CertificateDownloadButton
                  type="COURSE"
                  id={course.id}
                  title={course.title}
               />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function CourseStructure({ courses }: { courses: Course[] }) {
  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground text-balance">
          Catálogo de Cursos
        </h1>
        <p className="text-muted-foreground mt-1">
          Avance por seis níveis, do Iniciante ao Avançado
        </p>
      </div>

      {/* Level progression line */}
      <div className="hidden md:flex items-center gap-2 mb-8 px-2">
        {courses.map((course, i) => (
          <div key={course.id} className="flex items-center flex-1">
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold text-white shrink-0",
                levelColors[course.level],
                course.locked && "opacity-50"
              )}
            >
              {course.level}
            </div>
            {i < courses.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2",
                  course.locked ? "bg-border" : "bg-primary/30"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
    </div>
  )
}

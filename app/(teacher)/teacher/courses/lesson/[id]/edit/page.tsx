import { LessonContentEditor } from "@/components/teacher/lesson-content-editor"
import { LessonPublicationToggle } from "@/components/teacher/lesson-publication-toggle"
import { QuizBuilder } from "@/components/teacher/quiz-builder"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

export default async function EditLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) redirect("/auth/login")

  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: {
      module: {
        include: {
          course: true
        }
      },
      quizzes: true
    }
  })

  if (!lesson) notFound()
  if (lesson.module.course.teacherId !== user.id && user.role !== "ADMIN") redirect("/teacher/dashboard")

  const quiz = lesson.quizzes[0] // Assuming one quiz per lesson for now

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Gerenciar Aula</h1>
          <p className="text-muted-foreground mt-1">
             <Link href={`/teacher/courses/${lesson.module.course.id}/edit`} className="hover:underline">
               {lesson.module.course.title}
             </Link>
             {" > "}
             {lesson.module.title}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <LessonPublicationToggle
            lessonId={lesson.id}
            initialPublished={lesson.published || false}
          />
          <Button variant="outline" asChild>
            <Link href={`/teacher/courses/${lesson.module.course.id}/edit`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList>
          <TabsTrigger value="content">Conteúdo da Aula</TabsTrigger>
          <TabsTrigger value="quiz">Desafios / Quiz</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <LessonContentEditor
            lessonId={lesson.id}
            initialVideoUrl={lesson.videoUrl || undefined}
            initialContent={lesson.content || ""}
            initialVocabulary={(lesson.vocabulary as any) || []}
            title={lesson.title}
            module={lesson.module.title}
            level={lesson.module.course.level}
            initialMetadata={(lesson.metadata as any) || undefined}
          />
        </TabsContent>

        <TabsContent value="quiz">
          <QuizBuilder lessonId={lesson.id} initialData={quiz} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

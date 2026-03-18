import { CourseEditor } from "@/components/teacher/course-editor"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { ArrowLeft, BookOpen, GraduationCap, Users } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

export default async function AdminEditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN") redirect("/auth/login")

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: { orderBy: { order: "asc" } }
        }
      },
      _count: { select: { enrollments: true } },
      instructors: {
        select: { id: true, name: true, email: true, image: true }
      }
    }
  })

  if (!course) notFound()

  const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1.5">
                <Link href="/admin/courses" className="hover:text-foreground transition-colors flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  Cursos
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium truncate max-w-[200px]">{course.title}</span>
              </div>
              <h1 className="text-2xl font-bold font-display text-foreground">Editar Curso</h1>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Course Stats */}
              <div className="hidden sm:flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  {course._count.enrollments} alunos
                </span>
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {totalLessons} aulas
                </span>
                <Badge variant={course.published ? "default" : "secondary"}>
                  {course.published ? "Publicado" : "Rascunho"}
                </Badge>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/courses">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Instructors Banner (Admin View) */}
        {course.instructors.length > 0 && (
          <div className="mb-6 p-4 rounded-xl border bg-primary/5 border-primary/20 flex items-start gap-3">
            <GraduationCap className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">Instrutores do Curso</p>
              <div className="flex flex-wrap gap-2">
                {course.instructors.map(inst => (
                  <Badge key={inst.id} variant="outline" className="text-xs">
                    {inst.name || inst.email}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        <CourseEditor initialData={course as any} />
      </div>
    </div>
  )
}

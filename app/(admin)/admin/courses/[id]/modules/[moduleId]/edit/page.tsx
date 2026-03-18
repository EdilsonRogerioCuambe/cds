import { ModuleEditor } from "@/components/teacher/module-editor"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { ArrowLeft, BookOpen, Layers } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

export default async function AdminEditModulePage({ params }: { params: Promise<{ id: string; moduleId: string }> }) {
  const { id: courseId, moduleId } = await params
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN") redirect("/auth/login")

  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    include: {
      course: true,
      lessons: { orderBy: { order: "asc" } }
    }
  })

  if (!module || module.courseId !== courseId) notFound()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1.5 flex-wrap">
                <Link href="/admin/courses" className="hover:text-foreground transition-colors flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  Cursos
                </Link>
                <span>/</span>
                <Link href={`/admin/courses/${courseId}/edit`} className="hover:text-foreground transition-colors max-w-[120px] truncate">
                  {module.course.title}
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[120px]">{module.title}</span>
                </span>
              </div>
              <h1 className="text-2xl font-bold font-display text-foreground">Editar Módulo</h1>
            </div>

            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/courses/${courseId}/edit`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Curso
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <ModuleEditor initialData={module} />
      </div>
    </div>
  )
}

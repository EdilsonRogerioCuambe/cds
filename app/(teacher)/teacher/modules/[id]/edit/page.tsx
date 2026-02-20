import { ModuleEditor } from "@/components/teacher/module-editor"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

export default async function EditModulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) redirect("/auth/login")

  const module = await prisma.module.findUnique({
    where: { id },
    include: {
      course: true,
      lessons: {
        orderBy: { order: "asc" }
      }
    }
  })

  if (!module) notFound()
  if (module.course.teacherId !== user.id && user.role !== "ADMIN") redirect("/teacher/dashboard")

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/teacher/courses" className="hover:underline">Cursos</Link>
            <span>/</span>
            <Link href={`/teacher/courses/${module.course.id}/edit`} className="hover:underline max-w-[150px] truncate">{module.course.title}</Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-w-[150px]">{module.title}</span>
          </div>
          <h1 className="text-3xl font-bold font-display text-foreground">Gerenciar Módulo</h1>
          <p className="text-muted-foreground mt-1">Edite o título e as aulas deste módulo</p>
        </div>
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href={`/teacher/courses/${module.course.id}/edit`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o curso
          </Link>
        </Button>
      </div>

      <ModuleEditor initialData={module} />
    </div>
  )
}

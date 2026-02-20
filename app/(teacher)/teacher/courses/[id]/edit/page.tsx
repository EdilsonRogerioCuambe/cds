import { CourseEditor } from "@/components/teacher/course-editor"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) redirect("/auth/login")

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: { orderBy: { order: "asc" } }
        }
      }
    }
  })

  if (!course) notFound()
  if (course.teacherId !== user.id && user.role !== "ADMIN") redirect("/teacher/dashboard")

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-display text-foreground">Editar Curso</h1>
        <p className="text-muted-foreground">Gerencie a estrutura e o conteúdo do curso</p>
      </div>
      <CourseEditor initialData={course} />
    </div>
  )
}

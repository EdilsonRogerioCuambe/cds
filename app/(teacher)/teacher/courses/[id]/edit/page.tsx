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
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground">Editar Curso</h1>
        <p className="text-muted-foreground mt-1">Gerencie a estrutura e o conteúdo do curso</p>
      </div>
      <CourseEditor initialData={course} />
    </div>
  )
}

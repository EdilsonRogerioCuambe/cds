import { CourseList } from "@/components/teacher/course-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getCurrentUser } from "@/lib/auth"
import { getCourses } from "@/lib/data"
import { BookOpen, PlusCircle } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function TeacherCoursesPage() {
  const user = await getCurrentUser()

  if (!user || (user.role !== "ADMIN" && user.role !== "TEACHER")) {
    redirect("/auth/login")
  }

  const courses = await getCourses(user.id)

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Meus Cursos</h1>
          <p className="text-muted-foreground mt-1">Gerencie seu conteúdo e acompanhe o progresso</p>
        </div>
        <Button asChild>
          <Link href="/teacher/courses/new">
            <PlusCircle className="w-4 h-4 mr-2" />
            Novo Curso
          </Link>
        </Button>
      </div>

      {courses.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
            <p className="text-muted-foreground">Você ainda não criou nenhum curso.</p>
            <Button variant="link" asChild>
              <Link href="/teacher/courses/new">Comece agora criando seu primeiro curso</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <CourseList courses={courses} />
      )}
    </div>
  )
}

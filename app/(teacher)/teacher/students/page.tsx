import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Users } from "lucide-react"
import { redirect } from "next/navigation"

export default async function TeacherStudentsPage() {
  const user = await getCurrentUser()

  if (!user || (user.role !== "ADMIN" && user.role !== "TEACHER")) {
    redirect("/auth/login")
  }

  // Fetch students enrolled in this teacher's courses
  const enrollments = await prisma.enrollment.findMany({
    where: { course: { teacherId: user.id } },
    include: {
      user: true,
      course: {
        include: {
          modules: {
            include: {
              lessons: { select: { id: true } }
            }
          }
        }
      }
    }
  })

  // For each enrollment, get how many lessons the student completed in this course
  const enriched = await Promise.all(
    enrollments.map(async (enrollment) => {
      const totalLessons = enrollment.course.modules.reduce(
        (acc, m) => acc + m.lessons.length, 0
      )
      const completedLessons = totalLessons === 0 ? 0 : await prisma.progress.count({
        where: {
          userId: enrollment.user.id,
          completed: true,
          lesson: { module: { courseId: enrollment.course.id } }
        }
      })
      const progressPct = totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0

      return { ...enrollment, progressPct, completedLessons, totalLessons }
    })
  )

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black font-display text-foreground">Alunos</h1>
        <p className="text-muted-foreground mt-1">
          Monitore o desempenho e progresso dos seus alunos
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase font-black tracking-widest text-muted-foreground/60">Total de Alunos</p>
            <p className="text-4xl font-black mt-2 text-primary">{enrollments.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase font-black tracking-widest text-muted-foreground/60">Ativos</p>
            <p className="text-4xl font-black mt-2 text-emerald-500">
              {enrollments.filter(e => e.status === "ACTIVE").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase font-black tracking-widest text-muted-foreground/60">Progresso Médio</p>
            <p className="text-4xl font-black mt-2 text-blue-500">
              {enriched.length > 0
                ? Math.round(enriched.reduce((acc, e) => acc + e.progressPct, 0) / enriched.length)
                : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {enriched.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="w-14 h-14 text-muted-foreground mb-4 opacity-20" />
            <p className="text-muted-foreground font-bold">Nenhum aluno inscrito ainda.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Publique seus cursos para receber inscrições.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="font-black">Inscrições</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enriched.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={enrollment.user.image || ""} />
                          <AvatarFallback className="font-bold">
                            {enrollment.user.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold">{enrollment.user.name}</p>
                          <p className="text-xs text-muted-foreground">{enrollment.user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium">{enrollment.course.title}</p>
                      <p className="text-xs text-muted-foreground">{enrollment.course.level}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-bold">
                        {enrollment.user.currentLevel || "A1"}
                      </Badge>
                    </TableCell>
                    <TableCell className="w-[200px]">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-muted-foreground">
                            {enrollment.completedLessons}/{enrollment.totalLessons} lições
                          </span>
                          <span className="text-foreground">{enrollment.progressPct}%</span>
                        </div>
                        <Progress value={enrollment.progressPct} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={enrollment.status === "ACTIVE" ? "default" : "secondary"}
                        className="capitalize font-bold"
                      >
                        {enrollment.status === "ACTIVE" ? "Ativo" : enrollment.status.toLowerCase()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

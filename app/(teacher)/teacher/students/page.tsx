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

  // Fetch students enrolled in courses taught by this teacher
  const enrollments = await prisma.enrollment.findMany({
    where: {
      course: {
        teacherId: user.id
      }
    },
    include: {
      user: true,
      course: true
    }
  })

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground">Alunos</h1>
        <p className="text-muted-foreground mt-1">Monitore o desempenho e progresso dos seus alunos</p>
      </div>

      {enrollments.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
            <p className="text-muted-foreground">Nenhum aluno inscrito nos seus cursos ainda.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Inscrições Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Nível Atual</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={enrollment.user.image || ""} />
                          <AvatarFallback>{enrollment.user.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{enrollment.user.name}</p>
                          <p className="text-xs text-muted-foreground">{enrollment.user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{enrollment.course.title}</p>
                      <p className="text-xs text-muted-foreground">{enrollment.course.level}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{enrollment.user.currentLevel || "A1"}</Badge>
                    </TableCell>
                    <TableCell className="w-[200px]">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span>Progresso</span>
                          <span>0%</span>
                        </div>
                        <Progress value={0} className="h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={enrollment.status === "ACTIVE" ? "default" : "secondary"} className="capitalize">
                        {enrollment.status.toLowerCase()}
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

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Edit, Eye, MoreVertical, Plus, Trash2, Users } from "lucide-react"

import prisma from "@/lib/prisma"

export default async function AdminCoursesPage() {
  const dbCourses = await prisma.course.findMany({
    include: {
      _count: {
        select: { enrollments: true }
      },
      modules: {
        include: {
          lessons: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  const courses = dbCourses.map(course => ({
    id: course.id,
    title: course.title,
    description: course.description,
    level: course.level,
    students: course._count.enrollments,
    lessons: course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0),
    status: course.published ? "published" : "draft",
    thumbnail: course.thumbnailUrl || "📚"
  }))
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Cursos</h1>
          <p className="text-muted-foreground">Crie, edite e gerencie todos os cursos da plataforma</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Criar Curso
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total de Cursos</p>
          <p className="text-2xl font-bold">{courses.length}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Publicados</p>
          <p className="text-2xl font-bold text-green-600">
            {courses.filter(c => c.status === "published").length}
          </p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Rascunhos</p>
          <p className="text-2xl font-bold text-orange-600">
            {courses.filter(c => c.status === "draft").length}
          </p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total de Alunos</p>
          <p className="text-2xl font-bold">
            {courses.reduce((sum, c) => sum + c.students, 0)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Nível" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os níveis</SelectItem>
            <SelectItem value="A1">A1</SelectItem>
            <SelectItem value="A2">A2</SelectItem>
            <SelectItem value="B1">B1</SelectItem>
            <SelectItem value="B2">B2</SelectItem>
            <SelectItem value="C1">C1</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="published">Publicado</SelectItem>
            <SelectItem value="draft">Rascunho</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Courses Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="text-4xl mb-2">{course.thumbnail}</div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardTitle className="line-clamp-1">{course.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {course.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Nível</span>
                  <Badge variant="outline">{course.level}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Lições</span>
                  <span className="font-medium">{course.lessons}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Alunos
                  </span>
                  <span className="font-medium">{course.students}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Badge
                className="w-full justify-center"
                variant={course.status === "published" ? "default" : "secondary"}
              >
                {course.status === "published" ? "Publicado" : "Rascunho"}
              </Badge>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

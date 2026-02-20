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

// Mock data
const mockCourses = [
  {
    id: "1",
    title: "English A1 - Beginner",
    description: "Curso introdutório de inglês para iniciantes absolutos",
    level: "A1",
    students: 234,
    lessons: 48,
    status: "published",
    thumbnail: "📚"
  },
  {
    id: "2",
    title: "English A2 - Elementary",
    description: "Curso elementar de inglês para consolidar bases",
    level: "A2",
    students: 198,
    lessons: 52,
    status: "published",
    thumbnail: "📖"
  },
  {
    id: "3",
    title: "English B1 - Intermediate",
    description: "Nível intermediário com foco em conversação",
    level: "B1",
    students: 156,
    lessons: 60,
    status: "published",
    thumbnail: "🎯"
  },
  {
    id: "4",
    title: "English B2 - Upper Intermediate",
    description: "Inglês avançado para comunicação profissional",
    level: "B2",
    students: 89,
    lessons: 58,
    status: "published",
    thumbnail: "🚀"
  },
  {
    id: "5",
    title: "English C1 - Advanced",
    description: "Curso avançado com textos complexos e acadêmicos",
    level: "C1",
    students: 45,
    lessons: 64,
    status: "draft",
    thumbnail: "🎓"
  },
  {
    id: "6",
    title: "Business English",
    description: "Inglês para negócios e contextos corporativos",
    level: "B2",
    students: 112,
    lessons: 40,
    status: "published",
    thumbnail: "💼"
  },
]

export default function AdminCoursesPage() {
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
          <p className="text-2xl font-bold">{mockCourses.length}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Publicados</p>
          <p className="text-2xl font-bold text-green-600">
            {mockCourses.filter(c => c.status === "published").length}
          </p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Rascunhos</p>
          <p className="text-2xl font-bold text-orange-600">
            {mockCourses.filter(c => c.status === "draft").length}
          </p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total de Alunos</p>
          <p className="text-2xl font-bold">
            {mockCourses.reduce((sum, c) => sum + c.students, 0)}
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
        {mockCourses.map((course) => (
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

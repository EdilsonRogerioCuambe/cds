import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ClipboardCheck, Edit, Plus, Search, Trash2 } from "lucide-react"

// Mock data
const mockQuizzes = [
  { id: "1", title: "Greetings Quiz", course: "A1 Beginner", questions: 10, avgScore: 85, completions: 156, status: "published" },
  { id: "2", title: "Numbers Test", course: "A1 Beginner", questions: 15, avgScore: 78, completions: 142, status: "published" },
  { id: "3", title: "Present Simple Assessment", course: "A2 Elementary", questions: 20, avgScore: 72, completions: 98, status: "published" },
  { id: "4", title: "Vocabulary Challenge", course: "B1 Intermediate", questions: 25, avgScore: 0, completions: 0, status: "draft" },
  { id: "5", title: "Grammar Final Exam", course: "B2 Upper Intermediate", questions: 30, avgScore: 68, completions: 45, status: "published" },
]

export default function AdminQuizzesPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Quizzes</h1>
          <p className="text-muted-foreground">Crie e gerencie quizzes e avaliações</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Quiz
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total de Quizzes</p>
          <p className="text-2xl font-bold">{mockQuizzes.length}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Publicados</p>
          <p className="text-2xl font-bold text-green-600">
            {mockQuizzes.filter(q => q.status === "published").length}
          </p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total de Questões</p>
          <p className="text-2xl font-bold">
            {mockQuizzes.reduce((sum, q) => sum + q.questions, 0)}
          </p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Pontuação Média</p>
          <p className="text-2xl font-bold">
            {Math.round(
              mockQuizzes.filter(q => q.completions > 0).reduce((sum, q) => sum + q.avgScore, 0) /
              mockQuizzes.filter(q => q.completions > 0).length
            )}%
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar quizzes..." className="pl-10" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Curso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os cursos</SelectItem>
            <SelectItem value="A1">A1 Beginner</SelectItem>
            <SelectItem value="A2">A2 Elementary</SelectItem>
            <SelectItem value="B1">B1 Intermediate</SelectItem>
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

      {/* Quizzes Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Questões</TableHead>
              <TableHead>Pontuação Média</TableHead>
              <TableHead>Conclusões</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockQuizzes.map((quiz) => (
              <TableRow key={quiz.id}>
                <TableCell className="font-medium">{quiz.title}</TableCell>
                <TableCell>{quiz.course}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    <ClipboardCheck className="mr-1 h-3 w-3" />
                    {quiz.questions}
                  </Badge>
                </TableCell>
                <TableCell>
                  {quiz.completions > 0 ? (
                    <span className={quiz.avgScore >= 70 ? "text-green-600 font-semibold" : "text-orange-600 font-semibold"}>
                      {quiz.avgScore}%
                    </span>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </TableCell>
                <TableCell>{quiz.completions}</TableCell>
                <TableCell>
                  <Badge variant={quiz.status === "published" ? "default" : "secondary"}>
                    {quiz.status === "published" ? "Publicado" : "Rascunho"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

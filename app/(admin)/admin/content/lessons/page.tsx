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
import { Edit, Play, Plus, Search, Trash2 } from "lucide-react"

// Mock data
const mockLessons = [
  { id: "1", title: "Introduction to English", course: "A1 Beginner", duration: "15 min", type: "video", status: "published" },
  { id: "2", title: "Basic Greetings", course: "A1 Beginner", duration: "10 min", type: "interactive", status: "published" },
  { id: "3", title: "Numbers and Counting", course: "A1 Beginner", duration: "12 min", type: "video", status: "published" },
  { id: "4", title: "Present Simple Tense", course: "A2 Elementary", duration: "20 min", type: "video", status: "draft" },
  { id: "5", title: "Daily Routines", course: "A2 Elementary", duration: "18 min", type: "interactive", status: "published" },
]

export default function AdminLessonsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Lições</h1>
          <p className="text-muted-foreground">Crie e organize lições de todos os cursos</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Lição
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total de Lições</p>
          <p className="text-2xl font-bold">{mockLessons.length}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Publicadas</p>
          <p className="text-2xl font-bold text-green-600">
            {mockLessons.filter(l => l.status === "published").length}
          </p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Vídeos</p>
          <p className="text-2xl font-bold">
            {mockLessons.filter(l => l.type === "video").length}
          </p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Interativas</p>
          <p className="text-2xl font-bold">
            {mockLessons.filter(l => l.type === "interactive").length}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar lições..." className="pl-10" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
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
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="video">Vídeo</SelectItem>
            <SelectItem value="interactive">Interativa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lessons Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockLessons.map((lesson) => (
              <TableRow key={lesson.id}>
                <TableCell className="font-medium">{lesson.title}</TableCell>
                <TableCell>{lesson.course}</TableCell>
                <TableCell>{lesson.duration}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {lesson.type === "video" ? (
                      <><Play className="mr-1 h-3 w-3" /> Vídeo</>
                    ) : (
                      "Interativa"
                    )}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={lesson.status === "published" ? "default" : "secondary"}>
                    {lesson.status === "published" ? "Publicada" : "Rascunho"}
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

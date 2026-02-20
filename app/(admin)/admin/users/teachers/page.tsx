import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
    TableRow
} from "@/components/ui/table"
import { Award, Ban, Mail, MoreVertical, Search, Trash2, UserPlus } from "lucide-react"

// Mock data
const mockTeachers = [
  {
    id: "1",
    name: "Maria Eduarda",
    email: "maria@connect-school.com",
    courses: 3,
    students: 45,
    joined: "10 Jun 2023",
    status: "active"
  },
  {
    id: "2",
    name: "Carlos Silva",
    email: "carlos@connect-school.com",
    courses: 2,
    students: 32,
    joined: "15 Mar 2024",
    status: "active"
  },
  {
    id: "3",
    name: "Ana Santos",
    email: "ana@connect-school.com",
    courses: 4,
    students: 58,
    joined: "22 Jan 2024",
    status: "active"
  },
  {
    id: "4",
    name: "Pedro Costa",
    email: "pedro@connect-school.com",
    courses: 1,
    students: 15,
    joined: "05 Feb 2024",
    status: "inactive"
  },
]

export default function AdminTeachersPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Professores</h1>
          <p className="text-muted-foreground">Visualize e gerencie todos os professores da plataforma</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar Professor
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockTeachers.filter(t => t.status === "active").length}</p>
              <p className="text-sm text-muted-foreground">Professores Ativos</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <UserPlus className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockTeachers.reduce((sum, t) => sum + t.students, 0)}</p>
              <p className="text-sm text-muted-foreground">Total de Alunos</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Award className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockTeachers.reduce((sum, t) => sum + t.courses, 0)}</p>
              <p className="text-sm text-muted-foreground">Cursos Lecionados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar professores por nome ou email..."
            className="pl-10"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Teachers Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Cursos</TableHead>
              <TableHead>Alunos</TableHead>
              <TableHead>Data de Entrada</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTeachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell className="font-medium">{teacher.name}</TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{teacher.courses} cursos</Badge>
                </TableCell>
                <TableCell>{teacher.students} alunos</TableCell>
                <TableCell>{teacher.joined}</TableCell>
                <TableCell>
                  <Badge
                    variant={teacher.status === "active" ? "default" : "secondary"}
                  >
                    {teacher.status === "active" ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        Ver Detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        Enviar email
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Ban className="mr-2 h-4 w-4" />
                        Desativar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remover
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          Mostrando {mockTeachers.length} de {mockTeachers.length} professores
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Anterior
          </Button>
          <Button variant="outline" size="sm" disabled>
            Próximo
          </Button>
        </div>
      </div>
    </div>
  )
}

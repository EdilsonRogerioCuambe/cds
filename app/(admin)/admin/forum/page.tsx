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
    TableRow,
} from "@/components/ui/table"
import { Ban, MessageSquare, MoreVertical, Search, Trash2 } from "lucide-react"

// Mock data
const mockPosts = [
  { id: "1", title: "Dúvida sobre Present Perfect", author: "João Silva", type: "Question", responses: 5, status: "active", date: "2 horas atrás" },
  { id: "2", title: "Material extra para A2", author: "Maria Santos", type: "Discussion", responses: 12, status: "active", date: "1 dia atrás" },
  { id: "3", title: "Erro na lição 4", author: "Pedro Costa", type: "Bug Report", responses: 2, status: "resolved", date: "3 dias atrás" },
  { id: "4", title: "Sugestão de funcionalidade", author: "Ana Oliveira", type: "Suggestion", responses: 8, status: "active", date: "1 semana atrás" },
  { id: "5", title: "Conteúdo inapropriado", author: "Carlos Ferreira", type: "Discussion", responses: 0, status: "flagged", date: "2 semanas atrás" },
]

export default function AdminForumPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Fórum</h1>
          <p className="text-muted-foreground">Modere discussões e gerencie tópicos do fórum</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Tópicos Ativos</p>
          <p className="text-2xl font-bold">{mockPosts.filter(p => p.status === "active").length}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Reportados</p>
          <p className="text-2xl font-bold text-destructive">
            {mockPosts.filter(p => p.status === "flagged").length}
          </p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total de Respostas</p>
          <p className="text-2xl font-bold">
            {mockPosts.reduce((sum, p) => sum + p.responses, 0)}
          </p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Resolvidos</p>
          <p className="text-2xl font-bold text-green-600">
            {mockPosts.filter(p => p.status === "resolved").length}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar tópicos..." className="pl-10" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="Question">Dúvida</SelectItem>
            <SelectItem value="Discussion">Discussão</SelectItem>
            <SelectItem value="Bug Report">Bug</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="resolved">Resolvido</SelectItem>
            <SelectItem value="flagged">Reportado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Posts Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tópico</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Respostas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <div className="font-medium line-clamp-1">{post.title}</div>
                </TableCell>
                <TableCell>{post.author}</TableCell>
                <TableCell>
                  <Badge variant="outline">{post.type}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3 text-muted-foreground" />
                    {post.responses}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    post.status === "active" ? "default" :
                    post.status === "resolved" ? "secondary" :
                    "destructive"
                  }>
                    {post.status === "active" ? "Ativo" :
                     post.status === "resolved" ? "Resolvido" : "Reportado"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{post.date}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        Ver Tópico
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Ban className="mr-2 h-4 w-4" />
                        Trancar
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
    </div>
  )
}

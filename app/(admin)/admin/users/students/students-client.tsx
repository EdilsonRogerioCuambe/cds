"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    Ban,
    Mail,
    MoreVertical,
    Search,
    Trash2,
    UserPlus,
    Users,
    ChevronLeft,
    ChevronRight,
    Filter
} from "lucide-react"
import { useState, useMemo } from "react"

interface Student {
  id: string
  name: string | null
  email: string
  registrationNumber: string | null
  currentLevel: string | null
  status: string
  createdAt: Date
  image?: string | null
}

interface StudentsClientProps {
  students: Student[]
}

const LEVEL_COLORS: Record<string, string> = {
  A1: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  A2: "bg-green-500/10 text-green-600 border-green-500/20",
  B1: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  B2: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  C1: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  C2: "bg-red-500/10 text-red-600 border-red-500/20",
}

export function StudentsClient({ students }: StudentsClientProps) {
  const [search, setSearch] = useState("")
  const [filterLevel, setFilterLevel] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filtered = useMemo(() => {
    return students.filter(s => {
      const matchSearch = (s.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        (s.registrationNumber?.toLowerCase() || "").includes(search.toLowerCase())
      const matchLevel = filterLevel === "all" || s.currentLevel === filterLevel
      const matchStatus = filterStatus === "all" || s.status === filterStatus
      return matchSearch && matchLevel && matchStatus
    })
  }, [students, search, filterLevel, filterStatus])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black font-display text-foreground flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            Alunos
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Gerencie e monitore o progresso dos alunos da Connect.
          </p>
        </div>
        <Button className="rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Aluno
        </Button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border bg-card/50 backdrop-blur-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Total Alunos</p>
          <p className="text-2xl font-black mt-1">{students.length}</p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/50 backdrop-blur-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Ativos</p>
          <p className="text-2xl font-black mt-1 text-emerald-500">{students.filter(s => s.status === "ACTIVE").length}</p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/50 backdrop-blur-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Inativos</p>
          <p className="text-2xl font-black mt-1 text-amber-500">{students.filter(s => s.status === "INACTIVE").length}</p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/50 backdrop-blur-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Novos (30d)</p>
          <p className="text-2xl font-black mt-1 text-blue-500">
            {students.filter(s => new Date(s.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center bg-card/30 p-4 rounded-2xl border border-dashed border-primary/20">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Buscar por nome, email ou matrícula..."
            className="pl-10 h-11 bg-background/50 border-none ring-1 ring-border focus-visible:ring-primary/50 transition-all rounded-xl shadow-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <div className="flex items-center gap-1.5 bg-background/50 p-1 rounded-xl border border-border overflow-x-auto scrollbar-hide">
            <Filter className="w-3.5 h-3.5 ml-2 text-muted-foreground" />
            {["all", "A1", "A2", "B1", "B2", "C1"].map(lvl => (
               <button
                 key={lvl}
                 onClick={() => { setFilterLevel(lvl); setCurrentPage(1); }}
                 className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                   filterLevel === lvl ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "text-muted-foreground hover:bg-accent"
                 }`}
               >
                 {lvl === "all" ? "Todos Níveis" : lvl}
               </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-background/50 p-1 rounded-xl border border-border">
            {["all", "ACTIVE", "INACTIVE", "SUSPENDED"].map(status => (
               <button
                 key={status}
                 onClick={() => { setFilterStatus(status); setCurrentPage(1); }}
                 className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                   filterStatus === status ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "text-muted-foreground hover:bg-accent"
                 }`}
               >
                 {status === "all" ? "Todos Status" : status === "ACTIVE" ? "Ativo" : status === "INACTIVE" ? "Inativo" : "Suspenso"}
               </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-3xl border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
               <TableHead className="font-bold py-4 pl-6">Aluno</TableHead>
               <TableHead className="font-bold">Info</TableHead>
               <TableHead className="font-bold">Nível</TableHead>
               <TableHead className="font-bold">Cadastro</TableHead>
               <TableHead className="font-bold">Status</TableHead>
               <TableHead className="text-right pr-6 font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length > 0 ? paginated.map((student) => (
               <TableRow key={student.id} className="group hover:bg-accent/30 transition-colors">
                 <TableCell className="pl-6 py-4">
                   <div className="flex items-center gap-3">
                     <Avatar className="h-10 w-10 border-2 border-background group-hover:scale-105 transition-transform">
                       <AvatarImage src={student.image || ""} />
                       <AvatarFallback className="font-black bg-primary/10 text-primary">
                         {student.name?.charAt(0).toUpperCase() || "U"}
                       </AvatarFallback>
                     </Avatar>
                     <div className="min-w-0">
                        <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{student.name || "Sem Nome"}</p>
                        <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-tighter">{student.registrationNumber || "CDS-000000"}</p>
                     </div>
                   </div>
                 </TableCell>
                 <TableCell>
                   <p className="text-xs font-medium text-muted-foreground">{student.email}</p>
                 </TableCell>
                 <TableCell>
                   <Badge variant="outline" className={`font-black text-[10px] px-2.5 py-0.5 ${LEVEL_COLORS[student.currentLevel || "A1"] || "bg-muted text-muted-foreground"}`}>
                     {student.currentLevel || "A1"}
                   </Badge>
                 </TableCell>
                 <TableCell className="text-xs font-medium text-muted-foreground">
                   {new Date(student.createdAt).toLocaleDateString('pt-BR')}
                 </TableCell>
                 <TableCell>
                   <div className="flex items-center gap-2">
                     <span className={`w-2 h-2 rounded-full ${
                       student.status === "ACTIVE" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,215,158,0.5)]" :
                       student.status === "INACTIVE" ? "bg-amber-500" : "bg-red-500"
                     }`} />
                     <span className="text-xs font-bold uppercase tracking-widest text-foreground/70">
                       {student.status === "ACTIVE" ? "Ativo" :
                        student.status === "INACTIVE" ? "Inativo" : "Suspenso"}
                     </span>
                   </div>
                 </TableCell>
                 <TableCell className="text-right pr-6">
                   <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                       <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all">
                         <MoreVertical className="h-4 w-4" />
                       </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl">
                       <DropdownMenuItem className="rounded-lg font-bold gap-2">
                         <Mail className="h-4 w-4" /> Enviar Mensagem
                       </DropdownMenuItem>
                       <DropdownMenuItem className="rounded-lg font-bold gap-2">
                         <Ban className="h-4 w-4" /> Suspender Aluno
                       </DropdownMenuItem>
                       <DropdownMenuItem className="rounded-lg font-bold gap-2 text-destructive hover:text-destructive">
                         <Trash2 className="h-4 w-4" /> Remover Aluno
                       </DropdownMenuItem>
                     </DropdownMenuContent>
                   </DropdownMenu>
                 </TableCell>
               </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Search className="h-8 w-8 opacity-20 mb-2" />
                    <p className="font-bold">Nenhum aluno encontrado</p>
                    <p className="text-xs">Tente ajustar seus filtros de busca.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Container */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-xs font-bold text-muted-foreground">
            Mostrando <span className="text-foreground">{paginated.length}</span> de <span className="text-foreground">{filtered.length}</span> alunos
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="h-9 px-3 rounded-xl font-bold bg-card"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
            </Button>
            <div className="flex items-center gap-1 mx-2">
               {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                 <button
                   key={p}
                   onClick={() => setCurrentPage(p)}
                   className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                     currentPage === p ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                   }`}
                 >
                   {p}
                 </button>
               ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="h-9 px-3 rounded-xl font-bold bg-card"
            >
              Próximo <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

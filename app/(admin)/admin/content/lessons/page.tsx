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
import {
  Edit,
  Play,
  Plus,
  Search,
  Trash2,
  BookOpen,
  Video,
  FileCode,
  Layout,
  ExternalLink
} from "lucide-react"
import prisma from "@/lib/prisma"
import Link from "next/link"

export default async function AdminLessonsPage() {
  const lessons = await prisma.lesson.findMany({
    include: {
      module: {
        include: {
          course: true
        }
      }
    },
    orderBy: { order: "asc" }
  })

  const stats = {
    total: lessons.length,
    published: lessons.filter(l => l.published).length,
    video: lessons.filter(l => l.lessonType === "VIDEO").length,
    interactive: lessons.filter(l => l.lessonType !== "VIDEO").length,
  }

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black font-display tracking-tight text-foreground flex items-center gap-3">
            <Layout className="w-10 h-10 text-primary" />
            Gerenciar Lições
          </h1>
          <p className="text-muted-foreground mt-2 font-medium italic">
            Controle total sobre o conteúdo pedagógico de todos os cursos.
          </p>
        </div>
        <Button asChild className="rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
          <Link href="/teacher/courses">
            <Plus className="mr-2 h-4 w-4" />
            Nova Lição
          </Link>
        </Button>
      </div>

      {/* Stats - Premium Vibrant Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-card rounded-3xl border p-6 hover:shadow-xl transition-all border-l-4 border-l-primary">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total de Lições</p>
          <div className="flex items-end justify-between mt-1">
            <h3 className="text-3xl font-black">{stats.total}</h3>
            <BookOpen className="w-5 h-5 text-primary/40" />
          </div>
        </div>
        <div className="bg-card rounded-3xl border p-6 hover:shadow-xl transition-all border-l-4 border-l-emerald-500">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Publicadas</p>
          <div className="flex items-end justify-between mt-1">
            <h3 className="text-3xl font-black text-emerald-600">{stats.published}</h3>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-none font-black text-[10px]">LIVE</Badge>
          </div>
        </div>
        <div className="bg-card rounded-3xl border p-6 hover:shadow-xl transition-all border-l-4 border-l-blue-500">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Vídeos</p>
          <div className="flex items-end justify-between mt-1">
            <h3 className="text-3xl font-black text-blue-600">{stats.video}</h3>
            <Video className="w-5 h-5 text-blue-500/40" />
          </div>
        </div>
        <div className="bg-card rounded-3xl border p-6 hover:shadow-xl transition-all border-l-4 border-l-orange-500">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Interativas</p>
          <div className="flex items-end justify-between mt-1">
            <h3 className="text-3xl font-black text-orange-600">{stats.interactive}</h3>
            <FileCode className="w-5 h-5 text-orange-500/40" />
          </div>
        </div>
      </div>

      {/* Filters (Simplified for now) */}
      <div className="flex gap-4 p-4 bg-muted/30 rounded-2xl border border-dashed">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            placeholder="Buscar por título ou curso..." 
            className="w-full pl-10 h-11 bg-background border-none ring-1 ring-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all" 
          />
        </div>
      </div>

      {/* Lessons Table - Premium Design */}
      <div className="rounded-3xl border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold pl-6 py-4">Lição</TableHead>
              <TableHead className="font-bold">Curso / Módulo</TableHead>
              <TableHead className="font-bold">Tipo</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right pr-6 font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lessons.length > 0 ? lessons.map((lesson) => (
              <TableRow key={lesson.id} className="group hover:bg-accent/50 transition-colors">
                <TableCell className="pl-6 py-4">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        {lesson.lessonType === "VIDEO" ? <Video className="w-5 h-5 text-primary" /> : <FileCode className="w-5 h-5 text-primary" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{lesson.title}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">ORDEM: {lesson.order}</p>
                      </div>
                   </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold truncate max-w-[150px]">{lesson.module.course.title}</span>
                    <span className="text-[10px] text-muted-foreground italic truncate max-w-[150px]">{lesson.module.title}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-black text-[10px] uppercase tracking-wider px-2 border-primary/20 bg-primary/5 text-primary">
                    {lesson.lessonType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${lesson.published ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,215,158,0.5)]" : "bg-amber-500"}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70">
                      {lesson.published ? "Publicada" : "Rascunho"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="ghost" size="icon" className="h-9 w-9 hover:bg-primary/10 hover:text-primary rounded-xl transition-all">
                      <Link href={`/admin/courses/${lesson.module.course.id}/modules/${lesson.moduleId}/lessons/${lesson.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="py-20 text-center text-muted-foreground italic">
                  Nenhuma lição encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

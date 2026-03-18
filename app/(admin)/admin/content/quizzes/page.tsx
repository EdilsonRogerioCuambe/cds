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
  ClipboardCheck,
  Edit,
  Plus,
  Search,
  Trash2,
  BookOpen,
  Trophy,
  Users,
  Layout,
  ExternalLink
} from "lucide-react"
import prisma from "@/lib/prisma"
import Link from "next/link"

export default async function AdminQuizzesPage() {
  const quizzes = await prisma.quiz.findMany({
    include: {
      lesson: {
        include: {
          module: {
            include: {
              course: true
            }
          }
        }
      },
      attempts: true
    },
    orderBy: { id: "desc" }
  })

  const stats = {
    total: quizzes.length,
    totalQuestions: quizzes.reduce((sum, q) => {
      const qs = Array.isArray(q.questions) ? q.questions.length : 0
      return sum + qs
    }, 0),
    totalAttempts: quizzes.reduce((sum, q) => sum + q.attempts.length, 0),
    avgScore: quizzes.length > 0 ? Math.round(quizzes.reduce((sum, q) => {
      if (q.attempts.length === 0) return sum
      const avg = q.attempts.reduce((s, a) => s + a.score, 0) / q.attempts.length
      return sum + avg
    }, 0) / quizzes.filter(q => q.attempts.length > 0).length || 0) : 0
  }

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black font-display tracking-tight text-foreground flex items-center gap-3">
            <ClipboardCheck className="w-10 h-10 text-primary" />
            Gerenciar Quizzes
          </h1>
          <p className="text-muted-foreground mt-2 font-medium italic">
            Configuração e análise de desempenho das avaliações da plataforma.
          </p>
        </div>
        <Button asChild className="rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
          <Link href="/teacher/courses">
            <Plus className="mr-2 h-4 w-4" />
            Novo Quiz
          </Link>
        </Button>
      </div>

      {/* Stats - Premium Vibrant Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-card rounded-3xl border p-6 hover:shadow-xl transition-all border-l-4 border-l-primary">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total de Quizzes</p>
          <div className="flex items-end justify-between mt-1">
            <h3 className="text-3xl font-black">{stats.total}</h3>
            <Layout className="w-5 h-5 text-primary/40" />
          </div>
        </div>
        <div className="bg-card rounded-3xl border p-6 hover:shadow-xl transition-all border-l-4 border-l-blue-500">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Questões Totais</p>
          <div className="flex items-end justify-between mt-1">
            <h3 className="text-3xl font-black text-blue-600">{stats.totalQuestions}</h3>
            <ClipboardCheck className="w-5 h-5 text-blue-500/40" />
          </div>
        </div>
        <div className="bg-card rounded-3xl border p-6 hover:shadow-xl transition-all border-l-4 border-l-emerald-500">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Tentativas</p>
          <div className="flex items-end justify-between mt-1">
            <h3 className="text-3xl font-black text-emerald-600">{stats.totalAttempts}</h3>
            <Users className="w-5 h-5 text-emerald-500/40" />
          </div>
        </div>
        <div className="bg-card rounded-3xl border p-6 hover:shadow-xl transition-all border-l-4 border-l-orange-500">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Média Global</p>
          <div className="flex items-end justify-between mt-1">
            <h3 className="text-3xl font-black text-orange-600">{stats.avgScore}%</h3>
            <Trophy className="w-5 h-5 text-orange-500/40" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-3xl border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold pl-6 py-4">Quiz / Lição</TableHead>
              <TableHead className="font-bold">Curso</TableHead>
              <TableHead className="font-bold text-center">Questões</TableHead>
              <TableHead className="font-bold text-center">Média</TableHead>
              <TableHead className="font-bold text-center">Completos</TableHead>
              <TableHead className="text-right pr-6 font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quizzes.length > 0 ? quizzes.map((quiz) => {
              const quizAvg = quiz.attempts.length > 0 
                ? Math.round(quiz.attempts.reduce((s, a) => s + a.score, 0) / quiz.attempts.length) 
                : 0
              const questionCount = Array.isArray(quiz.questions) ? quiz.questions.length : 0

              return (
                <TableRow key={quiz.id} className="group hover:bg-accent/50 transition-colors">
                  <TableCell className="pl-6 py-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <ClipboardCheck className="w-5 h-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{quiz.title}</p>
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter truncate">
                            {quiz.lesson?.title || "Standalone"}
                          </p>
                        </div>
                     </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-bold">{quiz.lesson?.module.course.title || "---"}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-black text-[10px]">{questionCount}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`text-sm font-black ${quizAvg >= 70 ? "text-emerald-600" : quizAvg > 0 ? "text-orange-600" : "text-muted-foreground"}`}>
                      {quizAvg > 0 ? `${quizAvg}%` : "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm font-bold">{quiz.attempts.length}</span>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-2">
                       <Button asChild variant="ghost" size="icon" className="h-9 w-9 hover:bg-primary/10 hover:text-primary rounded-xl transition-all">
                         <Link href={`/admin/courses/${quiz.lesson?.module.course.id}/modules/${quiz.lesson?.moduleId}/lessons/${quiz.lesson?.id}/edit?tab=quizzes`}>
                           <Edit className="h-4 w-4" />
                         </Link>
                       </Button>
                       <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:bg-red-50 rounded-xl transition-all">
                         <Trash2 className="h-4 w-4" />
                       </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            }) : (
              <TableRow>
                <TableCell colSpan={6} className="py-20 text-center text-muted-foreground italic">
                  Nenhum quiz encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

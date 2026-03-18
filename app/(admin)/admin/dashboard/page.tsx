import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import prisma from "@/lib/prisma"
import {
    Activity,
    BookOpen,
    GraduationCap,
    LayoutDashboard,
    Plus,
    TrendingUp,
    Users,
    Users2
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default async function AdminDashboardPage() {
  // Fetch real stats
  const [
    studentCount,
    teacherCount,
    courseCount,
    lessonCount,
    recentEnrollments,
    recentUsers
  ] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "TEACHER" } }),
    prisma.course.count(),
    prisma.lesson.count(),
    prisma.enrollment.findMany({
      take: 5,
      orderBy: { startDate: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } }
      }
    }),
    prisma.user.findMany({
      take: 5,
      where: { role: { in: ["STUDENT", "TEACHER"] } },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    })
  ])

  return (
    <div className="space-y-10 pb-10">
      {/* Header section with glassmorphism feel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black font-display tracking-tight text-foreground flex items-center gap-3">
            <LayoutDashboard className="w-10 h-10 text-primary" />
            Painel Admin
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Bem-vindo de volta! Aqui está o resumo atual da <span className="text-primary font-bold">Connect Digital School</span>.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="rounded-xl font-bold">
            <Link href="/admin/users/teachers">
              <Users2 className="w-4 h-4 mr-2" />
              Ver Equipe
            </Link>
          </Button>
          <Button asChild className="rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
            <Link href="/teacher/courses/new">
              <Plus className="w-4 h-4 mr-2" />
              Novo Curso
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Stats with vibrant cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group relative overflow-hidden rounded-3xl border bg-card p-6 transition-all hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 duration-500">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 transition-all group-hover:scale-150 duration-700" />
          <div className="relative z-10 space-y-4">
            <div className="p-3 bg-primary/10 rounded-2xl w-fit">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Alunos Ativos</p>
              <h3 className="text-4xl font-black mt-1 text-foreground">{studentCount.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-3xl border bg-card p-6 transition-all hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 duration-500">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-8 -mt-8 transition-all group-hover:scale-150 duration-700" />
          <div className="relative z-10 space-y-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl w-fit">
              <GraduationCap className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Professores</p>
              <h3 className="text-4xl font-black mt-1 text-foreground">{teacherCount.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-3xl border bg-card p-6 transition-all hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 duration-500">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8 transition-all group-hover:scale-150 duration-700" />
          <div className="relative z-10 space-y-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl w-fit">
              <BookOpen className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Cursos</p>
              <h3 className="text-4xl font-black mt-1 text-foreground">{courseCount.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-3xl border bg-card p-6 transition-all hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1 duration-500">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -mr-8 -mt-8 transition-all group-hover:scale-150 duration-700" />
          <div className="relative z-10 space-y-4">
            <div className="p-3 bg-orange-500/10 rounded-2xl w-fit">
              <Activity className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total de Aulas</p>
              <h3 className="text-4xl font-black mt-1 text-foreground">{lessonCount.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-10">
        {/* Recent Enrollments */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
             <h2 className="text-2xl font-black font-display text-foreground flex items-center gap-2">
               <TrendingUp className="w-6 h-6 text-primary" />
               Matrículas Recentes
             </h2>
             <Button variant="ghost" asChild className="text-sm font-bold">
               <Link href="/admin/analytics">Ver tudo</Link>
             </Button>
          </div>

          <div className="rounded-3xl border bg-card overflow-hidden shadow-sm">
            <div className="divide-y">
              {recentEnrollments.length > 0 ? recentEnrollments.map((enr) => (
                <div key={enr.id} className="p-5 flex items-center gap-4 hover:bg-accent/50 transition-colors group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary group-hover:scale-110 transition-transform">
                    {enr.user.name?.charAt(0).toUpperCase() || "A"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground truncate ">{enr.user.name}</p>
                    <p className="text-xs text-muted-foreground truncate italic">Matriculou-se em: <span className="text-foreground font-semibold">{enr.course.title}</span></p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-muted-foreground">
                      {new Date(enr.startDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </p>
                    <Badge variant="outline" className="mt-1 text-[10px] font-black uppercase tracking-wider">ATIVO</Badge>
                  </div>
                </div>
              )) : (
                <div className="p-10 text-center text-muted-foreground">Nenhuma matrícula recente.</div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links / Navigation */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black font-display text-foreground px-2">Gestão Rápida</h2>
          <div className="grid grid-cols-1 gap-3">
             {[
               { icon: Users, label: "Alunos", href: "/admin/users/students", color: "text-primary", bg: "bg-primary/10" },
               { icon: GraduationCap, label: "Professores", href: "/admin/users/teachers", color: "text-blue-500", bg: "bg-blue-500/10" },
               { icon: BookOpen, label: "Conteúdo", href: "/admin/courses", color: "text-emerald-500", bg: "bg-emerald-500/10" },
               { icon: Activity, label: "Analíticos", href: "/admin/analytics", color: "text-orange-500", bg: "bg-orange-500/10" },
             ].map((link, i) => (
               <Link key={i} href={link.href} className="group p-4 flex items-center gap-4 rounded-2xl border bg-card hover:border-primary/50 transition-all hover:shadow-lg">
                 <div className={`p-3 rounded-xl ${link.bg} ${link.color} group-hover:scale-110 transition-transform`}>
                   <link.icon className="w-5 h-5" />
                 </div>
                 <span className="font-bold text-foreground">{link.label}</span>
               </Link>
             ))}
          </div>

          {/* New Registrations */}
          <div className="mt-10 space-y-4">
             <h3 className="text-lg font-black font-display text-muted-foreground px-2 uppercase tracking-widest">Novos Utilizadores</h3>
             <div className="space-y-2">
                {recentUsers.map(user => (
                  <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-border hover:bg-card transition-all">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                      {user.name?.charAt(0) || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{user.name}</p>
                      <Badge variant="outline" className="text-[9px] h-4 font-black uppercase">{user.role}</Badge>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

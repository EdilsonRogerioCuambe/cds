import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Clock,
  Target,
  TrendingUp,
  Users,
  BarChart3,
  PieChart,
  Activity,
  Award
} from "lucide-react"
import prisma from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"

export default async function AdminAnalyticsPage() {
  // Fetch real analytics data
  const [
    totalStudents,
    totalCourses,
    levelDistribution,
    popularCourses,
    recentActivityCount
  ] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.course.count(),
    prisma.user.groupBy({
      by: ['currentLevel'],
      where: { role: "STUDENT" },
      _count: { _all: true }
    }),
    prisma.course.findMany({
      select: {
        id: true,
        title: true,
        _count: {
          select: { enrollments: true }
        }
      },
      orderBy: {
        enrollments: { _count: 'desc' }
      },
      take: 5
    }),
    prisma.enrollment.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    })
  ])

  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"]
  const levelStats = levels.map(label => {
    const found = levelDistribution.find(d => d.currentLevel === label)
    return {
      label,
      count: found?._count._all || 0
    }
  })

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black font-display tracking-tight text-foreground flex items-center gap-3">
            <BarChart3 className="w-10 h-10 text-primary" />
            Analytics
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Métricas detalhadas de desempenho e crescimento da plataforma.
          </p>
        </div>
      </div>

      {/* High-Level Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="group relative overflow-hidden rounded-3xl border bg-card p-6 transition-all hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 duration-500">
           <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 transition-all group-hover:scale-150 duration-700" />
           <div className="relative z-10 space-y-4">
             <div className="p-3 bg-primary/10 rounded-2xl w-fit">
               <TrendingUp className="w-6 h-6 text-primary" />
             </div>
             <div>
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Matrículas (30d)</p>
               <h3 className="text-3xl font-black mt-1 text-foreground">+{recentActivityCount}</h3>
             </div>
           </div>
        </div>

        <div className="group relative overflow-hidden rounded-3xl border bg-card p-6 transition-all hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 duration-500">
           <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-8 -mt-8 transition-all group-hover:scale-150 duration-700" />
           <div className="relative z-10 space-y-4">
             <div className="p-3 bg-blue-500/10 rounded-2xl w-fit">
               <Target className="w-6 h-6 text-blue-500" />
             </div>
             <div>
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Alunos Totais</p>
               <h3 className="text-3xl font-black mt-1 text-foreground">{totalStudents}</h3>
             </div>
           </div>
        </div>

        <div className="group relative overflow-hidden rounded-3xl border bg-card p-6 transition-all hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 duration-500">
           <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8 transition-all group-hover:scale-150 duration-700" />
           <div className="relative z-10 space-y-4">
             <div className="p-3 bg-emerald-500/10 rounded-2xl w-fit">
               <Award className="w-6 h-6 text-emerald-500" />
             </div>
             <div>
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Cursos Ativos</p>
               <h3 className="text-3xl font-black mt-1 text-foreground">{totalCourses}</h3>
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
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Taxa de Conversão</p>
               <h3 className="text-3xl font-black mt-1 text-foreground">84%</h3>
             </div>
           </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Course Popularity */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black font-display text-foreground px-2 flex items-center gap-2">
            <PieChart className="w-6 h-6 text-blue-500" />
            Cursos Populares
          </h2>
          <div className="rounded-3xl border bg-card p-6 shadow-sm space-y-4">
            {popularCourses.map((course, idx) => {
               const percentage = totalStudents > 0 ? (course._count.enrollments / totalStudents) * 100 : 0
               return (
                 <div key={course.id} className="space-y-2">
                   <div className="flex justify-between items-end">
                     <p className="text-sm font-bold truncate pr-4">{course.title}</p>
                     <p className="text-xs font-black text-primary whitespace-nowrap">{course._count.enrollments} Alunos</p>
                   </div>
                   <div className="h-2 bg-muted rounded-full overflow-hidden">
                     <div
                       className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-1000"
                       style={{ width: `${percentage}%` }}
                     />
                   </div>
                 </div>
               )
            })}
          </div>
        </div>

        {/* Level Distribution */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black font-display text-foreground px-2 flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-500" />
            Distribuição por Nível
          </h2>
          <div className="rounded-3xl border bg-card p-6 shadow-sm space-y-5">
            {levelStats.map((stat) => {
               const percentage = totalStudents > 0 ? (stat.count / totalStudents) * 100 : 0
               return (
                 <div key={stat.label} className="flex items-center gap-4">
                   <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-black">{stat.label}</div>
                   <div className="flex-1 space-y-1">
                     <div className="h-6 bg-muted rounded-lg overflow-hidden relative">
                        <div
                          className="h-full bg-primary/20 rounded-lg transition-all duration-1000"
                          style={{ width: `${percentage}%` }}
                        />
                        <span className="absolute inset-y-0 left-3 flex items-center text-[10px] font-bold text-foreground/70 tracking-tight">
                          {stat.count} alunos
                        </span>
                     </div>
                   </div>
                   <div className="w-12 text-right text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                     {Math.round(percentage)}%
                   </div>
                 </div>
               )
            })}
          </div>
        </div>
      </div>

      {/* Empty States / Placeholder for real charts if needed */}
      <div className="rounded-3xl border bg-card/30 p-12 text-center border-dashed border-primary/20">
         <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
               <TrendingUp className="w-8 h-8 text-primary opacity-50" />
            </div>
            <h3 className="text-xl font-black font-display">Mais métricas em breve</h3>
            <p className="text-sm text-muted-foreground font-medium">
              Estamos a preparar gráficos avançados de retenção e tempo médio de estudo para dar-te uma visão ainda mais profunda.
            </p>
         </div>
      </div>
    </div>
  )
}

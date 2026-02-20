"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
    Award,
    BookOpen,
    CheckCircle,
    Target,
    TrendingUp,
    Users,
    Zap,
} from "lucide-react"
import {
    Bar,
    BarChart,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

type AnalyticsData = {
  stats: {
    activeStudents: number
    completionRate: number
    avgScore: number
    forumPosts: number
    newEnrollments: number
    lessonsCreated: number
  }
  distribution: { level: string; students: number; color: string }[]
  performance: { month: string; avgScore: number; completionRate: number }[]
  topStudents: { name: string; level: string; score: number; lessons: number; avatar: string }[]
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix = "",
  color,
}: {
  icon: React.ElementType
  label: string
  value: number
  suffix?: string
  color: string
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest font-black text-muted-foreground/60 mb-2">
              {label}
            </p>
            <p className={cn("text-4xl font-black", color)}>
              {value.toLocaleString()}{suffix}
            </p>
          </div>
          <div className={cn("p-3 rounded-2xl", color.replace("text-", "bg-").replace("-500", "-500/10"))}>
            <Icon className={cn("w-6 h-6", color)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const levelColors: Record<string, string> = {
  A1: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  A2: "bg-green-500/10 text-green-600 border-green-500/30",
  B1: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  B2: "bg-indigo-500/10 text-indigo-600 border-indigo-500/30",
  C1: "bg-purple-500/10 text-purple-600 border-purple-500/30",
  C2: "bg-amber-500/10 text-amber-600 border-amber-500/30",
}

export function TeacherAnalyticsDashboard({ data }: { data: AnalyticsData }) {
  const { stats, distribution, performance, topStudents } = data

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black font-display text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Métricas e desempenho dos seus cursos e alunos
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <StatCard icon={Users} label="Alunos Ativos" value={stats.activeStudents} color="text-blue-500" />
        <StatCard icon={CheckCircle} label="Taxa de Conclusão" value={stats.completionRate} suffix="%" color="text-emerald-500" />
        <StatCard icon={Target} label="Média de Score" value={stats.avgScore} suffix="%" color="text-primary" />
        <StatCard icon={TrendingUp} label="Novas Inscrições" value={stats.newEnrollments} color="text-violet-500" />
        <StatCard icon={BookOpen} label="Lições Criadas" value={stats.lessonsCreated} color="text-orange-500" />
        <StatCard icon={Award} label="Certificados" value={0} color="text-amber-500" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Performance trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-black">Tendência de Desempenho (6 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={performance}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value}%`,
                    name === "avgScore" ? "Média de Score" : "Taxa de Conclusão"
                  ]}
                  contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }}
                />
                <Line
                  type="monotone"
                  dataKey="avgScore"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "hsl(var(--primary))" }}
                  name="avgScore"
                />
                <Line
                  type="monotone"
                  dataKey="completionRate"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2.5}
                  strokeDasharray="5 5"
                  dot={{ r: 4, fill: "hsl(var(--chart-2))" }}
                  name="completionRate"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Level Distribution Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-black">Distribuição de Níveis</CardTitle>
          </CardHeader>
          <CardContent>
            {distribution.every((d) => d.students === 0) ? (
              <div className="h-[240px] flex items-center justify-center text-muted-foreground text-sm">
                Sem dados ainda
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={distribution.filter((d) => d.students > 0)}
                      dataKey="students"
                      nameKey="level"
                      innerRadius={40}
                      outerRadius={70}
                      cx="50%"
                      cy="50%"
                    >
                      {distribution.filter((d) => d.students > 0).map((entry) => (
                        <Cell key={entry.level} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value} alunos`]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-1.5 mt-2">
                  {distribution.filter((d) => d.students > 0).map((d) => (
                    <div key={d.level} className="flex items-center gap-1.5 text-xs">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                      <span className="text-muted-foreground">{d.level}</span>
                      <span className="font-bold ml-auto">{d.students}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quiz Score by Month Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-black">Pontuação Média por Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={performance} barSize={36}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(v: number) => [`${v}%`, "Média de Score"]}
                contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }}
              />
              <Bar dataKey="avgScore" radius={[8, 8, 0, 0]}>
                {performance.map((_, i) => (
                  <Cell
                    key={i}
                    fill={`hsl(var(--primary) / ${0.4 + (i / performance.length) * 0.6})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Students */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-black">Top Alunos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topStudents.map((student, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-sm font-black text-muted-foreground">
                  {i + 1}
                </div>
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-black text-primary">
                  {student.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold truncate">{student.name}</span>
                    {student.level !== "N/A" && (
                      <Badge variant="outline" className={cn("text-xs font-bold", levelColors[student.level])}>
                        {student.level}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <Progress value={student.score} className="h-1.5 flex-1" />
                    <span className="text-xs font-bold text-muted-foreground w-10 text-right">
                      {student.score}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Zap className="w-3 h-3 text-primary" />
                  {student.lessons} quiz
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

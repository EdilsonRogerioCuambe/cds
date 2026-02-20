"use client"

import SplashScreen from "@/components/splash-screen"
import React, { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
    Badge as BadgeType,
    Course,
    StudentStats
} from "@/lib/data"
import { formatDuration } from "@/lib/utils"
import { User } from "@/types/user"
import {
    Award,
    BookOpen,
    ChevronRight,
    ClipboardCheck,
    Clock,
    Flame,
    Lock,
    MessageSquare,
    Play,
    Target,
    TrendingUp,
    Zap,
} from "lucide-react"
import Link from "next/link"
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

interface StudentDashboardProps {
  user: User
  stats: StudentStats
  badges: BadgeType[]
  recentActivity: any[]
  weeklyProgress: any[]
  allCourses: Course[]
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  sub?: string
  color: string
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className="flex items-center justify-center w-11 h-11 rounded-xl"
          style={{ backgroundColor: color + "18", color }}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold font-display text-foreground">
            {value}
          </p>
          {sub && (
            <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityIcon({ type }: { type: string }) {
  switch (type) {
    case "lesson":
      return <Play className="w-4 h-4" />
    case "quiz":
      return <ClipboardCheck className="w-4 h-4" />
    case "forum":
      return <MessageSquare className="w-4 h-4" />
    default:
      return <BookOpen className="w-4 h-4" />
  }
}

export function StudentDashboard({
  user,
  stats,
  badges,
  recentActivity,
  weeklyProgress,
  allCourses
}: StudentDashboardProps) {
  const progressPercent = Math.round(
    (stats.lessonsCompleted / stats.totalLessons) * 100
  )
  const xpPercent = Math.round(
    (stats.xp / stats.xpToNext) * 100
  )
  const [isLoading, setIsLoading] = useState(true)

  if (isLoading) {
    return <SplashScreen onComplete={() => setIsLoading(false)} />
  }
  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground text-balance">
          Bem-vindo de volta, {user.name?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground mt-1">
          Você está em uma sequência de {stats.streak} dias. Continue assim!
        </p>
      </div>

      {/* Level & XP Banner */}
      <Card className="mb-6 border-primary/20 bg-primary/[0.03] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        <CardContent className="p-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground font-display text-2xl font-bold shadow-lg shadow-primary/20 shrink-0">
                {stats.currentLevel}
              </div>
              <div>
                <p className="font-bold text-lg text-foreground tracking-tight">
                  Nível {stats.currentLevel}
                </p>
                <p className="text-sm text-muted-foreground">
                  {stats.xp} / {stats.xpToNext} XP
                </p>
              </div>
            </div>
            <div className="flex-1 w-full max-w-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-primary">Progresso do Nível</span>
                <span className="text-xs text-muted-foreground">
                  Faltam {stats.xpToNext - stats.xp} XP
                </span>
              </div>
              <Progress value={xpPercent} className="h-2.5" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Flame}
          label="Sequência"
          value={stats.streak}
          color="hsl(var(--primary))"
        />
        <StatCard
          icon={Target}
          label="Média Quiz"
          value={`${stats.quizAvgScore}%`}
          color="hsl(var(--primary))"
        />
        <StatCard
          icon={Clock}
          label="Horas Aprendidas"
          value={formatDuration(stats.hoursLearned)}
          color="hsl(var(--primary))"
        />
        <StatCard
          icon={BookOpen}
          label="Palavras Aprendidas"
          value={stats.wordsLearned}
          color="hsl(var(--primary))"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Weekly Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold font-display flex items-center gap-2 text-foreground">
              <TrendingUp className="w-4 h-4 text-primary" />
              Tempo de Estudo Semanal
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyProgress}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                    fontSize: "13px",
                  }}
                  formatter={(value: number) => [`${value} min`, "Tempo de Estudo"]}
                />
                <Bar
                  dataKey="minutes"
                  fill="hsl(var(--primary))"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Course Progress */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold font-display text-foreground">
              Progresso do Curso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    strokeWidth="10"
                    fill="none"
                    stroke="hsl(var(--muted))"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    strokeWidth="10"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeDasharray={`${progressPercent * 3.52} ${(100 - progressPercent) * 3.52}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold font-display text-foreground text-center">
                    {progressPercent}%
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Concluído
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="text-center text-sm text-muted-foreground">
                {stats.lessonsCompleted} de {stats.totalLessons}{" "}
                lições
              </div>
              <Button asChild className="w-full" size="sm">
                <Link href="/courses">Continuar Aprendendo</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold font-display text-foreground">
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {recentActivity.map((item) => (
                <Link
                  key={item.id}
                  href={item.url || "#"}
                  className={`flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors ${!item.url || item.url === '#' ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted text-muted-foreground shrink-0">
                    <ActivityIcon type={item.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-xs font-medium shrink-0"
                  >
                    <Zap className="w-3 h-3 mr-1" />+{item.xp} XP
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold font-display text-foreground">
                Conquistas
              </CardTitle>
              <span className="text-xs text-muted-foreground">
                {badges.filter((b) => b.earned).length}/{badges.length}{" "}
                ganhas
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                    badge.earned
                      ? "border-primary/20 bg-primary/[0.03]"
                      : "border-border bg-muted/30 opacity-60"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${
                      badge.earned
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {badge.earned ? (
                      <Award className="w-5 h-5" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {badge.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {badge.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Next (Unenrolled Courses) */}
      <Card className="mt-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold font-display text-foreground">
            Cursos Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {allCourses
              .filter(c => !c.isEnrolled)
              .slice(0, 3)
              .map((rec) => (
                <Link
                  key={rec.id}
                  href="/student/courses"
                  className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/[0.02] transition-all group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-xs font-bold shrink-0">
                    {rec.level}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {rec.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {rec.level} &middot; {rec.totalLessons} lições
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </Link>
              ))}
            {allCourses.filter(c => !c.isEnrolled).length === 0 && (
              <p className="col-span-1 sm:col-span-3 text-center text-sm text-muted-foreground py-4 italic">
                Você já está inscrito em todos os cursos disponíveis!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import SplashScreen from "@/components/splash-screen"
import React, { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    XAxis
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
    <Card className="group hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 overflow-hidden relative">
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500"
        style={{ background: `linear-gradient(135deg, ${color}, transparent)` }}
      />
      <CardContent className="flex items-center gap-3 p-3 lg:p-4 relative z-10">
        <div
          className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-inner shrink-0"
          style={{ backgroundColor: color + "18", color }}
        >
          <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] lg:text-[11px] font-bold text-muted-foreground uppercase tracking-wider truncate">{label}</p>
          <p className="text-lg lg:text-xl font-bold font-display text-foreground leading-tight mt-0.5">
            {value}
          </p>
          {sub && (
            <p className="text-[9px] lg:text-[10px] text-muted-foreground mt-0.5 truncate">{sub}</p>
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
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 lg:space-y-8 overflow-x-hidden">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold font-display text-foreground text-balance">
          Bem-vindo de volta, {user.name?.split(" ")[0]}
        </h1>
        <p className="text-sm lg:text-base text-muted-foreground mt-1">
          Você está em uma sequência de {stats.streak} dias. Continue assim!
        </p>
      </div>

      {/* Level & XP Banner */}
      <Card className="border-primary/20 bg-[#132747] overflow-hidden relative group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-[100px] opacity-50 group-hover:opacity-70 transition-opacity" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#10D79E]/10 rounded-full -ml-24 -mb-24 blur-[80px] opacity-30" />
        <CardContent className="p-5 lg:p-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-6 lg:gap-8">
            <div className="flex items-center gap-4 lg:gap-6 flex-1">
              <div className="flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-primary text-primary-foreground font-display text-2xl lg:text-3xl font-extrabold shadow-[0_0_30px_rgba(16,215,158,0.3)] shrink-0 animate-pulse-subtle group-hover:scale-105 transition-transform duration-500">
                {stats.currentLevel}
              </div>
              <div className="space-y-1">
                <p className="font-display text-lg lg:text-2xl font-bold text-white tracking-tight">
                  Nível <span className="text-primary">{stats.currentLevel}</span> Explorer
                </p>
                <div className="flex items-center gap-2">
                   <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-md border border-white/5">
                      <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-[10px] lg:text-xs font-bold text-white/90">{stats.xp} XP</span>
                   </div>
                   <span className="text-[10px] lg:text-xs text-white/40 font-medium">/ {stats.xpToNext} XP total</span>
                </div>
              </div>
            </div>
            <div className="w-full md:max-w-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary/80 uppercase tracking-tighter">Progresso de Evolução</span>
                <span className="text-[10px] lg:text-xs text-white/60 font-medium">
                  {xpPercent}% Concluído
                </span>
              </div>
              <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-primary to-[#10D79E] rounded-full shadow-[0_0_10px_rgba(16,215,158,0.5)] transition-all duration-1000"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-white/40 text-right font-medium italic">Faltam {stats.xpToNext - stats.xp} XP para subir de nível</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard
          icon={Flame}
          label="Sequência"
          value={stats.streak}
          sub="dias seguidos"
          color="#f97316"
        />
        <StatCard
          icon={Target}
          label="Lições"
          value={stats.lessonsCompleted}
          sub={`de ${stats.totalLessons} total`}
          color="#8b5cf6"
        />
        <StatCard
          icon={TrendingUp}
          label="Média Quiz"
          value={`${stats.quizAvgScore}%`}
          sub="últimos 7 dias"
          color="#06b6d4"
        />
        <StatCard
          icon={Clock}
          label="Horas"
          value={formatDuration(stats.hoursLearned)}
          sub="tempo de estudo"
          color="#ec4899"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Weekly Chart */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader className="pb-2 p-4 lg:p-6">
            <CardTitle className="text-sm lg:text-base font-semibold font-display flex items-center gap-2 text-foreground">
              <TrendingUp className="w-4 h-4 text-primary" />
              Tempo de Estudo Semanal
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4 px-2 lg:px-6">
            <div className="h-[200px] lg:h-[220px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyProgress}>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [`${value} min`, "Tempo"]}
                  />
                  <Bar
                    dataKey="minutes"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Course Progress */}
        <Card className="border-border/50">
          <CardHeader className="pb-2 p-4 lg:p-6">
            <CardTitle className="text-sm lg:text-base font-semibold font-display text-foreground">
              Progresso do Curso
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-28 h-28 lg:w-32 lg:h-32">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
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
                  <span className="text-xl lg:text-2xl font-bold font-display text-foreground text-center">
                    {progressPercent}%
                  </span>
                  <span className="text-[8px] lg:text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Concluído
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="text-center text-xs lg:text-sm text-muted-foreground">
                {stats.lessonsCompleted} de {stats.totalLessons}{" "}
                lições
              </div>
              <Button asChild className="w-full h-10 lg:h-11" size="sm">
                <Link href="/student/courses">Continuar</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-border/50">
          <CardHeader className="pb-2 p-4 lg:p-6">
            <CardTitle className="text-sm lg:text-base font-semibold font-display text-foreground flex items-center gap-2">
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 lg:p-4">
            <div className="space-y-1">
              {recentActivity.map((item) => (
                <Link
                  key={item.id}
                  href={item.url || "#"}
                  className={`flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/50 transition-colors ${!item.url || item.url === '#' ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-center w-7 h-7 rounded-md bg-muted text-muted-foreground shrink-0">
                    <ActivityIcon type={item.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-foreground truncate">
                      {item.title}
                    </p>
                    <p className="text-[9px] text-muted-foreground">{item.time}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-[9px] h-4.5 px-1.5 font-bold shrink-0 bg-primary/5 text-primary border-primary/10"
                  >
                    +{item.xp} XP
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card className="border-border/50">
          <CardHeader className="pb-2 p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm lg:text-base font-semibold font-display text-foreground">
                Conquistas
              </CardTitle>
              <span className="text-[10px] text-muted-foreground">
                {badges.filter((b) => b.earned).length}/{badges.length}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-2 lg:p-4">
            <div className="grid grid-cols-2 gap-2">
              {badges.slice(0, 4).map((badge) => (
                <div
                  key={badge.id}
                  className={`flex flex-col items-center text-center p-2 rounded-lg border transition-all ${
                    badge.earned
                      ? "border-primary/20 bg-primary/[0.03]"
                      : "border-border bg-muted/30 opacity-40 grayscale"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-lg mb-1.5 ${
                      badge.earned
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {badge.earned ? (
                      <Award className="w-4 h-4" />
                    ) : (
                      <Lock className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <p className="text-[10px] font-bold text-foreground truncate w-full">
                    {badge.name}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Next (Unenrolled Courses) */}
      <Card>
        <CardHeader className="pb-2 p-4 lg:p-6">
          <CardTitle className="text-sm lg:text-base font-semibold font-display text-foreground">
            Cursos Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 lg:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
            {allCourses
              .filter(c => !c.isEnrolled)
              .slice(0, 3)
              .map((rec) => (
                <Link
                  key={rec.id}
                  href="/student/courses"
                  className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/[0.02] transition-all group"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-[10px] font-bold shrink-0">
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
              <p className="col-span-1 md:col-span-3 text-center text-sm text-muted-foreground py-4 italic">
                Você já está inscrito em todos os cursos disponíveis!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

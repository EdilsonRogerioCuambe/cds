"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Award, Flame, GraduationCap, Star, Trophy, Zap } from "lucide-react"

type LeaderboardEntry = {
  rank: number
  id: string
  name: string
  image?: string | null
  xp: number
  currentLevel: string
  streak: number
  lessonsCompleted: number
  achievements: number
  isCurrentUser?: boolean
}

const levelColors: Record<string, string> = {
  A1: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  A2: "bg-green-500/10 text-green-600 border-green-500/30",
  B1: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  B2: "bg-indigo-500/10 text-indigo-600 border-indigo-500/30",
  C1: "bg-purple-500/10 text-purple-600 border-purple-500/30",
  C2: "bg-amber-500/10 text-amber-600 border-amber-500/30",
}

const rankColors = [
  "from-yellow-400 to-amber-500 text-white shadow-amber-500/30",
  "from-slate-300 to-slate-400 text-white shadow-slate-400/30",
  "from-amber-600 to-amber-700 text-white shadow-amber-700/30",
]

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    return (
      <div
        className={cn(
          "w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg bg-gradient-to-br shadow-lg",
          rankColors[rank - 1]
        )}
      >
        {rank === 1 ? <Trophy className="w-5 h-5" /> : rank}
      </div>
    )
  }
  return (
    <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg bg-muted text-muted-foreground">
      {rank}
    </div>
  )
}

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  const initials = entry.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-2xl transition-all",
        entry.isCurrentUser
          ? "bg-primary/5 border border-primary/20"
          : "hover:bg-muted/40"
      )}
    >
      <RankBadge rank={entry.rank} />

      {/* Avatar */}
      <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-base font-black text-primary flex-shrink-0">
        {initials}
      </div>

      {/* Name & level */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn("font-bold text-base", entry.isCurrentUser && "text-primary")}>
            {entry.name}
          </span>
          {entry.isCurrentUser && (
            <Badge className="text-xs bg-primary/10 text-primary border-primary/20">Você</Badge>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <Badge variant="outline" className={cn("text-xs font-bold", levelColors[entry.currentLevel])}>
            {entry.currentLevel}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Flame className="w-3 h-3 text-orange-500" /> {entry.streak} dias
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <GraduationCap className="w-3 h-3 text-blue-500" /> {entry.lessonsCompleted} lições
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Award className="w-3 h-3 text-purple-500" /> {entry.achievements} badges
          </span>
        </div>
      </div>

      {/* XP */}
      <div className="text-right flex-shrink-0">
        <div className="flex items-center gap-1 text-primary font-black text-lg">
          <Zap className="w-4 h-4" />
          {entry.xp.toLocaleString()}
        </div>
        <span className="text-xs text-muted-foreground font-medium">XP</span>
      </div>
    </div>
  )
}

export function Leaderboard({
  entries,
  currentUserId,
}: {
  entries: LeaderboardEntry[]
  currentUserId?: string
}) {
  const enriched = entries.map((e) => ({ ...e, isCurrentUser: e.id === currentUserId }))
  const top3 = enriched.slice(0, 3)
  const rest = enriched.slice(3)

  return (
    <div className="max-w-3xl mx-auto p-4 lg:p-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-amber-500/10 mb-4">
          <Trophy className="w-8 h-8 text-amber-500" />
        </div>
        <h1 className="text-4xl font-black font-display">Ranking da Turma</h1>
        <p className="text-muted-foreground mt-2 text-lg">Top alunos por XP acumulado</p>
      </div>

      {/* Podium for top 3 */}
      {top3.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-8">
          {/* 2nd */}
          {top3[1] ? (
            <div className="flex flex-col items-center gap-2 pt-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-300/20 flex items-center justify-center text-2xl font-black text-slate-400">
                {top3[1].name.slice(0, 2).toUpperCase()}
              </div>
              <span className="font-bold text-sm text-center line-clamp-1">{top3[1].name}</span>
              <div className="flex items-center gap-0.5 text-slate-500 font-black text-sm">
                <Zap className="w-3 h-3" /> {top3[1].xp.toLocaleString()}
              </div>
              <div className="w-full h-20 bg-slate-200/50 rounded-t-2xl flex items-center justify-center text-3xl font-black text-slate-400">2</div>
            </div>
          ) : <div />}

          {/* 1st */}
          {top3[0] && (
            <div className="flex flex-col items-center gap-2">
              <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
              <div className="w-16 h-16 rounded-2xl bg-amber-400/20 flex items-center justify-center text-3xl font-black text-amber-500 ring-2 ring-amber-400 shadow-lg shadow-amber-400/30">
                {top3[0].name.slice(0, 2).toUpperCase()}
              </div>
              <span className="font-bold text-sm text-center line-clamp-1">{top3[0].name}</span>
              <div className="flex items-center gap-0.5 text-amber-500 font-black text-sm">
                <Zap className="w-3 h-3" /> {top3[0].xp.toLocaleString()}
              </div>
              <div className="w-full h-28 bg-amber-400/20 rounded-t-2xl flex items-center justify-center text-3xl font-black text-amber-500">1</div>
            </div>
          )}

          {/* 3rd */}
          {top3[2] ? (
            <div className="flex flex-col items-center gap-2 pt-10">
              <div className="w-14 h-14 rounded-2xl bg-amber-700/10 flex items-center justify-center text-2xl font-black text-amber-700">
                {top3[2].name.slice(0, 2).toUpperCase()}
              </div>
              <span className="font-bold text-sm text-center line-clamp-1">{top3[2].name}</span>
              <div className="flex items-center gap-0.5 text-amber-700 font-black text-sm">
                <Zap className="w-3 h-3" /> {top3[2].xp.toLocaleString()}
              </div>
              <div className="w-full h-14 bg-amber-700/10 rounded-t-2xl flex items-center justify-center text-3xl font-black text-amber-700">3</div>
            </div>
          ) : <div />}
        </div>
      )}

      {/* Full list */}
      <Card>
        <CardContent className="p-4 space-y-1">
          {enriched.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-bold">Ainda não há dados de ranking</p>
              <p className="text-sm mt-1">Complete lições para aparecer no ranking!</p>
            </div>
          ) : (
            enriched.map((entry) => (
              <LeaderboardRow key={entry.id} entry={entry} />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

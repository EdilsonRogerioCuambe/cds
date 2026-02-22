import { getCurrentUser } from "@/lib/auth"
import { getStudentStats } from "@/lib/data"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function StudentProfilePage() {
  const user = await getCurrentUser()
  const stats = await getStudentStats()

  if (!user || !stats) {
    redirect("/auth/login")
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U"

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 font-display">Meu Perfil</h1>

        <div className="grid gap-6">
          {/* Profile Header */}
          <div className="bg-card rounded-3xl border shadow-sm p-8">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="w-32 h-32 rounded-3xl bg-primary/10 flex items-center justify-center text-5xl font-black text-primary shadow-inner">
                {initials}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-3xl font-black font-display text-foreground">{user.name}</h2>
                <p className="text-muted-foreground text-lg">{user.email}</p>
                <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-3">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20">
                    <span>Nível {stats.currentLevel}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-bold shadow-lg shadow-secondary/20">
                    <span>{user.role === "STUDENT" ? "Aluno" : "Professor"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs uppercase font-black tracking-widest text-muted-foreground/60">Streak atual</p>
              <p className="text-4xl font-black mt-2 text-orange-500">{stats.streak} dias</p>
            </div>
            <div className="bg-card rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs uppercase font-black tracking-widest text-muted-foreground/60">Total XP</p>
              <p className="text-4xl font-black mt-2 text-primary">{stats.xp.toLocaleString()}</p>
            </div>
            <div className="bg-card rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs uppercase font-black tracking-widest text-muted-foreground/60">Horas aprendidas</p>
              <p className="text-4xl font-black mt-2 text-blue-500">{stats.hoursLearned}h</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Information Sections */}
            <div className="bg-card rounded-2xl border p-8 shadow-sm">
              <h3 className="text-xl font-black font-display mb-6">Informações Pessoais</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-xs uppercase font-black tracking-widest text-muted-foreground/60 mb-1 block">Nome completo</label>
                  <p className="font-bold text-lg">{user.name}</p>
                </div>
                <div>
                  <label className="text-xs uppercase font-black tracking-widest text-muted-foreground/60 mb-1 block">Email</label>
                  <p className="font-bold text-lg">{user.email}</p>
                </div>
                <div>
                  <label className="text-xs uppercase font-black tracking-widest text-muted-foreground/60 mb-1 block">Data de cadastro</label>
                  <p className="font-bold text-lg">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Learning Progress */}
            <div className="bg-card rounded-2xl border p-8 shadow-sm">
              <h3 className="text-xl font-black font-display mb-6">Histórico de Aprendizagem</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center group">
                  <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">Lições completadas</span>
                  <span className="font-black text-xl text-primary">{stats.lessonsCompleted} / {stats.totalLessons}</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">Vocabulário aprendido</span>
                  <span className="font-black text-xl text-secondary">{stats.wordsLearned} palavras</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">Média de pontuação (Quiz)</span>
                  <span className="font-black text-xl text-success">{stats.quizAvgScore}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

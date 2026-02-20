export default function StudentProfilePage() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>

        <div className="grid gap-6">
          {/* Profile Header */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-4xl font-bold text-primary">
                JD
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold">Jane Doe</h2>
                <p className="text-muted-foreground">jane.doe@example.com</p>
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <span>Nível B1 - Intermediate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-card rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Streak atual</p>
              <p className="text-3xl font-bold mt-1">7 dias</p>
            </div>
            <div className="bg-card rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Total XP</p>
              <p className="text-3xl font-bold mt-1">1,250</p>
            </div>
            <div className="bg-card rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Horas aprendidas</p>
              <p className="text-3xl font-bold mt-1">24h</p>
            </div>
          </div>

          {/* Information Sections */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Informações Pessoais</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground">Nome completo</label>
                <p className="font-medium">Jane Doe</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <p className="font-medium">jane.doe@example.com</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Data de cadastro</label>
                <p className="font-medium">15 de Janeiro, 2024</p>
              </div>
            </div>
          </div>

          {/* Learning Progress */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Histórico de Aprendizagem</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Lições completadas</span>
                <span className="font-semibold">12 / 50</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Quizzes completados</span>
                <span className="font-semibold">8 / 25</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Média de pontuação</span>
                <span className="font-semibold">85%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

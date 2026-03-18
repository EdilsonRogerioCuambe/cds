import { MainFooter } from "@/components/main-footer"
import { MainNavbar } from "@/components/main-navbar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Zap, Globe, Crown, Target, Sparkles, BookOpen, MessageSquare, Play } from "lucide-react"

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNavbar />

      <main className="flex-1 pt-24 lg:pt-32 pb-20">
        {/* Hero Section */}
        <section className="relative px-6 overflow-hidden pb-20 lg:pb-32">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#10D79E]/15 rounded-full blur-[100px]" />
          </div>

          <div className="relative max-w-5xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
            <Badge variant="outline" className="px-4 py-1.5 border-primary/30 bg-primary/5 text-primary text-xs uppercase tracking-[0.2em] font-bold">
              The Connect Way
            </Badge>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-display tracking-tighter leading-[0.9] text-foreground">
              Aprender é <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#10D79E] italic">
                uma Aventura.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Descubra como nossa metodologia gamificada transforma o esforço de estudar em prazer de conquistar.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 space-y-32">
          {/* Three Pillars Section */}
          <section className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: Crown,
                title: "Gamificação Real",
                desc: "Não é apenas sobre pontos. É sobre progresso tangível. XP, Badges e Ranking criam um ambiente competitivo e saudável que acelera seu aprendizado.",
                details: ["Ranking Semanal", "Badges de Conquista", "Níveis CEFR"],
                color: "text-yellow-500",
                bg: "bg-yellow-500/10"
              },
              {
                icon: Globe,
                title: "Imersão Total",
                desc: "Falar inglês desde o primeiro dia. Nossa plataforma é desenhada para que você consuma e produza no idioma o tempo todo, eliminando a tradução mental.",
                details: ["Conteúdo Nativo", "Zero Tradução", "Cenários Reais"],
                color: "text-blue-500",
                bg: "bg-blue-500/10"
              },
              {
                icon: Zap,
                title: "Prática Ativa",
                desc: "Teoria sem prática é esquecimento. Nossas lições focam 80% no uso prático do idioma através de quizzes interativos e simulações de conversação.",
                details: ["Quizzes Adaptativos", "Feedback Instantâneo", "Simulações"],
                color: "text-emerald-500",
                bg: "bg-emerald-500/10"
              }
            ].map((p, i) => (
              <div key={i} className="group p-10 rounded-[3rem] border border-border/50 bg-card hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 space-y-6">
                <div className={`w-14 h-14 rounded-2xl ${p.bg} ${p.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <p.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold">{p.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{p.desc}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {p.details.map((d, j) => (
                    <span key={j} className="text-[10px] font-bold uppercase tracking-wider text-primary/60 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* XP Journey Visualization */}
          <section className="relative p-12 lg:p-20 rounded-[4rem] bg-[#0A1A31] text-white overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] -mr-40 -mt-40" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#10D79E]/10 rounded-full blur-[100px] -ml-20 -mb-20" />
            
            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-6xl font-black font-display tracking-tight leading-none text-white">
                    Sua Jornada <br />
                    <span className="text-primary italic">Passo a Passo.</span>
                  </h2>
                  <p className="text-lg text-white/60 leading-relaxed">
                    Acompanhe sua evolução em tempo real. Cada lição concluída, cada quiz vencido e cada interação no fórum aproxima você do próximo nível e de novas conquistas.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    { icon: Play, label: "Assista & Absorva", desc: "Aulas dinâmicas de alta produção." },
                    { icon: ClipboardCheck, label: "Pratique & Valide", desc: "Quizzes que desafiam sua retenção." },
                    { icon: MessageSquare, label: "Interaja & Evolua", desc: "Forúm ativo para tirar dúvidas reais." },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-5 group">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                        <step.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white tracking-tight">{step.label}</h4>
                        <p className="text-sm text-white/40">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <Card className="rounded-[3rem] bg-white/5 backdrop-blur-xl border-white/10 p-8 lg:p-12 shadow-2xl hover:border-primary/30 transition-all duration-700">
                  <CardContent className="space-y-8 p-0">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Next Achievement</p>
                        <h3 className="text-2xl font-bold font-display text-white italic">Polyglot Beginner</h3>
                      </div>
                      <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center text-white shadow-xl">
                        <Trophy className="w-7 h-7" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-medium text-white/60">
                        <span>XP Progress</span>
                        <span>2450 / 3000 XP</span>
                      </div>
                      <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
                        <div className="h-full w-[82%] bg-gradient-to-r from-primary to-[#10D79E] rounded-full shadow-[0_0_15px_rgba(16,215,158,0.4)] animate-pulse" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <p className="text-xs font-bold text-white">Streak</p>
                        <p className="text-xl font-black text-white/90">12 Days</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        <p className="text-xs font-bold text-white">Quiz Accuracy</p>
                        <p className="text-xl font-black text-white/90">94%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Final Message / CTA */}
          <section className="py-20 text-center space-y-10 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black font-display tracking-tight leading-tight">
                Mais que uma escola, <br />
                <span className="text-primary italic">seu novo lifestyle.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                Viver um novo idioma não precisa ser um fardo. Na Connect, o aprendizado é o subproduto natural da sua curiosidade e conquistas.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-12 py-6 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
                Começar Minha Aventura
              </button>
              <button className="px-12 py-6 rounded-2xl bg-muted/50 border border-border text-foreground font-bold text-lg hover:bg-muted transition-all">
                 Ver Todos os Cursos
              </button>
            </div>
          </section>
        </div>
      </main>

      <MainFooter />
    </div>
  )
}

function ClipboardCheck(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <path d="m9 14 2 2 4-4" />
        </svg>
    )
}

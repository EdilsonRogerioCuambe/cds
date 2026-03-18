import { MainFooter } from "@/components/main-footer"
import { MainNavbar } from "@/components/main-navbar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, ChevronRight, GraduationCap, Target, Trophy, Star, BookOpen, Clock, Globe } from "lucide-react"

export default function LevelsPage() {
  const levels = [
    {
      id: "A1",
      name: "Iniciante",
      title: "As primeiras conexões.",
      desc: "Ideal para quem está começando do zero absoluto. Você aprenderá a se apresentar, fazer perguntas básicas e entender expressões do dia a dia.",
      skills: ["Apresentações pessoais", "Números e horários", "Vocabulário de rotina", "Saudações comuns"],
      theme: "from-[#15b376] to-[#10b981]",
      shadow: "shadow-[#15b376]/20"
    },
    {
      id: "A2",
      name: "Básico",
      title: "Construindo a base.",
      desc: "Neste nível, você já consegue trocar informações sobre tarefas simples da rotina e descrever seu passado de forma direta.",
      skills: ["Relatar experiências passadas", "Fazer compras e pedidos", "Descrever ambiente e família", "Direções básicas"],
      theme: "from-[#10b981] to-[#059669]",
      shadow: "shadow-[#10b981]/20"
    },
    {
      id: "B1",
      name: "Intermediário",
      title: "Explorando horizontes.",
      desc: "Você começa a se tornar independente. Consegue lidar com a maioria das situações em viagens e falar sobre sonhos, eventos e planos.",
      skills: ["Narrar histórias e planos", "Expressar opiniões e desejos", "Lidar com situações imprevistas", "Leitura de textos simples"],
      theme: "from-[#059669] to-[#047857]",
      shadow: "shadow-[#059669]/20"
    },
    {
      id: "B2",
      name: "Independente",
      title: "A fluência ganha forma.",
      desc: "Você consegue entender as ideias principais de textos complexos e interagir com falantes nativos com um grau de fluidez natural.",
      skills: ["Discussão de temas abstratos", "Fluência em conversação livre", "Entender sotaques variados", "Escrita formal e técnica"],
      theme: "from-[#047857] to-[#065f46]",
      shadow: "shadow-[#047857]/20"
    },
    {
      id: "C1",
      name: "Avançado",
      title: "Domínio e autoridade.",
      desc: "Capacidade de usar o idioma de forma flexível e eficaz para fins sociais, acadêmicos e profissionais de alto nível.",
      skills: ["Interpretação de textos implícitos", "Uso idiomático natural", "Produção de textos detalhados", "Argumentação complexa"],
      theme: "from-[#065f46] to-[#064e3b]",
      shadow: "shadow-[#065f46]/20"
    },
    {
      id: "C2",
      name: "Domínio",
      title: "Como um nativo.",
      desc: "O nível mais alto. Você entende com facilidade praticamente tudo o que ouve ou lê e consegue se expressar com precisão cirúrgica.",
      skills: ["Domínio de nuances sutis", "Entendimento cultural profundo", "Espontaneidade completa", "Sumarização de informações"],
      theme: "from-[#064e3b] to-[#022c22]",
      shadow: "shadow-[#064e3b]/20"
    }
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNavbar />

      <main className="flex-1 pt-24 lg:pt-32 pb-20">
        {/* Hero Section */}
        <section className="relative px-6 overflow-hidden pb-16 lg:pb-24">
          <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="relative max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom duration-1000">
            <Badge variant="outline" className="px-4 py-1.5 border-primary/30 bg-primary/5 text-primary text-xs uppercase tracking-widest font-bold">
              Certificação Internacional
            </Badge>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-display tracking-tighter leading-[0.9] text-foreground">
              Seu Caminho Até a <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#10D79E] italic">
                Fluência Global.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed font-medium">
              Seguimos o quadro europeu (CEFR) para garantir que seu certificado seja reconhecido em qualquer lugar do mundo.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6">
          {/* Levels Timeline/Grid */}
          <div className="grid gap-6">
            {levels.map((l, i) => (
              <div
                key={l.id}
                className="group relative grid lg:grid-cols-[1fr_2.5fr] gap-8 p-8 lg:p-12 rounded-[3rem] border border-border/50 bg-card hover:border-primary/30 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/5 overflow-hidden"
              >
                {/* Visual Level Marker */}
                <div className="space-y-6">
                  <div className={`w-24 h-24 lg:w-32 lg:h-32 rounded-[2.5rem] bg-gradient-to-br ${l.theme} flex items-center justify-center text-white font-black text-4xl lg:text-5xl shadow-2xl ${l.shadow} group-hover:scale-105 transition-transform duration-700`}>
                    {l.id}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-primary uppercase tracking-[0.2em]">{l.name}</p>
                    <h3 className="text-2xl font-bold font-display">{l.title}</h3>
                  </div>
                </div>

                {/* Content Details */}
                <div className="grid md:grid-cols-2 gap-10 items-center">
                  <div className="space-y-6">
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {l.desc}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {l.skills.map((skill, j) => (
                        <div key={j} className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                          <CheckCircle2 className="w-4 h-4 text-[#10D79E] shrink-0" />
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-[2.5rem] p-8 space-y-6 border border-border/30">
                    <div className="flex items-center justify-between">
                      <GraduationCap className="w-6 h-6 text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Level Milestone</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-tighter">
                        <span>XP Target</span>
                        <span>{(i + 1) * 2000} XP</span>
                      </div>
                      <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${l.theme} w-full`} />
                      </div>
                      <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                        Ao completar este nível, você recebe o certificado internacional de proficiência {l.id}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Certification Trust Section */}
          <section className="mt-32 p-12 lg:p-20 rounded-[4rem] bg-[#0A1A31] text-white overflow-hidden text-center space-y-12">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-4xl md:text-6xl font-black font-display tracking-tight leading-tight">
                Reconhecimento sem <br />
                <span className="text-[#10D79E] italic">Fronteiras.</span>
              </h2>
              <p className="text-lg text-white/60 leading-relaxed font-normal">
                Nossos certificados são auditados e seguem rigorosamente os parâmetros de Cambridge e do Quadro Europeu Comum de Referência para Línguas.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto py-8">
              {[
                { label: "Validado Globalmente", icon: Globe },
                { label: "Segurança QR-Code", icon: Target },
                { label: "Sucesso Acadêmico", icon: BookOpen },
                { label: "Carreira Internacional", icon: Trophy }
              ].map((trust, i) => (
                <div key={i} className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <trust.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-white/80 tracking-tight">{trust.label}</span>
                </div>
              ))}
            </div>

            <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <button className="px-10 py-5 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
                Iniciar Teste de Nível
              </button>
              <button className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all">
                 Falar com Consultor
              </button>
            </div>
          </section>
        </div>
      </main>

      <MainFooter />
    </div>
  )
}

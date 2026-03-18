import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Crown, GraduationCap, Shield, Users, Rocket, Target, Heart, Globe, Zap, Award } from "lucide-react"

export default function BusinessRulesPage() {
  return (
    <div className="min-h-screen bg-background pb-20 overflow-hidden">
      {/* Hero Section with Mesh Gradient */}
      <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-40 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#10D79E]/15 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
          <Badge variant="outline" className="px-4 py-1.5 border-primary/30 bg-primary/5 text-primary text-xs uppercase tracking-widest font-bold">
            Conectando você ao amanhã
          </Badge>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-display tracking-tighter leading-[0.9] text-[#132747] dark:text-white">
            Nossa Missão é <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#10D79E] italic">
              Apanhar o Mundo.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            A Connect Digital School não é apenas uma escola de inglês. É o ponto de encontro entre tecnologia, gamificação e fluência real.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 space-y-32">
        {/* Core Values / Mission Pillar */}
        <section className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Rocket,
              title: "Inovação Constante",
              desc: "Metodologia 100% digital e gamificada, desenhada para adultos que não têm tempo a perder.",
              color: "text-blue-500",
              bg: "bg-blue-500/10"
            },
            {
              icon: Target,
              title: "Foco no Resultado",
              desc: "Nossos pilares são baseados no quadro europeu (CEFR), garantindo fluência reconhecida globalmente.",
              color: "text-emerald-500",
              bg: "bg-emerald-500/10"
            },
            {
              icon: Heart,
              title: "Comunidade Ativa",
              desc: "Mais do que alunos, somos uma rede de profissionais e entusiastas conectados pelo idioma.",
              color: "text-rose-500",
              bg: "bg-rose-500/10"
            }
          ].map((v, i) => (
            <div key={i} className="group p-8 rounded-[2.5rem] border border-border/50 bg-card hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
              <div className={`w-14 h-14 rounded-2xl ${v.bg} ${v.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <v.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{v.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </section>

        {/* Methodology Section */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-black font-display tracking-tight text-gradient">
              A Fórmula <span className="text-primary italic">Connect</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Esquecemos o modelo tradicional de decoreba. Criamos um sistema onde você vive o inglês em cada interação.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                title: "Gamificação Adaptativa", 
                desc: "Cada lição é um desafio. Ganhe recompensas e suba de nível enquanto sua fluência decola.",
                icon: Crown,
                color: "bg-yellow-500/10 text-yellow-500"
              },
              { 
                title: "Conteúdo do Mundo Real", 
                desc: "Nada de frases prontas. Aprenda com situações reais de quem vive e trabalha no exterior.",
                icon: Globe,
                color: "bg-blue-500/10 text-blue-500"
              },
              { 
                title: "Imersão Instantânea", 
                desc: "Plataforma 100% em inglês com suporte visual para que você pense no idioma desde o dia 1.",
                icon: Zap,
                color: "bg-emerald-500/10 text-emerald-500"
              }
            ].map((m, i) => (
              <div key={i} className="relative p-1 bg-gradient-to-br from-border/50 to-transparent rounded-[2.5rem] group overflow-hidden shadow-lg transition-all hover:shadow-2xl">
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />
                <div className="relative bg-background rounded-[2.4rem] p-10 space-y-6 h-full border border-transparent group-hover:border-primary/20 transition-all duration-500">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${m.color}`}>
                    <m.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">{m.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Structure - Repurposed Business Rules */}
        <section className="space-y-12 pb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight leading-none">
                Como a <span className="text-primary">Engrenagem</span> Funciona
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl">
                Transparência e clareza no nosso ecossistema educacional.
              </p>
            </div>
          </div>

          <div className="grid gap-10">
            {/* User Ecosystem */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#132747]/5 text-[#132747] text-xs font-bold uppercase tracking-wider">
                  <Users className="w-3.5 h-3.5" /> Nosso Ecossistema
                </div>
                <h3 className="text-3xl font-bold">Papéis e Responsabilidades</h3>
                <div className="space-y-4">
                  {[
                    { role: "Alunos", desc: "Acesso a todo conteúdo imersivo, gamificação e suporte constante.", icon: GraduationCap },
                    { role: "Teachers", desc: "Mentoria direta, feedback personalizado e moderação da comunidade.", icon: Award },
                    { role: "Administração", desc: "Coordenação pedagógica e suporte tecnológico de ponta.", icon: Shield },
                  ].map((r, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl border border-transparent hover:border-border hover:bg-muted/30 transition-all group">
                      <div className="w-10 h-10 rounded-xl bg-background border flex items-center justify-center shrink-0 group-hover:text-primary transition-colors">
                        <r.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold">{r.role}</h4>
                        <p className="text-sm text-muted-foreground">{r.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Levels & Gamification Cards */}
              <div className="grid gap-6">
                <Card className="rounded-[2rem] overflow-hidden border-none bg-[#132747] text-white shadow-2xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-xl italic font-display">
                      <Zap className="w-5 h-5 text-[#10D79E]" /> Modelo de Experiência
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-white/70">
                    <p className="text-sm">Oferecemos flexibilidade total para sua jornada:</p>
                    <div className="flex flex-wrap gap-2">
                      {["Assinatura Mensal", "Assinatura Anual", "Acesso por Módulo", "Acesso Vitalício"].map((p, i) => (
                        <Badge key={i} variant="secondary" className="bg-white/10 text-white border-none hover:bg-white/20">
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-primary/20 bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-xl font-display text-primary">
                      <Award className="w-5 h-5" /> Certificação Digital
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-foreground/80 leading-relaxed">
                    Nossos certificados são gerados automaticamente via e-mail e ficam salvos no seu perfil. Cada conquista contém um <strong>QR Code exclusivo</strong> de verificação internacional.
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section className="relative p-12 lg:p-20 rounded-[3rem] bg-[#0A1A31] text-white overflow-hidden text-center space-y-10">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#10D79E]/10 rounded-full blur-[100px]" />

          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-6xl font-black font-display tracking-tight leading-none text-white">
              Pronto para <br />
              <span className="text-primary italic">Connectar-se?</span>
            </h2>
            <p className="text-lg text-white/60">
              Junte-se a centenas de alunos que já estão transformando suas vidas com a fluência em inglês.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <button className="px-10 py-5 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
              Começar Agora
            </button>
            <button className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all">
               Falar com Consultor
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

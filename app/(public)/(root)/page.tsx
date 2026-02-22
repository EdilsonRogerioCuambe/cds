import { MainFooter } from "@/components/main-footer";
import { MainNavbar } from "@/components/main-navbar";
import { StudentDashboard } from "@/components/student-dashboard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Assuming cn utility is available here
import { faker } from "@faker-js/faker";
import {
    ArrowRight,
    CheckCircle2,
    Globe,
    GraduationCap,
    MonitorPlay,
    PlayCircle,
    ShieldCheck,
    Sparkles,
    Target,
    Trophy,
    Users,
    Zap
} from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-background flex flex-col pt-16 lg:pt-20">
      <MainNavbar />

      <main className="flex-1 flex flex-col gap-24 lg:gap-32 pb-20">
        {/* Hero Section */}
        <section className="relative px-4 lg:px-8 max-w-7xl mx-auto w-full pt-8 lg:pt-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="flex flex-col gap-6 lg:gap-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 lg:px-4 lg:py-1.5 rounded-full bg-primary/10 text-primary text-xs lg:text-sm font-bold w-fit animate-in fade-in slide-in-from-left duration-500">
                <Zap className="w-3.5 h-3.5 lg:w-4 lg:h-4 fill-current" />
                TRANSFORM SEU INGLÊS HOJE
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold font-display tracking-tighter text-foreground text-balance leading-[0.95] text-gradient">
                Connect your future to the <span className="text-primary italic">world.</span>
              </h1>
              <p className="text-lg lg:text-2xl text-muted-foreground max-w-xl leading-relaxed">
                Connect Digital School combina tecnologia de ponta com uma metodologia gamificada para você dominar o inglês com confiança.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button asChild size="lg" className="rounded-full px-8 py-6 lg:px-10 lg:py-7 text-lg lg:text-xl font-bold gradient-brand shadow-2xl shadow-primary/20 hover:scale-105 transition-transform w-full sm:w-auto">
                  <Link href="/auth/register">
                    Começar Agora <ArrowRight className="ml-2 w-5 h-5 lg:w-6 lg:h-6" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8 py-6 lg:px-10 lg:py-7 text-lg lg:text-xl border-2 w-full sm:w-auto">
                   Ver Níveis
                </Button>
              </div>
            </div>

            <div className="relative aspect-square lg:aspect-[4/3] rounded-3xl lg:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/10 border border-border/50 group mt-8 lg:mt-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
              <img
                src={faker.image.url()}
                alt="Connect Students"
                className="object-cover w-full h-full scale-105 group-hover:scale-100 transition-transform duration-700"
              />
              {/* Floating Content Card */}
              <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10 glass p-5 lg:p-8 rounded-2xl lg:rounded-[2rem] shadow-2xl z-20 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 lg:gap-5">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl gradient-brand flex items-center justify-center text-white shadow-xl">
                      <PlayCircle className="w-6 h-6 lg:w-9 lg:h-9" />
                    </div>
                    <div>
                      <p className="font-bold text-sm lg:text-lg text-foreground">Interactive Learning</p>
                      <p className="text-[10px] lg:text-sm text-muted-foreground">Level B1 · Unit 04</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 lg:gap-2 px-2.5 py-1 lg:px-4 lg:py-2 rounded-full bg-primary/10 text-primary font-bold text-[10px] lg:text-sm shrink-0">
                    Live Now
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Stats/Trust */}
        <section className="px-4 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-8 lg:py-12 border-y border-border/50">
            {[
              { label: "Estudantes Ativos", labelEn: "Active Students", value: "12k+" },
              { label: "Taxa de Sucesso", labelEn: "Success Rate", value: "98%" },
              { label: "Países Conectados", labelEn: "Countries Connected", value: "45+" },
              { label: "Cursos Experts", labelEn: "Expert Courses", value: "150+" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="text-3xl lg:text-4xl font-bold font-display text-foreground">{stat.value}</span>
                <span className="text-[10px] lg:text-xs text-muted-foreground uppercase tracking-widest font-medium mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* How it Works / Methods */}
        <section id="methods" className="px-4 lg:px-8 max-w-7xl mx-auto w-full space-y-12 lg:space-y-20">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-6xl font-bold font-display tracking-tight leading-tight">O Método <span className="text-primary italic">Connect</span></h2>
            <p className="text-lg lg:text-xl text-muted-foreground">Nossa plataforma foi desenhada para tornar o aprendizado natural, imersivo e extremamente motivador.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: Globe,
                title: "Imersão Global",
                desc: "Aprenda com situações reais e sotaques variados. Preparamos você para falar com o mundo, não apenas com o livro."
              },
              {
                icon: Target,
                title: "Gamificação Real",
                desc: "Ganhe XP, desbloqueie badges e suba de nível. O progresso é visível e viciante em todas as lições."
              },
              {
                icon: GraduationCap,
                title: "Mentoria Expert",
                desc: "Acesso direto a conteúdos criados por especialistas e acompanhamento constante da sua evolução."
              }
            ].map((f, i) => (
              <div key={i} className="flex flex-col gap-4 lg:gap-6 p-8 lg:p-10 rounded-3xl lg:rounded-[2.5rem] border border-border/50 bg-card hover:border-primary/40 transition-all hover:shadow-2xl hover:shadow-primary/5 group">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:gradient-brand group-hover:text-white transition-all duration-300">
                  <f.icon className="w-6 h-6 lg:w-8 lg:h-8" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold">{f.title}</h3>
                <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Levels Section */}
        <section id="levels" className="relative py-24 lg:py-32 overflow-hidden bg-[#0A1A31]">
          {/* Section Background Glows */}
          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 -ml-40 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#10D79E]/5 rounded-full blur-[100px] -mr-20 -mb-20 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10 space-y-12 lg:space-y-20">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-6xl font-bold font-display tracking-tight leading-tight text-white mb-4">
                Seu Caminho Até a <span className="text-primary italic">Fluência</span>
              </h2>
              <p className="text-lg lg:text-xl text-white/60">
                Seguimos o quadro europeu (CEFR) para garantir que seu certificado seja reconhecido internacionalmente.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
              {[
                { lvl: "A1", name: "Iniciante", theme: "from-[#15b376] to-[#10b981]", shadow: "shadow-[#15b376]/20" },
                { lvl: "A2", name: "Básico", theme: "from-[#10b981] to-[#059669]", shadow: "shadow-[#10b981]/20" },
                { lvl: "B1", name: "Intermediário", theme: "from-[#059669] to-[#047857]", shadow: "shadow-[#059669]/20" },
                { lvl: "B2", name: "Independente", theme: "from-[#047857] to-[#065f46]", shadow: "shadow-[#047857]/20" },
                { lvl: "C1", name: "Avançado", theme: "from-[#065f46] to-[#064e3b]", shadow: "shadow-[#065f46]/20" },
                { lvl: "C2", name: "Domínio", theme: "from-[#064e3b] to-[#022c22]", shadow: "shadow-[#064e3b]/20" },
              ].map((l, i) => (
                <div
                  key={i}
                  className="group relative flex flex-col gap-4 p-5 lg:p-8 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/[0.08] hover:border-primary/30 transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Card Glow on Hover */}
                  <div className="absolute inset-x-0 -bottom-2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />

                  <div className={cn(
                    "w-12 h-12 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl lg:text-2xl shadow-2xl bg-gradient-to-br transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                    l.theme, l.shadow
                  )}>
                    {l.lvl}
                  </div>

                  <div className="space-y-1">
                    <p className="font-bold text-base lg:text-lg text-white group-hover:text-primary transition-colors">{l.name}</p>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[10px] lg:text-xs text-white/40 font-medium uppercase tracking-tighter">CEFR Standard</p>
                      <div className="h-1 w-8 bg-white/10 rounded-full overflow-hidden group-hover:w-12 transition-all duration-500">
                        <div className={cn("h-full w-full bg-gradient-to-r", l.theme)} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experiences - Dashboard Preview */}
        <section id="experiences" className="px-4 lg:px-8 max-w-7xl mx-auto w-full py-8 lg:py-16">
          <div className="text-center mb-10 lg:mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold font-display tracking-tight text-gradient mb-4 lg:mb-6">
              Experiência <span className="text-primary italic">Evoluída</span>
            </h2>
            <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Sua jornada de aprendizado em uma plataforma que respira tecnologia e gamificação.
            </p>
          </div>

          <div className="relative rounded-3xl lg:rounded-[4rem] border border-white/10 bg-[#0A1A31] p-3 lg:p-12 overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
            {/* Ultra Premium Background Effects */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] lg:w-[800px] lg:h-[800px] bg-primary/20 rounded-full blur-[120px] lg:blur-[180px] -mr-[200px] -mt-[200px] lg:-mr-[400px] lg:-mt-[400px] animate-pulse-subtle" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] bg-[#10D79E]/10 rounded-full blur-[100px] lg:blur-[150px] -ml-[200px] -mb-[200px] lg:-ml-[300px] lg:-mb-[300px]" />

            <div className="relative group">
               {/* Floating Glow Indicator */}
               <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary/20 backdrop-blur-md border border-primary/30 px-4 py-1.5 rounded-full z-20 shadow-lg shadow-primary/10">
                  <span className="text-[10px] lg:text-xs font-bold text-primary tracking-widest uppercase">Live Platform Preview</span>
               </div>

              <div className="relative glass rounded-2xl lg:rounded-[2.5rem] border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden bg-background/40 backdrop-blur-2xl transition-all duration-700 group-hover:border-primary/40">
                <div className="h-8 lg:h-12 bg-muted/20 border-b border-white/10 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-red-500/80 shadow-inner" />
                    <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-yellow-500/80 shadow-inner" />
                    <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-green-500/80 shadow-inner" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-[10px] lg:text-xs text-muted-foreground font-medium bg-white/5 px-3 py-1 rounded-full border border-white/5">app.connectdigital.school</span>
                  </div>
                </div>

                <div className="overflow-hidden">
                  <div className="w-full scale-[0.9] lg:scale-100 origin-top transform-gpu transition-all duration-700 group-hover:scale-[1.01]">
                    <StudentDashboardPreviewSegment />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 lg:mt-12 text-center relative z-10">
              <Button asChild className="px-8 lg:px-12 py-7 lg:py-8 rounded-2xl text-lg lg:text-xl font-bold gradient-brand shadow-[0_20px_40px_-5px_rgba(16,215,158,0.4)] hover:shadow-[0_25px_50px_-5px_rgba(16,215,158,0.6)] hover:-translate-y-1 transition-all duration-300">
                <Link href="/auth/register" className="flex items-center gap-3">
                  Quero essa experiência
                  <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ - Quick info */}
        <section className="px-4 lg:px-8 max-w-4xl mx-auto w-full space-y-8 lg:space-y-12">
            <h2 className="text-3xl lg:text-5xl font-bold font-display text-center leading-tight">Tire Suas <span className="text-primary">Dúvidas</span></h2>
            <div className="grid gap-4 lg:gap-6">
                {[
                   { q: "Quais os níveis suportados?", a: "Oferecemos do A1 (Iniciante) ao C2 (Mastery), seguindo o padrão internacional CEFR." },
                   { q: "As aulas são ao vivo?", a: "Temos um misto de aulas gravadas premium e sessões de prática interativas para acelerar sua fala." },
                   { q: "Posso cancelar quando quiser?", a: "Sim, nossos planos são flexíveis. Queremos que você fique por ver resultados, não por contrato." },
                   { q: "Ganha certificado?", a: "Sim, cada nível concluído gera um certificado digital premium assinado pela Connect Digital School." }
                ].map((item, i) => (
                    <div key={i} className="p-6 lg:p-8 rounded-2xl lg:rounded-3xl bg-muted/30 border border-border/50 space-y-2 lg:space-y-3">
                        <p className="font-bold text-base lg:text-lg flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                            {item.q}
                        </p>
                        <p className="text-sm lg:text-base text-muted-foreground leading-relaxed pl-8">{item.a}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* Why Connect - Benefits Grid */}
        <section id="benefits" className="px-4 lg:px-8 max-w-7xl mx-auto w-full py-8 lg:py-12">
          <div className="text-center mb-10 lg:mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold font-display tracking-tight text-gradient mb-4 lg:mb-6 leading-tight">
              Por que escolher a Connect?
            </h2>
            <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Nossa abordagem combina o rigor acadêmico com a praticidade do mundo digital.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              { icon: <Globe className="w-6 h-6 lg:w-8 lg:h-8" />, title: "Imersão Global", desc: "Aulas focadas em situações reais do dia a dia internacional." },
              { icon: <Trophy className="w-6 h-6 lg:w-8 lg:h-8" />, title: "Certificação Internacional", desc: "Alinhado ao quadro europeu comum de referência (CEFR)." },
              { icon: <MonitorPlay className="w-6 h-6 lg:w-8 lg:h-8" />, title: "Plataforma Moderna", desc: "Acesse lições, vídeos e exercícios de qualquer dispositivo." },
              { icon: <Users className="w-6 h-6 lg:w-8 lg:h-8" />, title: "Suporte Personalizado", desc: "Mentoria dedicada para acelerar seu progresso." },
              { icon: <Sparkles className="w-6 h-6 lg:w-8 lg:h-8" />, title: "Gamificação Real", desc: "Ganhe XP, conquiste badges e suba de nível enquanto aprende." },
              { icon: <ShieldCheck className="w-6 h-6 lg:w-8 lg:h-8" />, title: "Foco no Resultado", desc: "Metodologia comprovada para fluência em tempo recorde." }
            ].map((item, i) => (
              <div key={i} className="p-6 lg:p-8 rounded-2xl lg:rounded-3xl bg-card border border-border/50 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5 group">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 lg:mb-6 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-xl lg:text-2xl font-bold mb-2 lg:mb-4">{item.title}</h3>
                <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Lead Capture - Simple & High Conversion */}
        <section id="contact" className="px-4 lg:px-8 max-w-5xl mx-auto w-full py-8 lg:py-12">
          <div className="relative rounded-3xl lg:rounded-[3rem] overflow-hidden bg-foreground text-background p-8 lg:p-20 shadow-2xl">
            <div className="absolute top-0 right-0 w-48 h-48 lg:w-64 lg:h-64 bg-primary/20 blur-[80px] lg:blur-[100px] -mr-24 -mt-24 lg:-mr-32 lg:-mt-32" />
            <div className="relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-5xl font-bold font-display leading-tight mb-4 lg:mb-6">
                  Pronto para dar o <span className="text-primary">próximo passo</span>?
                </h2>
                <p className="text-lg lg:text-xl text-muted-foreground mb-6 lg:mb-8">
                  Deixe seus dados e nossa equipe entrará em contato para uma aula experimental gratuita.
                </p>
                <div className="flex flex-col gap-3 lg:gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                    <span className="text-sm lg:text-base">Nenhum custo inicial</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                    <span className="text-sm lg:text-base">Teste de nivelamento gratuito</span>
                  </div>
                </div>
              </div>
              <form className="bg-background/5 p-6 lg:p-8 rounded-2xl lg:rounded-3xl border border-white/10 backdrop-blur-sm space-y-4">
                <input
                  type="text"
                  placeholder="Seu Nome"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3 lg:py-4 focus:outline-none focus:border-primary transition-colors text-white placeholder:text-white/40"
                />
                <input
                  type="email"
                  placeholder="Seu E-mail"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3 lg:py-4 focus:outline-none focus:border-primary transition-colors text-white placeholder:text-white/40"
                />
                <input
                  type="tel"
                  placeholder="Seu WhatsApp"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3 lg:py-4 focus:outline-none focus:border-primary transition-colors text-white placeholder:text-white/40"
                />
                <Button className="w-full py-6 lg:py-8 rounded-xl text-lg lg:text-xl font-bold gradient-brand">
                  Quero minha aula grátis
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-6 left-6 right-6 z-40 md:hidden animate-in slide-in-from-bottom duration-500">
        <Button asChild className="w-full py-7 rounded-2xl shadow-[0_20px_50px_rgba(16,215,158,0.3)] gradient-brand font-bold text-lg border border-white/20 backdrop-blur-sm">
          <Link href="/auth/register">Matricule-se Agora</Link>
        </Button>
      </div>

      <MainFooter />
    </div>
  )
}

function StudentDashboardPreviewSegment() {
  return (
    <StudentDashboard
      user={{
        id: "guest",
        name: "Jane Doe",
        email: "jane@example.com",
        role: "STUDENT" as any,
        status: "ACTIVE" as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      }}
      stats={{
        currentLevel: "B1",
        xp: 2450,
        xpToNext: 3000,
        streak: 12,
        lessonsCompleted: 45,
        totalLessons: 120,
        quizAvgScore: 92,
        hoursLearned: 28,
        wordsLearned: 850
      }}
      badges={[
        { id: "1", name: "Fast Learner", description: "Completed 5 lessons in a day", earned: true, icon: "zap" },
        { id: "2", name: "Quiz Master", description: "Scored 100% on 3 quizzes", earned: true, icon: "award" },
        { id: "3", name: "Social Butterfly", description: "Posted 10 times in forum", earned: false, icon: "message-square" },
        { id: "4", name: "Early Bird", description: "Learned before 8 AM", earned: false, icon: "clock" }
      ]}
      recentActivity={[
        { id: "1", title: "Completed: Past Perfect", type: "lesson", time: "2 hours ago", xp: 50 },
        { id: "2", title: "Quiz: Essay Structure", type: "quiz", time: "5 hours ago", xp: 100 },
        { id: "3", title: "Joined Forum Discussion", type: "forum", time: "1 day ago", xp: 20 }
      ]}
      weeklyProgress={[
        { day: "Mon", minutes: 45 },
        { day: "Tue", minutes: 30 },
        { day: "Wed", minutes: 60 },
        { day: "Thu", minutes: 45 },
        { day: "Fri", minutes: 90 },
        { day: "Sat", minutes: 20 },
        { day: "Sun", minutes: 0 }
      ]}
      allCourses={[
        {
          id: "c1",
          level: "A1",
          title: "English Foundations",
          description: "Start your journey here.",
          modules: [],
          totalLessons: 24,
          estimatedHours: 12,
          enrolled: 1200,
          locked: false,
          isEnrolled: true,
          published: true
        },
        {
          id: "c2",
          level: "B1",
          title: "Intermediate Mastery",
          description: "Take your skills to the next level.",
          modules: [],
          totalLessons: 30,
          estimatedHours: 15,
          enrolled: 850,
          locked: false,
          isEnrolled: false,
          published: true
        },
        {
          id: "c3",
          level: "C1",
          title: "Business Professional",
          description: "English for the corporate world.",
          modules: [],
          totalLessons: 18,
          estimatedHours: 10,
          enrolled: 400,
          locked: false,
          isEnrolled: false,
          published: true
        }
      ]}
    />
  )
}

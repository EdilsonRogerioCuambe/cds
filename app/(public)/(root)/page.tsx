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
        <section className="relative px-4 lg:px-8 max-w-7xl mx-auto w-full pt-12 lg:pt-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold w-fit animate-in fade-in slide-in-from-left duration-500">
                <Zap className="w-4 h-4 fill-current" />
                TRANSFORM SEU INGLÊS HOJE
              </div>
              <h1 className="text-6xl lg:text-8xl font-bold font-display tracking-tighter text-foreground text-balance leading-[0.95] text-gradient">
                Connect your future to the <span className="text-primary italic">world.</span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-xl leading-relaxed">
                Connect Digital School combina tecnologia de ponta com uma metodologia gamificada para você dominar o inglês com confiança.
              </p>
              <div className="flex flex-wrap gap-5 mt-4">
                <Button asChild size="lg" className="rounded-full px-10 py-7 text-xl font-bold gradient-brand shadow-2xl shadow-primary/20 hover:scale-105 transition-transform">
                  <Link href="/auth/register">
                    Começar Agora <ArrowRight className="ml-2 w-6 h-6" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-10 py-7 text-xl border-2">
                   Ver Níveis
                </Button>
              </div>
            </div>

            <div className="relative aspect-square lg:aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/10 border border-border/50 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
              <img
                src={faker.image.url()}
                alt="Connect Students"
                className="object-cover w-full h-full scale-105 group-hover:scale-100 transition-transform duration-700"
              />
              {/* Floating Content Card */}
              <div className="absolute bottom-10 left-10 right-10 glass p-8 rounded-[2rem] shadow-2xl z-20 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center text-white shadow-xl">
                      <PlayCircle className="w-9 h-9" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-foreground">Interactive Learning</p>
                      <p className="text-sm text-muted-foreground">Level B1 · Unit 04</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm">
                    Live Now
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Stats/Trust */}
        <section className="px-4 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-border/50">
            {[
              { label: "Active Students", value: "12k+" },
              { label: "Success Rate", value: "98%" },
              { label: "Countries Connected", value: "45+" },
              { label: "Expert Courses", value: "150+" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center md:items-start">
                <span className="text-4xl font-bold font-display text-foreground">{stat.value}</span>
                <span className="text-sm text-muted-foreground uppercase tracking-widest font-medium mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* How it Works / Methods */}
        <section id="methods" className="px-4 lg:px-8 max-w-7xl mx-auto w-full space-y-20">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-bold font-display tracking-tight">O Método <span className="text-primary italic">Connect</span></h2>
            <p className="text-xl text-muted-foreground">Nossa plataforma foi desenhada para tornar o aprendizado natural, imersivo e extremamente motivador.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
              <div key={i} className="flex flex-col gap-6 p-10 rounded-[2.5rem] border border-border/50 bg-card hover:border-primary/40 transition-all hover:shadow-2xl hover:shadow-primary/5 group">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:gradient-brand group-hover:text-white transition-all duration-300">
                  <f.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Levels Section */}
        <section id="levels" className="bg-primary/[0.02] py-24 -mx-4 lg:-mx-8 px-4 lg:px-8 border-y border-primary/5">
          <div className="max-w-7xl mx-auto w-full space-y-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-6xl font-bold font-display tracking-tight">Seu Caminho Até a <span className="text-primary">Fluência</span></h2>
                <p className="text-xl text-muted-foreground max-w-2xl">Seguimos o quadro europeu (CEFR) para garantir que seu certificado seja reconhecido internacionalmente.</p>
              </div>

            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4">
              {[
                { lvl: "A1", name: "Iniciante", theme: "bg-[#15b376]" },
                { lvl: "A2", name: "Básico", theme: "bg-[#10b981]" },
                { lvl: "B1", name: "Intermediário", theme: "bg-[#059669]" },
                { lvl: "B2", name: "Independente", theme: "bg-[#047857]" },
                { lvl: "C1", name: "Avançado", theme: "bg-[#065f46]" },
                { lvl: "C2", name: "Domínio", theme: "bg-[#064e3b]" },
              ].map((l, i) => (
                <div key={i} className="flex flex-col gap-4 p-6 rounded-3xl border border-border/50 bg-card hover:translate-y-[-8px] transition-all duration-300">
                   <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg", l.theme)}>
                    {l.lvl}
                   </div>
                   <div>
                    <p className="font-bold text-foreground">{l.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">International Standard</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section className="px-4 lg:px-8 max-w-7xl mx-auto w-full space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl lg:text-6xl font-bold font-display tracking-tight">Experiência <span className="text-primary">Evoluída</span></h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Tudo o que você precisa para aprender de forma eficiente em um único lugar.</p>
          </div>

          <div className="relative rounded-[3rem] border border-white/10 bg-[#132747] p-2 lg:p-8 overflow-hidden shadow-2xl">
            {/* Elegant Dark Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#10D79E]/20 rounded-full blur-[120px] -mr-[250px] -mt-[250px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#10D79E]/10 rounded-full blur-[120px] -ml-[250px] -mb-[250px]" />

            <div className="relative glass rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden bg-background/95">
                <div className="bg-[#132747]/90 px-6 py-4 border-b border-white/10 flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                </div>
                <div className="p-0 overflow-x-auto lg:overflow-visible">
                   <div className="min-w-[800px] lg:min-w-0 origin-top lg:scale-100 transform-gpu">
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
                   </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#132747] via-[#132747]/80 to-transparent flex items-center justify-center pb-8 z-30">
                    <Button asChild size="lg" className="rounded-full px-12 py-8 text-2xl font-bold gradient-brand shadow-2xl shadow-[#10D79E]/20 active:scale-95 transition-all hover:scale-105 border-2 border-white/20">
                        <Link href="/auth/register">Começar Minha Experiência</Link>
                    </Button>
                </div>
            </div>
          </div>
        </section>

        {/* FAQ - Quick info */}
        <section className="px-4 lg:px-8 max-w-4xl mx-auto w-full space-y-12">
            <h2 className="text-3xl lg:text-5xl font-bold font-display text-center">Tire Suas <span className="text-primary">Dúvidas</span></h2>
            <div className="space-y-6">
                {[
                   { q: "Quais os níveis suportados?", a: "Oferecemos do A1 (Iniciante) ao C2 (Mastery), seguindo o padrão internacional CEFR." },
                   { q: "As aulas são ao vivo?", a: "Temos um misto de aulas gravadas premium e sessões de prática interativas para acelerar sua fala." },
                   { q: "Posso cancelar quando quiser?", a: "Sim, nossos planos são flexíveis. Queremos que você fique por ver resultados, não por contrato." },
                   { q: "Ganha certificado?", a: "Sim, cada nível concluído gera um certificado digital premium assinado pela Connect Digital School." }
                ].map((item, i) => (
                    <div key={i} className="p-8 rounded-3xl bg-muted/30 border border-border/50 space-y-3">
                        <p className="font-bold text-lg flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                            {item.q}
                        </p>
                        <p className="text-muted-foreground leading-relaxed">{item.a}</p>
                    </div>
                ))}
            </div>
        </section>
        {/* Why Connect - Benefits Grid */}
        <section id="benefits" className="px-4 lg:px-8 max-w-7xl mx-auto w-full py-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold font-display tracking-tight text-gradient mb-6">
              Por que escolher a Connect?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nossa abordagem combina o rigor acadêmico com a praticidade do mundo digital.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Globe className="w-8 h-8" />, title: "Imersão Global", desc: "Aulas focadas em situações reais do dia a dia internacional." },
              { icon: <Trophy className="w-8 h-8" />, title: "Certificação Internacional", desc: "Alinhado ao quadro europeu comum de referência (CEFR)." },
              { icon: <MonitorPlay className="w-8 h-8" />, title: "Plataforma Moderna", desc: "Acesse lições, vídeos e exercícios de qualquer dispositivo." },
              { icon: <Users className="w-8 h-8" />, title: "Suporte Personalizado", desc: "Mentoria dedicada para acelerar seu progresso." },
              { icon: <Sparkles className="w-8 h-8" />, title: "Gamificação Real", desc: "Ganhe XP, conquiste badges e suba de nível enquanto aprende." },
              { icon: <ShieldCheck className="w-8 h-8" />, title: "Foco no Resultado", desc: "Metodologia comprovada para fluência em tempo recorde." }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5 group">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Lead Capture - Simple & High Conversion */}
        <section id="contact" className="px-4 lg:px-8 max-w-5xl mx-auto w-full py-12">
          <div className="relative rounded-[3rem] overflow-hidden bg-foreground text-background p-12 lg:p-20 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32" />
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold font-display leading-tight mb-6">
                  Pronto para dar o <span className="text-primary">próximo passo</span>?
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Deixe seus dados e nossa equipe entrará em contato para uma aula experimental gratuita.
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Nenhum custo inicial</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Teste de nivelamento gratuito</span>
                  </div>
                </div>
              </div>
              <form className="bg-background/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm space-y-4">
                <input
                  type="text"
                  placeholder="Seu Nome"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-4 focus:outline-none focus:border-primary transition-colors text-white"
                />
                <input
                  type="email"
                  placeholder="Seu E-mail"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-4 focus:outline-none focus:border-primary transition-colors text-white"
                />
                <input
                  type="tel"
                  placeholder="Seu WhatsApp"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-4 focus:outline-none focus:border-primary transition-colors text-white"
                />
                <Button className="w-full py-8 rounded-xl text-xl font-bold gradient-brand">
                  Quero minha aula grátis
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-6 left-6 right-6 z-40 md:hidden">
        <Button asChild className="w-full py-7 rounded-2xl shadow-2xl gradient-brand font-bold text-lg">
          <Link href="/auth/register">Matricule-se Agora</Link>
        </Button>
      </div>

      <MainFooter />
    </div>
  )
}

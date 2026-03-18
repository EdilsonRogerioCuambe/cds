import { MainFooter } from "@/components/main-footer"
import { MainNavbar } from "@/components/main-navbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import prisma from "@/lib/prisma"
import { ArrowRight, BookOpen, Clock, Star, Users, Zap } from "lucide-react"
import Link from "next/link"

export default async function CoursesPage() {
  const dbCourses = await prisma.course.findMany({
    where: { published: true },
    include: {
      _count: {
        select: { enrollments: true }
      },
      modules: {
        include: {
          lessons: true
        }
      }
    },
    orderBy: { level: "asc" }
  })

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNavbar />

      <main className="flex-1 pt-24 lg:pt-32 pb-20">
        {/* Header Section */}
        <section className="relative px-6 pb-16 lg:pb-24 overflow-hidden text-center max-w-5xl mx-auto space-y-6">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
            <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-[#10D79E]/10 rounded-full blur-[100px]" />
          </div>

          <div className="relative space-y-4 animate-in fade-in slide-in-from-bottom duration-1000">
            <Badge variant="outline" className="px-4 py-1.5 border-primary/30 bg-primary/5 text-primary text-xs uppercase tracking-[0.2em] font-bold">
              Catálogo de Excelência
            </Badge>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-display tracking-tighter leading-[0.9] text-foreground">
              Escolha seu <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#10D79E] italic">
                Próximo Nível.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              De iniciante a mestre. Encontre o curso perfeito para seus objetivos acadêmicos ou profissionais.
            </p>
          </div>
        </section>

        {/* Courses Grid */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dbCourses.map((course) => {
              const lessonCount = course.modules.reduce((sum, mod) => sum + mod.lessons.length, 0)
              
              return (
                <Card key={course.id} className="group relative rounded-[3rem] border border-border/50 bg-card hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden flex flex-col">
                  {/* Card Header with Level Badge */}
                  <div className="relative aspect-video bg-muted overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-tr from-[#0A1A31]/80 to-transparent z-10" />
                     <div className="absolute top-4 left-4 z-20">
                        <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center text-white font-black text-xl shadow-lg">
                           {course.level}
                        </div>
                     </div>
                     <img 
                        src={course.thumbnailUrl || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800"} 
                        alt={course.title}
                        className="object-cover w-full h-full scale-105 group-hover:scale-100 transition-transform duration-1000"
                     />
                  </div>

                  <CardHeader className="p-8 pb-4 space-y-4">
                    <div className="flex items-center gap-2">
                       <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] uppercase font-bold tracking-widest px-3 py-1">
                          CEFR Standard {course.level}
                       </Badge>
                    </div>
                    <CardTitle className="text-2xl lg:text-3xl font-bold font-display leading-tight group-hover:text-primary transition-colors">
                       {course.title}
                    </CardTitle>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                       {course.description}
                    </p>
                  </CardHeader>

                  <CardContent className="px-8 py-0 space-y-4 flex-1">
                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
                       <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-primary" />
                          <span className="text-sm font-bold text-foreground/80">{lessonCount} Lições</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="text-sm font-bold text-foreground/80">{course._count.enrollments} Alunos</span>
                       </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                       {["Certificado Digital", "Suporte 24h", "Material PDF"].map((feat, i) => (
                          <span key={i} className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider flex items-center gap-1">
                             <Zap className="w-3 h-3 text-[#10D79E]" /> {feat}
                          </span>
                       ))}
                    </div>
                  </CardContent>

                  <CardFooter className="p-8 pt-6">
                    <Button asChild className="w-full h-14 rounded-2xl text-lg font-bold gradient-brand transition-all hover:scale-[1.02] shadow-xl shadow-primary/20">
                       <Link href={`/auth/register`}>
                          Matricule-se Agora <ArrowRight className="ml-2 w-5 h-5" />
                       </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>

          {/* Empty State if no courses */}
          {dbCourses.length === 0 && (
             <div className="py-20 text-center space-y-6 max-w-lg mx-auto">
                <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto">
                   <BookOpen className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold">Nenhum curso disponível no momento</h3>
                <p className="text-muted-foreground leading-relaxed">
                   Estamos preparando novos conteúdos épicos para sua jornada. Fique ligado nas nossas redes sociais para atualizações!
                </p>
                <Button asChild variant="outline" className="rounded-2xl px-10 border-2">
                   <Link href="/">Voltar para Home</Link>
                </Button>
             </div>
          )}

          {/* Institutional Trust Footer Page */}
          <section className="mt-32 p-12 lg:p-20 rounded-[4rem] bg-[#0A1A31] text-white flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden shadow-2xl relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
             <div className="space-y-6 relative z-10 max-w-xl">
                <h2 className="text-4xl lg:text-5xl font-black font-display tracking-tight leading-tight">
                   Ainda em dúvida sobre <br />
                   <span className="text-[#10D79E] italic">seu nível atual?</span>
                </h2>
                <p className="text-lg text-white/60 leading-relaxed">
                   Realize nosso teste de nivelamento gratuito e descubra exatamente por onde começar sua jornada rumo à fluência.
                </p>
             </div>
             <div className="flex flex-col gap-4 w-full md:w-auto shrink-0 relative z-10">
                <Button asChild size="lg" className="h-16 rounded-2xl text-xl font-bold gradient-brand shadow-xl shadow-primary/30">
                   <Link href="/auth/register">Fazer Teste Grátis</Link>
                </Button>
                <p className="text-center text-xs text-white/30 font-medium uppercase tracking-widest">Leva apenas 15 minutos</p>
             </div>
          </section>
        </div>
      </main>

      <MainFooter />
    </div>
  )
}

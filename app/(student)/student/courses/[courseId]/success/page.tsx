"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, ArrowRight, BookOpen, Trophy, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Progress } from "@/components/ui/progress"

export default function SuccessPage() {
  const params = useParams()
  const courseId = params.courseId as string
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    setShowContent(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#0A1A31] flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-40 -mt-40 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#10D79E]/10 rounded-full blur-[100px] -ml-40 -mb-40" />

      <div className={cn(
        "max-w-2xl w-full bg-background/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 lg:p-12 shadow-2xl relative z-10 transition-all duration-1000 transform",
        showContent ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      )}>
        <div className="text-center space-y-6">
          <div className="relative inline-block">
             <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-ping" />
             <div className="relative h-24 w-24 bg-primary rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-primary/30">
               <CheckCircle2 className="h-14 w-14 text-white" />
             </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl lg:text-5xl font-black font-display text-white tracking-tight">
              Parabéns! 🎉
            </h1>
            <p className="text-lg text-white/60 font-medium">
              Sua matrícula foi confirmada com sucesso.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 py-8">
            <div className="bg-white/5 border border-white/5 p-6 rounded-3xl space-y-2 text-left">
              <BookOpen className="h-6 w-6 text-primary" />
              <p className="text-sm font-bold text-white">Pronto para aprender?</p>
              <p className="text-[10px] text-white/40 leading-relaxed">
                Todo o conteúdo do curso já está disponível no seu painel.
              </p>
            </div>
            <div className="bg-white/5 border border-white/5 p-6 rounded-3xl space-y-2 text-left">
              <Trophy className="h-6 w-6 text-primary" />
              <p className="text-sm font-bold text-white">Conquiste o mundo</p>
              <p className="text-[10px] text-white/40 leading-relaxed">
                Cada lição concluída aproxima você da fluência global.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <Button asChild size="lg" className="w-full h-16 rounded-2xl text-xl font-bold gradient-brand shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
              <Link href="/student/courses" className="flex items-center justify-center gap-2">
                Começar a Estudar Agora
                <ArrowRight className="h-6 w-6" />
              </Link>
            </Button>
            
            <p className="text-xs text-white/30">
              Enviamos um e-mail de confirmação para sua conta com os detalhes do curso.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Sparkles decoration */}
      <div className="absolute top-1/4 left-1/4 animate-bounce delay-75">
        <Sparkles className="h-4 w-4 text-primary/40" />
      </div>
      <div className="absolute bottom-1/4 right-1/4 animate-bounce delay-300">
        <Sparkles className="h-6 w-6 text-primary/40" />
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}

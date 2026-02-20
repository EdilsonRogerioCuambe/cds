"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Flame, Play, Target, Zap } from "lucide-react"

interface Quiz {
  id: string
  title: string
  description: string | null
  type: string
  level: string | null
  points: number
  questions: any
}

export function QuizList({ quizzes, onSelect }: { quizzes: Quiz[]; onSelect: (id: string) => void }) {
  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-display text-foreground tracking-tight">Desafios Semanais</h1>
        <p className="text-muted-foreground">Escolha um desafio baseado no seu nível para ganhar XP e prêmios.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="group overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-all duration-300 flex flex-col hover:shadow-xl hover:shadow-primary/5">
            <div className="h-32 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent relative overflow-hidden">
                 <div className="absolute top-4 right-4">
                    <Badge className="bg-primary/10 text-primary border-primary/20 backdrop-blur-sm">
                        {quiz.level || "ALL"}
                    </Badge>
                 </div>
                 <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap className="w-24 h-24" />
                 </div>
            </div>

            <CardContent className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold font-display mb-2 group-hover:text-primary transition-colors line-clamp-1">{quiz.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1 italic">
                {quiz.description || "Um desafio especial criado para testar suas habilidades."}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6 pt-4 border-t border-border/50">
                 <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <Target className="w-3.5 h-3.5 text-primary" />
                    {Array.isArray(quiz.questions) ? quiz.questions.length : 0} Questões
                 </div>
                 <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    +{quiz.points} XP
                 </div>
              </div>

              <Button onClick={() => onSelect(quiz.id)} className="w-full h-11 rounded-xl font-bold shadow-lg shadow-primary/10 group-hover:shadow-primary/25 transition-all">
                <Play className="w-4 h-4 mr-2 fill-current" />
                Iniciar Agora
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {quizzes.length === 0 && (
          <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-border/50">
             <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
             <h3 className="text-xl font-bold text-foreground">Nenhum desafio encontrado</h3>
             <p className="text-muted-foreground max-w-xs mx-auto mt-2">No momento não há desafios específicos para o seu nível. Volte mais tarde ou complete algumas aulas!</p>
          </div>
      )}
    </div>
  )
}

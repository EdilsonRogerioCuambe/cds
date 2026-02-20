"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { saveQuiz } from "@/lib/actions/teacher"
import { AlignLeft, CheckCircle2, Circle, GripVertical, HelpCircle, Link2, ListOrdered, Music, PlusCircle, Save, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { VideoUpload } from "./video-upload"

export type QuestionType = "multiple-choice" | "true-false" | "fill-blank" | "matching" | "ordering" | "listening" | "essay"

export interface Question {
  id: string
  type: QuestionType
  text: string
  options?: string[]
  correctAnswer: any // string, array or boolean
  explanation: string
  pairs?: { left: string, right: string }[] // for matching
  items?: string[] // for ordering
  mediaUrl?: string // for listening
}

interface QuizBuilderProps {
  lessonId: string
  initialData?: any
}

export function QuizBuilder({ lessonId, initialData }: QuizBuilderProps) {
  const [title, setTitle] = useState(initialData?.title || "Novo Quiz")
  const [description, setDescription] = useState(initialData?.description || "")
  const [questions, setQuestions] = useState<Question[]>(initialData?.questions || [])
  const [type, setType] = useState(initialData?.type || "standard")
  const [points, setPoints] = useState(initialData?.points || 100)
  const [loading, setLoading] = useState(false)

  // Deletion State
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      text: "",
      options: type === "multiple-choice" ? ["", "", "", ""] : undefined,
      correctAnswer: type === "true-false" ? "true" : type === "ordering" ? [] : "",
      explanation: "",
      pairs: type === "matching" ? [{ left: "", right: "" }, { left: "", right: "" }] : undefined,
      items: type === "ordering" ? ["", ""] : undefined,
    }
    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (id: string) => {
    setQuestionToDelete(id)
    setIsAlertOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!questionToDelete) return
    setQuestions(questions.filter(q => q.id !== questionToDelete))
    setIsAlertOpen(false)
    setQuestionToDelete(null)
    toast.info("Questão removida")
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q))
  }

  const handleSave = async () => {
    if (questions.length === 0) {
      toast.error("Adicione pelo menos uma pergunta")
      return
    }

    setLoading(true)
    try {
      await saveQuiz(lessonId, {
        title,
        description,
        type,
        points,
        questions
      })
      toast.success("Quiz salvo com sucesso!")
    } catch (error) {
      toast.error("Erro ao salvar o quiz")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Construtor de Quiz</h2>
          <p className="text-muted-foreground">Crie desafios dinâmicos para seus alunos.</p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Salvando..." : "Salvar Quiz"}
        </Button>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Título do Quiz</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Instruções (Opcional)</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <Card key={question.id} className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  {index + 1}
                </div>
                <Badge variant="secondary" className="capitalize">
                  {question.type.replace("-", " ")}
                </Badge>
              </div>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeQuestion(question.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Pergunta</Label>
                <Textarea
                  value={question.text}
                  onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                  placeholder="Digite o enunciado da questão..."
                />
              </div>

              {question.type === "multiple-choice" && (
                <div className="space-y-3">
                  <Label>Opções (Marque a correta)</Label>
                  {question.options?.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={question.correctAnswer === option && option !== "" ? "text-success" : "text-muted-foreground"}
                        onClick={() => updateQuestion(question.id, { correctAnswer: option })}
                      >
                        {question.correctAnswer === option && option !== "" ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5" />}
                      </Button>
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(question.options || [])]
                          newOptions[oIndex] = e.target.value
                          updateQuestion(question.id, { options: newOptions })
                        }}
                        placeholder={`Opção ${oIndex + 1}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              {question.type === "true-false" && (
                <div className="flex gap-4">
                  <Button
                    variant={question.correctAnswer === "true" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => updateQuestion(question.id, { correctAnswer: "true" })}
                  >
                    Verdadeiro
                  </Button>
                  <Button
                    variant={question.correctAnswer === "false" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => updateQuestion(question.id, { correctAnswer: "false" })}
                  >
                    Falso
                  </Button>
                </div>
              )}

              {question.type === "fill-blank" && (
                <div className="space-y-2">
                  <Label>Resposta Correta</Label>
                  <Input
                    value={question.correctAnswer}
                    onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
                    placeholder="A palavra ou frase exata..."
                  />
                  <p className="text-xs text-muted-foreground italic">Dica: Use [blank] no enunciado para indicar onde a lacuna deve aparecer.</p>
                </div>
              )}

              {question.type === "matching" && (
                <div className="space-y-4">
                  <Label>{"Pares Correspondentes (Esquerda -> Direita)"}</Label>
                  {question.pairs?.map((pair, pIndex) => (
                    <div key={pIndex} className="flex items-center gap-2">
                      <Input
                        value={pair.left}
                        onChange={(e) => {
                          const newPairs = [...(question.pairs || [])]
                          newPairs[pIndex].left = e.target.value
                          updateQuestion(question.id, { pairs: newPairs })
                        }}
                        placeholder="Termo A"
                      />
                      <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                      <Input
                        value={pair.right}
                        onChange={(e) => {
                          const newPairs = [...(question.pairs || [])]
                          newPairs[pIndex].right = e.target.value
                          updateQuestion(question.id, { pairs: newPairs })
                        }}
                        placeholder="Definição/Par"
                      />
                      <Button variant="ghost" size="icon" className="shrink-0" onClick={() => {
                        const newPairs = question.pairs?.filter((_, i) => i !== pIndex)
                        updateQuestion(question.id, { pairs: newPairs })
                      }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" onClick={() => {
                    const newPairs = [...(question.pairs || []), { left: "", right: "" }]
                    updateQuestion(question.id, { pairs: newPairs })
                  }}>
                    <PlusCircle className="w-3.5 h-3.5 mr-1" />
                    Adicionar Par
                  </Button>
                </div>
              )}

              {question.type === "ordering" && (
                <div className="space-y-3">
                  <Label>Itens na Ordem Correta</Label>
                  {question.items?.map((item, iIndex) => (
                    <div key={iIndex} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-muted flex items-center justify-center text-xs font-bold shrink-0">
                        {iIndex + 1}
                      </div>
                      <Input
                        value={item}
                        onChange={(e) => {
                          const newItems = [...(question.items || [])]
                          newItems[iIndex] = e.target.value
                          updateQuestion(question.id, { items: newItems })
                        }}
                        placeholder={`Item ${iIndex + 1}`}
                      />
                      <Button variant="ghost" size="icon" onClick={() => {
                        const newItems = question.items?.filter((_, i) => i !== iIndex)
                        updateQuestion(question.id, { items: newItems })
                      }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" onClick={() => {
                    const newItems = [...(question.items || []), ""]
                    updateQuestion(question.id, { items: newItems })
                  }}>
                    <PlusCircle className="w-3.5 h-3.5 mr-1" />
                    Adicionar Item
                  </Button>
                </div>
              )}

              {question.type === "listening" && (
                <div className="space-y-4">
                  <Label>Arquivo de Áudio/Vídeo</Label>
                  <VideoUpload
                    onUploadComplete={(url) => updateQuestion(question.id, { mediaUrl: url })}
                    initialUrl={question.mediaUrl}
                  />
                  <div className="space-y-2">
                    <Label>Instrução ou Pergunta baseada no áudio</Label>
                    <Input
                      value={question.correctAnswer}
                      onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
                      placeholder="Ex: O que o falante disse sobre o tempo?"
                    />
                  </div>
                </div>
              )}

              {question.type === "essay" && (
                <div className="space-y-2">
                   <p className="text-sm text-muted-foreground italic bg-muted p-3 rounded-lg border">
                     Esta é uma questão de resposta aberta. O aluno terá um campo de texto para escrever a resposta.
                   </p>
                </div>
              )}

              <div className="pt-2 border-t mt-4 space-y-2">
                <Label className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Explicação (Opcional)
                </Label>
                <Input
                  value={question.explanation}
                  onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                  className="text-sm h-8"
                  placeholder="Por que esta é a resposta correta?"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 justify-center pt-8 border-t">
        <Button variant="outline" size="sm" onClick={() => addQuestion("multiple-choice")}>
          <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
          Múltipla Escolha
        </Button>
        <Button variant="outline" size="sm" onClick={() => addQuestion("true-false")}>
          <HelpCircle className="w-4 h-4 mr-2 text-blue-500" />
          Verdadeiro / Falso
        </Button>
        <Button variant="outline" size="sm" onClick={() => addQuestion("fill-blank")}>
          <AlignLeft className="w-4 h-4 mr-2 text-orange-500" />
          Preencher Lacuna
        </Button>
        <Button variant="outline" size="sm" onClick={() => addQuestion("matching")}>
          <Link2 className="w-4 h-4 mr-2 text-purple-500" />
          Associação (Pairs)
        </Button>
        <Button variant="outline" size="sm" onClick={() => addQuestion("ordering")}>
          <ListOrdered className="w-4 h-4 mr-2 text-yellow-500" />
          Ordenação
        </Button>
        <Button variant="outline" size="sm" onClick={() => addQuestion("listening")}>
          <Music className="w-4 h-4 mr-2 text-red-500" />
          Listening (Áudio)
        </Button>
        <Button variant="outline" size="sm" onClick={() => addQuestion("essay")}>
          <AlignLeft className="w-4 h-4 mr-2 text-gray-500" />
          Dissertativa
        </Button>
      </div>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Questão?</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja remover esta questão? Esta ação afetará apenas a lista atual até que você salve as alterações.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { addLesson, deleteLesson, deleteModule, reorderLessons, updateLesson, updateModule } from "@/lib/actions/teacher"
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from "@dnd-kit/sortable"
import { Edit, FileText, GripVertical, PlusCircle, Save, Trash2, Video, Zap } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { SortableItem } from "./sortable-item"

interface ModuleEditorProps {
  initialData: any
}

export function ModuleEditor({ initialData }: ModuleEditorProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [module, setModule] = useState(initialData)
  const [lessonModalOpen, setLessonModalOpen] = useState(false)
  const [newLessonTitle, setNewLessonTitle] = useState("")

  // Deletion State
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: "module" | "lesson" } | null>(null)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleUpdateModule = async (updates: any) => {
    setLoading(true)
    try {
      await updateModule(module.id, updates)
      setModule((prev: any) => ({ ...prev, ...updates }))
      toast.success("Módulo atualizado")
    } catch (error) {
      toast.error("Erro ao atualizar módulo")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleLessonPublished = async (lessonId: string, currentStatus: boolean) => {
    try {
      await updateLesson(lessonId, { published: !currentStatus })
      setModule((prev: any) => ({
        ...prev,
        lessons: prev.lessons.map((l: any) =>
          l.id === lessonId ? { ...l, published: !currentStatus } : l
        )
      }))
      toast.success(currentStatus ? "Aula desativada" : "Aula publicada")
    } catch (error) {
      toast.error("Erro ao alterar status da aula")
    }
  }

  const handleDeleteModule = async () => {
    if (!window.confirm("Certeza que deseja excluir este módulo e todas as suas aulas?")) return

    setLoading(true)
    try {
      await deleteModule(module.id)
      toast.success("Módulo excluído")
      router.push(`/teacher/courses/${module.courseId}/edit`)
    } catch (error) {
      toast.error("Erro ao excluir módulo")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteConfirmed = async () => {
    if (!itemToDelete) return
    setLoading(true)
    try {
      if (itemToDelete.type === "module") {
        await deleteModule(module.id)
        toast.success("Módulo excluído")
        router.push(`/teacher/courses/${module.courseId}/edit`)
      } else {
        await deleteLesson(itemToDelete.id)
        setModule((prev: any) => ({
          ...prev,
          lessons: prev.lessons.filter((l: any) => l.id !== itemToDelete.id)
        }))
        toast.success("Aula excluída")
      }
    } catch (error) {
      toast.error("Erro ao excluir item")
    } finally {
      setLoading(false)
      setIsAlertOpen(false)
      setItemToDelete(null)
    }
  }

  const confirmDelete = (id: string, type: "module" | "lesson") => {
    setItemToDelete({ id, type })
    setIsAlertOpen(true)
  }

  const handleAddLesson = async () => {
    if (!newLessonTitle.trim()) return

    setLoading(true)
    try {
      const newLesson = await addLesson(module.id, {
        title: newLessonTitle,
        order: module.lessons.length + 1
      })
      setModule((prev: any) => ({
        ...prev,
        lessons: [...prev.lessons, newLesson]
      }))
      setNewLessonTitle("")
      setLessonModalOpen(false)
      toast.success("Aula adicionada")
    } catch (error) {
      toast.error("Erro ao adicionar aula")
    } finally {
      setLoading(false)
    }
  }

  const handleDragEndLessons = async (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = module.lessons.findIndex((l: any) => l.id === active.id)
      const newIndex = module.lessons.findIndex((l: any) => l.id === over.id)

      const newLessons = arrayMove(module.lessons, oldIndex, newIndex)
      setModule((prev: any) => ({ ...prev, lessons: newLessons }))

      try {
        await reorderLessons(module.id, newLessons.map((l: any) => l.id))
        toast.success("Ordem atualizada")
      } catch (error) {
        toast.error("Erro ao reordenar")
      }
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuração do Módulo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Título do Módulo</Label>
              <Input
                value={module.title}
                onChange={(e) => setModule({ ...module, title: e.target.value })}
              />
            </div>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <div className="space-y-0.5">
                  <Label>Status de Publicação</Label>
                  <p className="text-[10px] text-muted-foreground">O módulo e suas aulas serão visíveis para alunos.</p>
                </div>
                <Switch
                  checked={module.published}
                  onCheckedChange={(val) => handleUpdateModule({ published: val })}
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button onClick={() => handleUpdateModule({ title: module.title })} disabled={loading} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
                <Button variant="destructive" onClick={() => confirmDelete(module.id, "module")} disabled={loading} className="w-full">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir Módulo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Aulas do Módulo</CardTitle>
              <CardDescription>Gerencie as aulas integradas a este módulo.</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={() => setLessonModalOpen(true)} className="w-full sm:w-auto">
              <PlusCircle className="w-4 h-4 mr-2" />
              Nova Aula
            </Button>
          </CardHeader>
          <CardContent>
            {module.lessons.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                Nenhuma aula adicionada a este módulo.
              </div>
            ) : !mounted ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEndLessons}
                modifiers={[restrictToVerticalAxis]}
              >
                <SortableContext items={module.lessons.map((l: any) => l.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {module.lessons.map((lesson: any) => (
                      <SortableItem key={lesson.id} id={lesson.id}>
                        {({ attributes, listeners }: { attributes: any, listeners: any }) => (
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg group border border-transparent hover:border-border transition-all">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div {...attributes} {...listeners} className="shrink-0">
                                <GripVertical className="w-3.5 h-3.5 text-muted-foreground cursor-grab active:cursor-grabbing" />
                              </div>
                              <div className="shrink-0">
                                {lesson.lessonType === "NOTES" ? (
                                  <FileText className="w-4 h-4 text-blue-400" />
                                ) : lesson.lessonType === "LIVE" ? (
                                  <Video className="w-4 h-4 text-red-400" />
                                ) : lesson.lessonType === "CHALLENGE" ? (
                                  <Zap className="w-4 h-4 text-amber-400" />
                                ) : (
                                  <Video className="w-4 h-4 text-primary" />
                                )}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-sm font-medium truncate">{lesson.title}</span>
                                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                                  <Badge variant={lesson.published ? "default" : "secondary"} className="h-3.5 text-[8px] px-1 uppercase shrink-0">
                                    {lesson.published ? "Publicado" : "Draft"}
                                  </Badge>
                                  {lesson.lessonType && lesson.lessonType !== "VIDEO" && (
                                    <Badge variant="outline" className={`h-3.5 text-[8px] px-1 uppercase shrink-0 ${
                                      lesson.lessonType === "NOTES" ? "border-blue-400/30 text-blue-400" :
                                      lesson.lessonType === "LIVE" ? "border-red-400/30 text-red-400" :
                                      lesson.lessonType === "CHALLENGE" ? "border-amber-400/30 text-amber-400" : ""
                                    }`}>
                                      {lesson.lessonType === "NOTES" ? "Notas" : lesson.lessonType === "LIVE" ? "Ao Vivo" : "Desafio"}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-2">
                              {/* Publication toggle for quick access */}
                              <div className="hidden sm:flex items-center gap-2 mr-2 pr-2 border-r border-border/50">
                                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Publicar</span>
                                <Switch
                                  checked={lesson.published}
                                  onCheckedChange={() => handleToggleLessonPublished(lesson.id, lesson.published)}
                                  className="scale-75"
                                />
                              </div>

                              <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                  <Link
                                    href={`/teacher/courses/lesson/${lesson.id}/edit`}
                                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </Link>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    confirmDelete(lesson.id, "lesson");
                                  }}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </SortableItem>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={lessonModalOpen} onOpenChange={setLessonModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Aula</DialogTitle>
            <DialogDescription>Dê um título para a nova aula deste módulo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Título da Aula</Label>
              <Input
                autoFocus
                placeholder="Ex: Aula 01 - Conceitos Básicos"
                value={newLessonTitle}
                onChange={(e) => setNewLessonTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddLesson()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLessonModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddLesson} disabled={loading}>Criar Aula</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmação de Exclusão */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o
              {itemToDelete?.type === "module" ? " módulo e todas as aulas vinculadas a ele." : "a aula selecionada."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDeleteConfirmed()
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={loading}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

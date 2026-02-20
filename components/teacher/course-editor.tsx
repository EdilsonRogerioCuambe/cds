"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
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
import { ImageUpload } from "./image-upload"
import { SortableItem } from "./sortable-item"

import { addLesson, addModule, createCourse, deleteLesson, deleteModule, reorderLessons, reorderModules, updateCourse } from "@/lib/actions/teacher"
import { formatStudyTime } from "@/lib/utils/time"
import { ArrowLeft, Clock, Edit, FileText, GripVertical, HelpCircle, PlusCircle, Save, Trash2, Video, Zap } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { toast } from "sonner"

interface CourseEditorProps {
  initialData?: any
}

export function CourseEditor({ initialData }: CourseEditorProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [course, setCourse] = useState(() => {
    if (initialData) {
      return {
        ...initialData,
        highlights: Array.isArray(initialData.highlights) ? initialData.highlights : [],
        requirements: Array.isArray(initialData.requirements) ? initialData.requirements : [],
        thumbnailUrl: initialData.thumbnailUrl || "",
        category: initialData.category || "",
        duration: initialData.duration || "",
      }
    }
    return {
      title: "",
      description: "",
      level: "A1",
      price: 0,
      thumbnailUrl: "",
      category: "",
      duration: "",
      highlights: [] as string[],
      requirements: [] as string[],
      modules: []
    }
  })

  const [highlightInput, setHighlightInput] = useState("")
  const [requirementInput, setRequirementInput] = useState("")

  // Modal State
  const [moduleModalOpen, setModuleModalOpen] = useState(false)
  const [newModuleTitle, setNewModuleTitle] = useState("")

  const [lessonModalOpen, setLessonModalOpen] = useState(false)
  const [newLessonTitle, setNewLessonTitle] = useState("")
  const [newLessonType, setNewLessonType] = useState("VIDEO")
  const [newLessonMeetingUrl, setNewLessonMeetingUrl] = useState("")
  const [newLessonMeetingPlatform, setNewLessonMeetingPlatform] = useState("zoom")
  const [newLessonScheduledAt, setNewLessonScheduledAt] = useState("")
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null)

  // Calculate total seconds from all modules and lessons
  const totalSeconds = course.modules?.reduce((acc: number, mod: any) => {
    return acc + (mod.lessons?.reduce((lAcc: number, lesson: any) => lAcc + (lesson.seconds || 0), 0) || 0)
  }, 0) || 0

  // Deletion State
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: "module" | "lesson" } | null>(null)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Basic info change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCourse((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleLevelChange = (value: string) => {
    setCourse((prev: any) => ({ ...prev, level: value }))
  }

  const handleSaveBasic = async () => {
    setLoading(true)
    try {
      if (course.id) {
        await updateCourse(course.id, {
          title: course.title,
          description: course.description,
          level: course.level,
          price: Number(course.price),
          thumbnailUrl: course.thumbnailUrl,
          category: course.category,
          duration: course.duration,
          highlights: course.highlights,
          requirements: course.requirements,
        })
        toast.success("Informações básicas salvas")
      } else {
        const newCourse = await createCourse({
          title: course.title,
          description: course.description,
          level: course.level,
          price: Number(course.price),
          thumbnailUrl: course.thumbnailUrl,
          category: course.category,
          duration: course.duration,
          highlights: course.highlights,
          requirements: course.requirements,
        })
        toast.success("Curso criado com sucesso")
        router.push(`/teacher/courses/${newCourse.id}/edit`)
      }
    } catch (error) {
      toast.error("Erro ao salvar informações")
    } finally {
      setLoading(false)
    }
  }

  const handleMoveModule = async (moduleId: string, direction: "up" | "down") => {
    const currentIndex = course.modules.findIndex((m: any) => m.id === moduleId)
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

    if (newIndex < 0 || newIndex >= course.modules.length) return

    const newModules = [...course.modules]
    const [movedModule] = newModules.splice(currentIndex, 1)
    newModules.splice(newIndex, 0, movedModule)

    setCourse((prev: any) => ({ ...prev, modules: newModules }))

    try {
      await reorderModules(course.id, newModules.map((m: any) => m.id))
      toast.success("Ordem dos módulos atualizada")
    } catch (error) {
      toast.error("Erro ao reordenar módulos")
    }
  }

  const handleMoveLesson = async (moduleId: string, lessonId: string, direction: "up" | "down") => {
    const moduleIndex = course.modules.findIndex((m: any) => m.id === moduleId)
    const module = course.modules[moduleIndex]
    const currentIndex = module.lessons.findIndex((l: any) => l.id === lessonId)
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

    if (newIndex < 0 || newIndex >= module.lessons.length) return

    const newLessons = [...module.lessons]
    const [movedLesson] = newLessons.splice(currentIndex, 1)
    newLessons.splice(newIndex, 0, movedLesson)

    const newModules = [...course.modules]
    newModules[moduleIndex] = { ...module, lessons: newLessons }

    setCourse((prev: any) => ({ ...prev, modules: newModules }))

    try {
      await reorderLessons(moduleId, newLessons.map((l: any) => l.id))
      toast.success("Ordem das aulas atualizada")
    } catch (error) {
      toast.error("Erro ao reordenar aulas")
    }
  }

  const handleDragEndModules = async (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = course.modules.findIndex((m: any) => m.id === active.id)
      const newIndex = course.modules.findIndex((m: any) => m.id === over.id)

      const newModules = arrayMove(course.modules, oldIndex, newIndex)
      setCourse((prev: any) => ({ ...prev, modules: newModules }))

      try {
        await reorderModules(course.id, newModules.map((m: any) => m.id))
        toast.success("Ordem dos módulos atualizada")
      } catch (error) {
        toast.error("Erro ao reordenar módulos")
      }
    }
  }

  const handleDragEndLessons = async (moduleId: string, event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const moduleIndex = course.modules.findIndex((m: any) => m.id === moduleId)
      const module = course.modules[moduleIndex]

      const oldIndex = module.lessons.findIndex((l: any) => l.id === active.id)
      const newIndex = module.lessons.findIndex((l: any) => l.id === over.id)

      const newLessons = arrayMove(module.lessons, oldIndex, newIndex)
      const newModules = [...course.modules]
      newModules[moduleIndex] = { ...module, lessons: newLessons }

      setCourse((prev: any) => ({ ...prev, modules: newModules }))

      try {
        await reorderLessons(moduleId, newLessons.map((l: any) => l.id))
        toast.success("Ordem das aulas atualizada")
      } catch (error) {
        toast.error("Erro ao reordenar aulas")
      }
    }
  }

  const handleAddModule = async () => {
    if (!course.id) {
      toast.error("Salve o curso antes de adicionar módulos")
      return
    }
    if (!newModuleTitle.trim()) return

    setLoading(true)
    try {
      const newModule = await addModule(course.id, {
        title: newModuleTitle,
        order: course.modules.length + 1
      })
      setCourse((prev: any) => ({
        ...prev,
        modules: [...prev.modules, { ...newModule, lessons: [] }]
      }))
      setNewModuleTitle("")
      setModuleModalOpen(false)
      toast.success("Módulo adicionado")
    } catch (error) {
      toast.error("Erro ao adicionar módulo")
    } finally {
      setLoading(false)
    }
  }

  const handleAddLesson = async () => {
    if (!activeModuleId || !newLessonTitle.trim()) return

    setLoading(true)
    try {
      const module = course.modules.find((m: any) => m.id === activeModuleId)
      const newLesson = await addLesson(activeModuleId, {
        title: newLessonTitle,
        order: (module?.lessons?.length || 0) + 1,
        lessonType: newLessonType,
        scheduledAt: newLessonType === "LIVE" && newLessonScheduledAt ? newLessonScheduledAt : undefined,
        meetingUrl: newLessonType === "LIVE" ? newLessonMeetingUrl || undefined : undefined,
        meetingPlatform: newLessonType === "LIVE" ? newLessonMeetingPlatform || undefined : undefined,
      })

      setCourse((prev: any) => ({
        ...prev,
        modules: prev.modules.map((m: any) =>
          m.id === activeModuleId
            ? { ...m, lessons: [...(m.lessons || []), newLesson] }
            : m
        )
      }))
      setNewLessonTitle("")
      setNewLessonType("VIDEO")
      setNewLessonMeetingUrl("")
      setNewLessonScheduledAt("")
      setLessonModalOpen(false)
      toast.success("Aula adicionada")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteConfirmed = async () => {
    if (!itemToDelete) return
    setLoading(true)
    try {
      if (itemToDelete.type === "module") {
        await deleteModule(itemToDelete.id)
        setCourse((prev: any) => ({
          ...prev,
          modules: prev.modules.filter((m: any) => m.id !== itemToDelete.id)
        }))
        toast.success("Módulo excluído")
      } else {
        await deleteLesson(itemToDelete.id)
        setCourse((prev: any) => ({
          ...prev,
          modules: prev.modules.map((m: any) => ({
            ...m,
            lessons: m.lessons?.filter((l: any) => l.id !== itemToDelete.id)
          }))
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

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div className="flex gap-4 items-center">
          {course.id && (
            <div className="flex items-center gap-2 px-3 py-1.5 border rounded-lg bg-muted/30">
              <Label className="text-xs cursor-pointer" htmlFor="publish-toggle">
                {course.published ? "Publicado" : "Rascunho"}
              </Label>
              <Switch
                id="publish-toggle"
                checked={course.published}
                onCheckedChange={(val) => setCourse((prev: any) => ({ ...prev, published: val }))}
                disabled={loading}
                className="scale-90"
              />
            </div>
          )}
          <Button size="sm" onClick={handleSaveBasic} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Course Metadata */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Curso</CardTitle>
              <CardDescription>Informações básicas que os alunos verão primeiro.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Capa do Curso</Label>
                <ImageUpload
                  onUploadComplete={(url) => setCourse((prev: any) => ({ ...prev, thumbnailUrl: url }))}
                  initialUrl={course.thumbnailUrl}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Título do Curso</Label>
                <Input
                  id="title"
                  name="title"
                  value={course.title}
                  onChange={handleChange}
                  placeholder="Ex: Inglês Instrumental para TI"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Nível</Label>
                <Select onValueChange={handleLevelChange} defaultValue={course.level}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A1">A1 - Iniciante</SelectItem>
                    <SelectItem value="A2">A2 - Elementar</SelectItem>
                    <SelectItem value="B1">B1 - Intermediário</SelectItem>
                    <SelectItem value="B2">B2 - Intermediário Superior</SelectItem>
                    <SelectItem value="C1">C1 - Avançado</SelectItem>
                    <SelectItem value="C2">C2 - Proficiente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={course.description}
                  onChange={handleChange}
                  placeholder="Do que se trata o curso?"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={course.price}
                    onChange={handleChange}
                    placeholder="0,00"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="duration">Duração</Label>
                    {totalSeconds > 0 && (
                      <span className="text-[10px] text-primary font-medium bg-primary/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        Calculado: {formatStudyTime(totalSeconds)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="duration"
                      name="duration"
                      value={course.duration || ""}
                      onChange={handleChange}
                      placeholder="Ex: 10h"
                      className="flex-1"
                    />
                    {totalSeconds > 0 && course.duration !== formatStudyTime(totalSeconds) && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 px-2 text-xs"
                        onClick={() => setCourse((prev: any) => ({ ...prev, duration: formatStudyTime(totalSeconds) }))}
                        title="Usar tempo calculado"
                      >
                        Aplicar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  name="category"
                  value={course.category || ""}
                  onChange={handleChange}
                  placeholder="Ex: Business English"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>O que os Alunos vão Aprender</CardTitle>
              <CardDescription>Adicione os tópicos que serão ensinados. Pressione Enter ou clique em + para adicionar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Highlights input */}
              <div className="space-y-3">
                <Label>Destaques da Aprendizagem</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: Domine o vocabulário técnico de TI"
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && highlightInput.trim()) {
                        e.preventDefault()
                        setCourse((prev: any) => ({ ...prev, highlights: [...prev.highlights, highlightInput.trim()] }))
                        setHighlightInput("")
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      if (highlightInput.trim()) {
                        setCourse((prev: any) => ({ ...prev, highlights: [...prev.highlights, highlightInput.trim()] }))
                        setHighlightInput("")
                      }
                    }}
                  >
                    <PlusCircle className="w-4 h-4" />
                  </Button>
                </div>
                {course.highlights?.length > 0 && (
                  <div className="space-y-1.5 p-3 bg-muted/30 rounded-lg border">
                    {course.highlights.map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 group">
                        <div className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor"><path d="M1 6l3.5 3.5L11 2.5"/></svg>
                        </div>
                        <p className="flex-1 text-sm text-foreground leading-relaxed">{item}</p>
                        <button
                          type="button"
                          onClick={() => setCourse((prev: any) => ({ ...prev, highlights: prev.highlights.filter((_: string, idx: number) => idx !== i) }))}
                          className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted-foreground hover:text-destructive"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {course.highlights?.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-3 italic border border-dashed rounded-lg">Nenhum destaque adicionado yet</p>
                )}
              </div>

              {/* Requirements input */}
              <div className="space-y-3 pt-2 border-t">
                <Label>Requisitos Prévios</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: Inglês básico (A1)"
                    value={requirementInput}
                    onChange={(e) => setRequirementInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && requirementInput.trim()) {
                        e.preventDefault()
                        setCourse((prev: any) => ({ ...prev, requirements: [...prev.requirements, requirementInput.trim()] }))
                        setRequirementInput("")
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      if (requirementInput.trim()) {
                        setCourse((prev: any) => ({ ...prev, requirements: [...prev.requirements, requirementInput.trim()] }))
                        setRequirementInput("")
                      }
                    }}
                  >
                    <PlusCircle className="w-4 h-4" />
                  </Button>
                </div>
                {course.requirements?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {course.requirements.map((item: string, i: number) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="group gap-1.5 py-1.5 px-3 text-xs font-medium cursor-default select-none pr-1.5"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => setCourse((prev: any) => ({ ...prev, requirements: prev.requirements.filter((_: string, idx: number) => idx !== i) }))}
                          className="w-4 h-4 rounded-full hover:bg-destructive/20 hover:text-destructive flex items-center justify-center transition-colors"
                        >
                          <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-3 italic border border-dashed rounded-lg">Nenhum requisito adicionado ainda</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Structure (Modules/Lessons) */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Estrutura do Curso</CardTitle>
                <CardDescription>Gerencie módulos, aulas e testes.</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={() => setModuleModalOpen(true)}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Novo Módulo
              </Button>
            </CardHeader>
            <CardContent>
              {course.modules.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                  Nenhum módulo criado ainda.
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEndModules}
                  modifiers={[restrictToVerticalAxis]}
                >
                  <SortableContext items={course.modules.map((m: any) => m.id)} strategy={verticalListSortingStrategy}>
                    <Accordion type="multiple" className="w-full space-y-4">
                      {course.modules.map((module: any) => (
                        <SortableItem key={module.id} id={module.id}>
                          <AccordionItem value={module.id} className="border rounded-lg px-4 bg-card">
                            <div className="flex items-center gap-2">
                              <AccordionTrigger className="hover:no-underline py-4 flex-1">
                                <div className="flex items-center gap-2">
                                  <GripVertical className="w-4 h-4 text-muted-foreground mr-2 cursor-grab active:cursor-grabbing" />
                                  <span className="font-bold">{module.title}</span>
                                  <Badge variant={module.published ? "default" : "secondary"} className="ml-2 h-4 text-[9px] px-1 uppercase">
                                    {module.published ? "Publicado" : "Draft"}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground ml-2">({module.lessons?.length || 0} aulas)</span>
                                </div>
                              </AccordionTrigger>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 ml-auto"
                                  asChild
                                >
                                  <Link
                                    href={`/teacher/modules/${module.id}/edit`}
                                    onClick={(e) => e.stopPropagation()}
                                    onPointerDown={(e) => e.stopPropagation()}
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </Link>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive ml-1"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    confirmDelete(module.id, "module")
                                  }}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            <AccordionContent className="pt-4 pb-4 space-y-2">
                              <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={(e) => handleDragEndLessons(module.id, e)}
                                modifiers={[restrictToVerticalAxis]}
                              >
                                <SortableContext items={module.lessons?.map((l: any) => l.id) || []} strategy={verticalListSortingStrategy}>
                                  <div className="space-y-2">
                                    {module.lessons?.map((lesson: any) => (
                                      <SortableItem key={lesson.id} id={lesson.id}>
                                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg group border border-transparent hover:border-border transition-all">
                                          <div className="flex items-center gap-3">
                                            <GripVertical className="w-3.5 h-3.5 text-muted-foreground cursor-grab active:cursor-grabbing" />
                                            {/* Lesson type icon */}
                                            {lesson.lessonType === "NOTES" ? (
                                              <FileText className="w-4 h-4 text-blue-400" />
                                            ) : lesson.lessonType === "LIVE" ? (
                                              <Video className="w-4 h-4 text-red-400" />
                                            ) : lesson.lessonType === "CHALLENGE" ? (
                                              <Zap className="w-4 h-4 text-amber-400" />
                                            ) : (
                                              <Video className="w-4 h-4 text-primary" />
                                            )}
                                            <div className="flex flex-col">
                                              <span className="text-sm font-medium">{lesson.title}</span>
                                              <div className="flex items-center gap-1.5 mt-0.5">
                                                <Badge variant={lesson.published ? "default" : "secondary"} className="h-3.5 text-[8px] px-1 uppercase">
                                                  {lesson.published ? "Publicado" : "Draft"}
                                                </Badge>
                                                {lesson.lessonType && lesson.lessonType !== "VIDEO" && (
                                                  <Badge variant="outline" className={`h-3.5 text-[8px] px-1 uppercase ${
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
                                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                              <Link
                                                href={`/teacher/courses/lesson/${lesson.id}/edit`}
                                                onClick={(e) => e.stopPropagation()}
                                                onPointerDown={(e) => e.stopPropagation()}
                                              >
                                                <Edit className="w-3.5 h-3.5" />
                                              </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => confirmDelete(lesson.id, "lesson")}>
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                          </div>
                                        </div>
                                      </SortableItem>
                                    ))}
                                  </div>
                                </SortableContext>
                              </DndContext>
                              <div className="pt-4 flex gap-2">
                                 <Button variant="ghost" size="sm" className="text-xs" onClick={() => {
                                   setActiveModuleId(module.id)
                                   setLessonModalOpen(true)
                                 }}>
                                    <PlusCircle className="w-3.5 h-3.5 mr-1" />
                                    Adicionar Aula
                                 </Button>
                                 <Button variant="ghost" size="sm" className="text-xs" onClick={() => toast("Funcionalidade de Quiz em breve")}>
                                    <HelpCircle className="w-3.5 h-3.5 mr-1" />
                                    Adicionar Quiz
                                 </Button>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </SortableItem>
                      ))}
                    </Accordion>
                  </SortableContext>
                </DndContext>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modais de Criação */}
      <Dialog open={moduleModalOpen} onOpenChange={setModuleModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Módulo</DialogTitle>
            <DialogDescription>Dê um título para o novo módulo do seu curso.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Título do Módulo</Label>
              <Input
                autoFocus
                placeholder="Ex: Introdução ao curso"
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddModule()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModuleModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddModule} disabled={loading}>Criar Módulo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={lessonModalOpen} onOpenChange={setLessonModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Aula</DialogTitle>
            <DialogDescription>Defina o título e o tipo da aula.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Título da Aula</Label>
              <Input
                autoFocus
                placeholder="Ex: Aula 01 - Boas vindas"
                value={newLessonTitle}
                onChange={(e) => setNewLessonTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddLesson()}
              />
            </div>

            {/* Lesson Type Selector */}
            <div className="space-y-2">
              <Label>Tipo de Aula</Label>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { value: "VIDEO", label: "Vídeo", icon: <Video className="w-4 h-4" />, desc: "Aula com player de vídeo", color: "text-primary" },
                  { value: "NOTES", label: "Notas", icon: <FileText className="w-4 h-4" />, desc: "Apenas texto/markdown", color: "text-blue-400" },
                  { value: "LIVE", label: "Ao Vivo", icon: <Video className="w-4 h-4" />, desc: "Sessão síncrona online", color: "text-red-400" },
                  { value: "CHALLENGE", label: "Desafio", icon: <Zap className="w-4 h-4" />, desc: "Quiz com timer e XP", color: "text-amber-400" },
                ] as const).map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setNewLessonType(t.value)}
                    className={`flex items-start gap-2.5 p-3 rounded-lg border-2 text-left transition-all ${
                      newLessonType === t.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/50"
                    }`}
                  >
                    <span className={`mt-0.5 ${t.color}`}>{t.icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{t.label}</p>
                      <p className="text-[11px] text-muted-foreground">{t.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* LIVE extra fields */}
            {newLessonType === "LIVE" && (
              <div className="space-y-3 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                <div className="space-y-1.5">
                  <Label className="text-xs">Data e Hora da Sessão</Label>
                  <Input
                    type="datetime-local"
                    value={newLessonScheduledAt}
                    onChange={(e) => setNewLessonScheduledAt(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Plataforma</Label>
                  <Select value={newLessonMeetingPlatform} onValueChange={setNewLessonMeetingPlatform}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zoom">Zoom</SelectItem>
                      <SelectItem value="meet">Google Meet</SelectItem>
                      <SelectItem value="teams">Microsoft Teams</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Link da Reunião (opcional)</Label>
                  <Input
                    placeholder="https://zoom.us/j/..."
                    value={newLessonMeetingUrl}
                    onChange={(e) => setNewLessonMeetingUrl(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLessonModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddLesson} disabled={loading || !newLessonTitle.trim()}>Criar Aula</Button>
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

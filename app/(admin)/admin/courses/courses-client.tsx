"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, Edit, Eye, GraduationCap, Plus, Search, Trash2, Users, Video } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface Course {
  id: string
  title: string
  description: string
  level: string
  price: number
  published: boolean
  thumbnailUrl: string | null
  students: number
  modules: number
  lessons: number
  instructors: { name: string | null; email: string }[]
  createdAt: Date
}

interface AdminCoursesClientProps {
  courses: Course[]
  stats: {
    total: number
    published: number
    drafts: number
    totalStudents: number
  }
}

const LEVEL_COLORS: Record<string, string> = {
  A1: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  A2: "bg-green-500/10 text-green-600 border-green-500/20",
  B1: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  B2: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  C1: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  C2: "bg-red-500/10 text-red-600 border-red-500/20",
}

export function AdminCoursesClient({ courses, stats }: AdminCoursesClientProps) {
  const [search, setSearch] = useState("")
  const [filterLevel, setFilterLevel] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    const matchLevel = filterLevel === "all" || c.level === filterLevel
    const matchStatus = filterStatus === "all" ||
      (filterStatus === "published" ? c.published : !c.published)
    return matchSearch && matchLevel && matchStatus
  })

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Gerenciar Cursos</h1>
          <p className="text-muted-foreground mt-1">Crie, edite e gerencie todos os cursos da plataforma</p>
        </div>
        <Button asChild>
          <Link href="/teacher/courses/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Curso
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-card p-5 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">Total</p>
          <p className="text-3xl font-black text-foreground">{stats.total}</p>
          <p className="text-xs text-muted-foreground">cursos criados</p>
        </div>
        <div className="rounded-xl border bg-card p-5 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">Publicados</p>
          <p className="text-3xl font-black text-emerald-500">{stats.published}</p>
          <p className="text-xs text-muted-foreground">cursos ativos</p>
        </div>
        <div className="rounded-xl border bg-card p-5 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">Rascunhos</p>
          <p className="text-3xl font-black text-amber-500">{stats.drafts}</p>
          <p className="text-xs text-muted-foreground">aguardando</p>
        </div>
        <div className="rounded-xl border bg-card p-5 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">Alunos</p>
          <p className="text-3xl font-black text-primary">{stats.totalStudents}</p>
          <p className="text-xs text-muted-foreground">matriculados</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar curso..."
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-1 flex-wrap">
            {["all", "A1", "A2", "B1", "B2", "C1", "C2"].map(lvl => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  filterLevel === lvl
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border bg-card hover:bg-accent"
                }`}
              >
                {lvl === "all" ? "Todos" : lvl}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {[
              { value: "all", label: "Todos" },
              { value: "published", label: "Publicado" },
              { value: "draft", label: "Rascunho" },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setFilterStatus(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  filterStatus === opt.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border bg-card hover:bg-accent"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filtered.length} curso{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Courses Grid */}
      {filtered.length === 0 ? (
        <div className="border border-dashed rounded-xl flex flex-col items-center justify-center py-20 text-center">
          <BookOpen className="w-14 h-14 text-muted-foreground opacity-20 mb-4" />
          <p className="font-bold text-muted-foreground">Nenhum curso encontrado</p>
          <p className="text-sm text-muted-foreground mt-1">Tente ajustar os filtros ou crie um novo curso</p>
          <Button className="mt-6" asChild>
            <Link href="/teacher/courses/new">
              <Plus className="mr-2 h-4 w-4" />
              Criar Curso
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(course => (
            <div
              key={course.id}
              className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="relative h-44 bg-muted overflow-hidden">
                {course.thumbnailUrl ? (
                  <Image
                    src={course.thumbnailUrl}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                    <BookOpen className="w-12 h-12 text-primary/40" />
                  </div>
                )}
                {/* Status Badge on Thumbnail */}
                <div className="absolute top-3 right-3">
                  <Badge
                    variant={course.published ? "default" : "secondary"}
                    className="text-xs shadow-sm"
                  >
                    {course.published ? "Publicado" : "Rascunho"}
                  </Badge>
                </div>
                {/* Level Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${LEVEL_COLORS[course.level] || "bg-muted text-muted-foreground border-border"}`}>
                    {course.level}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{course.description}</p>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {course.students} alunos
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5" />
                    {course.lessons} aulas
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    {course.modules} módulos
                  </span>
                </div>

                {/* Instructors */}
                {course.instructors.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <GraduationCap className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    {course.instructors.map((inst, i) => (
                      <span key={i} className="text-xs text-muted-foreground">
                        {inst.name || inst.email}{i < course.instructors.length - 1 ? "," : ""}
                      </span>
                    ))}
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="font-bold text-foreground">
                    {course.price === 0 ? "Gratuito" : `MT ${course.price.toLocaleString("pt-MZ")}`}
                  </span>
                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={`/teacher/courses/${course.id}/edit`} target="_blank" title="Pré-visualizar (como professor)">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" asChild>
                      <Link href={`/admin/courses/${course.id}/edit`} title="Editar curso">
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" title="Excluir curso">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

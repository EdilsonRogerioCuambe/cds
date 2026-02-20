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
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { deleteCourse } from "@/lib/actions/teacher"
import { cn } from "@/lib/utils"
import { BookOpen, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

export function CourseList({ courses: initialCourses }: { courses: any[] }) {
  const [courses, setCourses] = useState(initialCourses)
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const confirmDelete = (id: string) => {
    setCourseToDelete(id)
    setIsAlertOpen(true)
  }

  const handleDelete = async () => {
    if (!courseToDelete) return
    setLoading(true)
    try {
      await deleteCourse(courseToDelete)
      setCourses(courses.filter(c => c.id !== courseToDelete))
      toast.success("Curso excluído com sucesso")
    } catch (error) {
      toast.error("Erro ao excluir curso")
    } finally {
      setLoading(false)
      setIsAlertOpen(false)
      setCourseToDelete(null)
    }
  }

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="aspect-video bg-muted relative">
              {course.thumbnailUrl ? (
                <img src={course.thumbnailUrl} alt={course.title} className="object-cover w-full h-full" />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <BookOpen className="w-8 h-8 opacity-20" />
                </div>
              )}
              <div className="absolute top-2 left-2 flex gap-2">
                <div className={cn(
                  "px-2 py-1 rounded text-[10px] font-bold border backdrop-blur-sm",
                  course.published
                    ? "bg-success/20 text-success border-success/30 shadow-[0_0_10px_rgba(21,179,118,0.2)]"
                    : "bg-warning/20 text-warning border-warning/30 shadow-[0_0_10px_rgba(245,158,11,0.1)] uppercase"
                )}>
                  {course.published ? "PUBLICADO" : "RASCUNHO"}
                </div>
              </div>
              <div className="absolute top-2 right-2">
                <div className="bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold border">
                  {course.level}
                </div>
              </div>
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg truncate">{course.title}</CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex items-center justify-between border-t mt-4">
              <div className="text-sm">
                <span className="font-bold text-foreground">{course.enrolled || 0}</span>
                <span className="ml-1 text-muted-foreground">alunos</span>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/teacher/courses/${course.id}/edit`}>
                    <Edit className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => confirmDelete(course.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Curso?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação excluirá permanentemente o curso e todo o seu conteúdo (módulos, aulas, testes).
              Esta operação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={loading}
            >
              Excluir permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

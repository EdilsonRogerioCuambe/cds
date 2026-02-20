import { CourseEditor } from "@/components/teacher/course-editor"

export default function NewCoursePage() {
  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground">Novo Curso</h1>
        <p className="text-muted-foreground mt-1">Configure as informações básicas do seu novo curso</p>
      </div>
      <CourseEditor />
    </div>
  )
}

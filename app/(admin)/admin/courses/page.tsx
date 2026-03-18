import prisma from "@/lib/prisma"
import { AdminCoursesClient } from "./courses-client"

export default async function AdminCoursesPage() {
  const dbCourses = await prisma.course.findMany({
    include: {
      _count: { select: { enrollments: true } },
      modules: {
        include: { lessons: { select: { id: true } } }
      },
      instructors: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  const courses = dbCourses.map(course => ({
    id: course.id,
    title: course.title,
    description: course.description,
    level: course.level,
    price: course.price,
    published: course.published,
    thumbnailUrl: course.thumbnailUrl,
    students: course._count.enrollments,
    modules: course.modules.length,
    lessons: course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0),
    instructors: course.instructors.map(i => ({ name: i.name, email: i.email })),
    createdAt: course.createdAt
  }))

  const stats = {
    total: courses.length,
    published: courses.filter(c => c.published).length,
    drafts: courses.filter(c => !c.published).length,
    totalStudents: courses.reduce((sum, c) => sum + c.students, 0)
  }

  return <AdminCoursesClient courses={courses} stats={stats} />
}

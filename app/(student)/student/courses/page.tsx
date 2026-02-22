import { getCourses } from "@/lib/data"

export const dynamic = "force-dynamic"

export default async function CoursesPage() {
  const courses = await getCourses()

  return <CourseStructure courses={courses} />
}

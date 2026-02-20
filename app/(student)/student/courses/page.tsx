import { CourseStructure } from "@/components/course-structure"
import { getCourses } from "@/lib/data"

export default async function CoursesPage() {
  const courses = await getCourses()

  return <CourseStructure courses={courses} />
}

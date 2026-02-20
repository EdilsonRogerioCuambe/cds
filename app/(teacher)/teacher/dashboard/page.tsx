import { TeacherDashboard } from "@/components/teacher-dashboard"
import { getCurrentUser } from "@/lib/auth"
import { getCourses, getForumPosts, getTeacherStats } from "@/lib/data"
import { redirect } from "next/navigation"

export default async function TeacherDashboardPage() {
  const user = await getCurrentUser()

  if (!user || (user.role !== "ADMIN" && user.role !== "TEACHER")) {
    redirect("/auth/login")
  }

  const [courses, forumPosts, dashboardData] = await Promise.all([
    getCourses(user.id),
    getForumPosts(),
    getTeacherStats(user.id)
  ])

  const { stats, distribution, performance, topStudents } = dashboardData

  return (
    <TeacherDashboard
      user={user}
      stats={stats}
      performance={performance}
      distribution={distribution}
      courses={courses}
      forumPosts={forumPosts}
      topStudents={topStudents}
    />
  )
}

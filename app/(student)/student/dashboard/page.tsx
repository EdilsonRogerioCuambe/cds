import { StudentDashboard } from "@/components/student-dashboard"
import { getCurrentUser } from "@/lib/auth"
import { getBadges, getCourses, getRecentActivity, getStudentStats, getWeeklyProgress } from "@/lib/data"
import { redirect } from "next/navigation"

export default async function StudentDashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  const [stats, badges, activity, weekly, allCourses] = await Promise.all([
    getStudentStats(),
    getBadges(),
    getRecentActivity(),
    getWeeklyProgress(),
    getCourses()
  ])

  if (!stats) {
    return <div>Error loading stats</div>
  }

  return (
    <StudentDashboard
      user={user}
      stats={stats}
      badges={badges}
      recentActivity={activity}
      weeklyProgress={weekly}
      allCourses={allCourses}
    />
  )
}

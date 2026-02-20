import { TeacherAnalyticsDashboard } from "@/components/teacher/analytics-dashboard"
import { getCurrentUser } from "@/lib/auth"
import { getTeacherStats } from "@/lib/data"
import { redirect } from "next/navigation"

export default async function TeacherAnalyticsPage() {
  const user = await getCurrentUser()
  if (!user || (user.role !== "TEACHER" && user.role !== "ADMIN")) {
    redirect("/auth/login")
  }

  const data = await getTeacherStats(user.id)

  return <TeacherAnalyticsDashboard data={data} />
}

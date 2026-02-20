import { TeacherSettingsForm } from "@/components/teacher/settings-form"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function TeacherSettingsPage() {
  const user = await getCurrentUser()
  if (!user || (user.role !== "TEACHER" && user.role !== "ADMIN")) {
    redirect("/auth/login")
  }

  return <TeacherSettingsForm user={user} />
}

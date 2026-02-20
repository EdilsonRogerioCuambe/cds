import { StudentSettingsForm } from "@/components/student-settings-form"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function StudentSettingsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/auth/login")

  // Fetch fresh user data including phone
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, name: true, email: true, phone: true, bio: true, image: true }
  })

  if (!dbUser) redirect("/auth/login")

  return <StudentSettingsForm user={dbUser} />
}

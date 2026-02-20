import { AppShell } from "@/components/app-shell"
import { requireRole } from "@/lib/auth"
import { UserRole } from "@/types/user"

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRole(UserRole.TEACHER)

  return (
    <AppShell variant="teacher">
      {children}
    </AppShell>
  )
}

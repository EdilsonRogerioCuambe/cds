import { AppShell } from "@/components/app-shell"
import { requireRole } from "@/lib/auth"
import { UserRole } from "@/types/user"

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRole(UserRole.STUDENT)

  return (
    <AppShell variant="student">
      {children}
    </AppShell>
  )
}

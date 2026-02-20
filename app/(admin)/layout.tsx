import { AppShell } from "@/components/app-shell"
import { requireRole } from "@/lib/auth"
import { UserRole } from "@/types/user"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRole(UserRole.ADMIN)

  return (
    <AppShell variant="admin">
      {children}
    </AppShell>
  )
}

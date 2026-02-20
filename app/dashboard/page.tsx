import { getCurrentUser, getDefaultRedirectPath } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardRedirectPage() {
  const user = await getCurrentUser()

  if (!user) {
    console.log("[Dashboard] No user found, redirecting to /auth/login")
    return redirect("/auth/login")
  }

  const redirectPath = getDefaultRedirectPath(user.role)
  console.log(`[Dashboard] User ${user.email} (role: ${user.role}) -> ${redirectPath}`)

  if (redirectPath === "/dashboard") {
    console.error("[Dashboard] LOOP DETECTED: redirectPath is /dashboard!")
    return redirect("/auth/login")
  }

  return redirect(redirectPath)
}

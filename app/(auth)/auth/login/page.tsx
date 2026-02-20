import { LoginForm } from "@/components/auth/login-form"
import { getCurrentUser, getDefaultRedirectPath } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const user = await getCurrentUser()

  if (user) {
    console.log(`[LoginPage] User already authenticated: ${user.email}, redirecting to dashboard`)
    return redirect(getDefaultRedirectPath(user.role))
  }

  return <LoginForm />
}

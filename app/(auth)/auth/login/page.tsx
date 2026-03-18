import { LoginForm } from "@/components/auth/login-form"
import { getCurrentUser, getDefaultRedirectPath } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function LoginPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams;
  const email = typeof searchParams.get === 'function' ? (searchParams as any).get("email") : searchParams.email;
  const user = await getCurrentUser()

  if (user) {
    console.log(`[LoginPage] User already authenticated: ${user.email}, redirecting to dashboard`)
    return redirect(getDefaultRedirectPath(user.role))
  }

  return <LoginForm defaultEmail={typeof email === 'string' ? email : undefined} />
}

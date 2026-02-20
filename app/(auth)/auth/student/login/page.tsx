import SpecializedLoginPage from "@/components/auth/specialized-login"
import { getCurrentUser, getDefaultRedirectPath } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function StudentLoginPage() {
  const user = await getCurrentUser()

  if (user) {
    return redirect(getDefaultRedirectPath(user.role))
  }

  return <SpecializedLoginPage role="STUDENT" />
}

import { User, UserRole, UserStatus, isAdmin, isStudent, isTeacher } from "@/types/user"
import { headers } from "next/headers"
import { auth } from "./auth-server"

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session || !session.user) {
    return null
  }

  // Map Better Auth user to our application's User type
  const user = session.user as any

  return {
    id: user.id,
    name: user.name || "",
    email: user.email,
    role: (user.role?.toUpperCase() as UserRole) || UserRole.STUDENT,
    status: (user.status as UserStatus) || UserStatus.ACTIVE,
    avatar: user.image || undefined,
    currentLevel: user.currentLevel as string | undefined,
    xp: user.xp as number | undefined,
    streak: user.streak as number | undefined,
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
  }
}

/**
 * Get the role of the current user
 */
export async function getUserRole(): Promise<UserRole | null> {
  const user = await getCurrentUser()
  return user?.role || null
}

/**
 * Check if current user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null
}

import { redirect } from "next/navigation"

/**
 * Require authentication - redirects to login if not authenticated
 * Use in Server Components or API routes
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  return user
}

/**
 * Require specific role - redirects to unauthorized if user doesn't have the role
 * Use in Server Components or API routes
 */
export async function requireRole(allowedRoles: UserRole | UserRole[]): Promise<User> {
  const user = await requireAuth()

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]

  if (!roles.includes(user.role)) {
    redirect("/unauthorized")
  }

  return user
}

/**
 * Check if user has specific role
 */
export async function hasRole(role: UserRole | UserRole[]): Promise<boolean> {
  const user = await getCurrentUser()

  if (!user) {
    return false
  }

  const roles = Array.isArray(role) ? role : [role]
  return roles.includes(user.role)
}

/**
 * Get redirect path based on user role
 */
export function getDefaultRedirectPath(role: UserRole): string {
  const redirectPaths: Record<UserRole, string> = {
    [UserRole.ADMIN]: "/admin/dashboard",
    [UserRole.TEACHER]: "/teacher/dashboard",
    [UserRole.STUDENT]: "/student/dashboard",
  }

  return redirectPaths[role]
}

// Re-export type guards
export { isAdmin, isStudent, isTeacher }

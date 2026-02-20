/**
 * User Role Enumeration
 * Defines the different roles available in the system
 */
export enum UserRole {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
}

/**
 * User Status Enumeration
 */
export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  PENDING = "PENDING",
}

/**
 * User Interface
 * Main user type used throughout the application
 */
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  avatar?: string
  createdAt: Date
  updatedAt: Date

  // Student-specific fields
  currentLevel?: string
  xp?: number
  streak?: number

  // Teacher-specific fields
  bio?: string
  expertise?: string[]

  // Admin-specific fields
  permissions?: string[]
}

/**
 * Auth Session Interface
 */
export interface AuthSession {
  user: User
  accessToken: string
  refreshToken?: string
  expiresAt: Date
}

/**
 * Type guards for user roles
 */
export const isAdmin = (user: User | null | undefined): boolean => {
  return user?.role === UserRole.ADMIN
}

export const isTeacher = (user: User | null | undefined): boolean => {
  return user?.role === UserRole.TEACHER
}

export const isStudent = (user: User | null | undefined): boolean => {
  return user?.role === UserRole.STUDENT
}

/**
 * Helper to get role display name
 */
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    [UserRole.ADMIN]: "Administrador",
    [UserRole.TEACHER]: "Professor",
    [UserRole.STUDENT]: "Aluno",
  }
  return roleNames[role]
}

"use client"

import { cn } from "@/lib/utils"
import {
    BookOpen,
    ClipboardCheck,
    FolderOpen,
    LayoutDashboard,
    MessageSquare,
    Play,
    Settings,
    TrendingUp,
    Trophy,
    User,
    Users
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface AppSidebarProps {
  variant?: "student" | "teacher" | "admin"
}

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children?: { label: string; href: string }[]
}

const studentNav: NavItem[] = [
  { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { label: "Cursos", href: "/student/courses", icon: BookOpen },
  { label: "Lições", href: "/student/lesson", icon: Play },
  { label: "Quizzes", href: "/student/quiz", icon: ClipboardCheck },
  { label: "Fórum", href: "/student/forum", icon: MessageSquare },
  { label: "Ranking", href: "/student/leaderboard", icon: Trophy },
  { label: "Perfil", href: "/student/profile", icon: User },
  { label: "Configurações", href: "/student/settings", icon: Settings },
]

const teacherNav: NavItem[] = [
  { label: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
  { label: "Alunos", href: "/teacher/students", icon: Users },
  { label: "Cursos", href: "/teacher/courses", icon: BookOpen },
  { label: "Analytics", href: "/teacher/analytics", icon: TrendingUp },
  { label: "Configurações", href: "/teacher/settings", icon: Settings },
]

const adminNav: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard
  },
  {
    label: "Usuários",
    href: "/admin/users",
    icon: Users,
    children: [
      { label: "Alunos", href: "/admin/users/students" },
      { label: "Professores", href: "/admin/users/teachers" },
    ]
  },
  {
    label: "Cursos",
    href: "/admin/courses",
    icon: BookOpen
  },
  {
    label: "Conteúdo",
    href: "/admin/content",
    icon: FolderOpen,
    children: [
      { label: "Lições", href: "/admin/content/lessons" },
      { label: "Quizzes", href: "/admin/content/quizzes" },
    ]
  },
  {
    label: "Fórum",
    href: "/admin/forum",
    icon: MessageSquare
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: TrendingUp
  },
  {
    label: "Configurações",
    href: "/admin/settings",
    icon: Settings
  },
]

import { signOutAction } from "@/app/actions/auth"
import { authClient } from "@/lib/auth-client"
import { LogOut } from "lucide-react"

export function AppSidebar({ variant = "student" }: AppSidebarProps) {
  const pathname = usePathname()
  const { data: session } = authClient.useSession()
  const user = session?.user

  const navItems = variant === "admin"
    ? adminNav
    : variant === "teacher"
    ? teacherNav
    : studentNav

  const sectionTitle = variant === "admin"
    ? "Administração"
    : variant === "teacher"
    ? "Professor"
    : "Aprendizagem"

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "U"

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border min-h-screen fixed left-0 top-0 z-30">
      <div className="flex items-center gap-2 px-6 py-8 border-b border-sidebar-border">
        <Link href="/" className="flex flex-col">
          <span className="font-display text-[#132747] text-2xl font-extrabold tracking-tight text-sidebar-foreground leading-none">
            C<span className="text-[#10D79E]">o</span>nnect
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-sidebar-foreground/50 mt-1">
            Digital School
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4">
        <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
          {sectionTitle}
        </div>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href))

          return (
            <div key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-0.5",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <item.icon className="w-[18px] h-[18px]" />
                {item.label}
              </Link>

              {/* Render submenu items if they exist */}
              {"children" in item && item.children && (
                <div className="ml-6 mt-1 space-y-0.5">
                  {item.children.map((child) => {
                    const isChildActive = pathname === child.href
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                          isChildActive
                            ? "bg-sidebar-accent text-sidebar-foreground"
                            : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                        )}
                      >
                        {child.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-sidebar-border flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-sidebar-accent text-sm font-semibold text-sidebar-accent-foreground">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.name || "Usuário"}
            </p>
            <p className="text-xs text-sidebar-foreground/50 truncate">
              {variant === "admin" ? "Administrador" : variant === "teacher" ? "Professor" : (user as any)?.currentLevel || "Aluno"}
            </p>
          </div>
        </div>

        <button
          onClick={() => signOutAction()}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Sair
        </button>
      </div>
    </aside>
  )
}

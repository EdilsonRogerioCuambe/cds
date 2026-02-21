"use client"

import { signOutAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import {
    BookOpen,
    ClipboardCheck,
    FolderOpen,
    LayoutDashboard,
    LogOut,
    Menu,
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
import { useState } from "react"

interface MobileNavProps {
  variant?: "student" | "teacher" | "admin"
}

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const studentNavItems: NavItem[] = [
  { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { label: "Cursos", href: "/student/courses", icon: BookOpen },
  { label: "Lições", href: "/student/lesson", icon: Play },
  { label: "Quizzes", href: "/student/quiz", icon: ClipboardCheck },
  { label: "Fórum", href: "/student/forum", icon: MessageSquare },
  { label: "Ranking", href: "/student/leaderboard", icon: Trophy },
  { label: "Perfil", href: "/student/profile", icon: User },
  { label: "Configurações", href: "/student/settings", icon: Settings },
]

const teacherNavItems: NavItem[] = [
  { label: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
  { label: "Alunos", href: "/teacher/students", icon: Users },
  { label: "Cursos", href: "/teacher/courses", icon: BookOpen },
  { label: "Analytics", href: "/teacher/analytics", icon: TrendingUp },
  { label: "Configurações", href: "/teacher/settings", icon: Settings },
]

const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Usuários", href: "/admin/users", icon: Users },
  { label: "Cursos", href: "/admin/courses", icon: BookOpen },
  { label: "Conteúdo", href: "/admin/content", icon: FolderOpen },
  { label: "Fórum", href: "/admin/forum", icon: MessageSquare },
  { label: "Analytics", href: "/admin/analytics", icon: TrendingUp },
  { label: "Configurações", href: "/admin/settings", icon: Settings },
]

export function MobileNav({ variant = "student" }: MobileNavProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { data: session } = authClient.useSession()
  const user = session?.user

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "U"

  const navItems = variant === "admin"
    ? adminNavItems
    : variant === "teacher"
    ? teacherNavItems
    : studentNavItems

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-background border-b border-white/5">
      {/* Premium Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />

      <div className="flex items-center gap-2">
        <Link href="/" className="flex flex-col group">
          <span className="font-display text-base font-extrabold tracking-tight leading-none text-foreground group-hover:text-primary transition-colors">
            C<span className="text-[#10D79E]">o</span>nnect
          </span>
          <span className="text-[7px] font-bold tracking-[0.2em] uppercase mt-1.5 text-primary/80">
            Digital School
          </span>
        </Link>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="p-2 rounded-lg hover:bg-white/5 text-foreground hover:text-primary transition-all active:scale-90"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="top" className="w-full bg-background/95 backdrop-blur-xl border-white/5 pt-12 pb-8 shadow-2xl">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-left">
              <div className="flex flex-col">
                <span className="font-display text-xl font-extrabold tracking-tight leading-none text-foreground">
                  C<span className="text-[#10D79E]">o</span>nnect
                </span>
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase mt-1.5 text-primary">
                  Digital School
                </span>
              </div>
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                      : "text-foreground/70 hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/10"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 transition-transform group-hover:scale-110",
                    isActive ? "text-primary-foreground" : "text-primary/70"
                  )} />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto pt-8 border-t border-white/5 space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border border-primary/20 text-sm font-bold text-primary">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">
                  {user?.name || "Usuário"}
                </p>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  {variant === "admin" ? "Administrador" : variant === "teacher" ? "Professor" : (user as any)?.currentLevel || "Aluno"}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={() => signOutAction()}
              className="w-full justify-start gap-4 px-4 py-3.5 rounded-xl text-sm font-semibold text-red-500 hover:text-red-600 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Sair da Conta
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}

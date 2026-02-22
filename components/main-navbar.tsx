"use client"

import { signOutAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { ChevronRight, LayoutDashboard, LogOut, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const navLinks = [
  { label: "Cursos", href: "#courses" },
  { label: "Níveis", href: "#levels" },
  { label: "Metodologia", href: "#methods" },
  { label: "Sobre nós", href: "/docs/business-rules" },
]

export function MainNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session, isPending } = authClient.useSession()
  const isAuthenticated = !!session

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-[1.02]">
            <div className="flex flex-col">
              <span className="font-display text-xl lg:text-2xl font-extrabold tracking-tight text-foreground leading-none group-hover:text-primary transition-colors">
                C<span className="text-[#10D79E]">o</span>nnect
              </span>
              <span className="text-[8px] lg:text-[10px] uppercase tracking-[0.2em] font-bold text-primary mt-0.5 lg:mt-1 drop-shadow-[0_0_8px_rgba(19,146,80,0.35)]">
                Digital School
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-muted-foreground/80 hover:text-primary transition-all hover:translate-y-[-1px]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-4">
            {!isPending && (
              <>
                {isAuthenticated ? (
                  <>
                    <Button variant="ghost" asChild className="font-semibold text-muted-foreground">
                      <Link href="/dashboard" className="flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button
                      onClick={() => signOutAction()}
                      variant="outline"
                      className="rounded-full border-primary/20 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all font-bold px-6"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" asChild className="font-semibold">
                      <Link href="/auth/login">Entrar</Link>
                    </Button>
                    <Button className="rounded-full px-7 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all font-bold" asChild>
                      <Link href="/auth/register">Matricule-se</Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 -mr-2 text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden fixed inset-x-0 top-[64px] bg-background border-b border-border shadow-2xl transition-all duration-300 ease-in-out overflow-hidden z-40",
          isOpen ? "max-h-[calc(100vh-64px)] opacity-100 py-8" : "max-h-0 opacity-0 pointer-events-none"
        )}
      >
        <div className="px-6 space-y-6">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group flex items-center justify-between text-xl font-bold text-foreground/80 py-4 border-b border-border/30 last:border-0"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
                <ChevronRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
            ))}
          </nav>

          <div className="pt-6 flex flex-col gap-4">
            {isAuthenticated ? (
              <>
                <Button className="w-full rounded-2xl h-14 text-lg font-bold gradient-brand" asChild>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <LayoutDashboard className="w-5 h-5 mr-2" />
                    Meu Dashboard
                  </Link>
                </Button>
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    signOutAction();
                  }}
                  variant="outline"
                  className="w-full rounded-2xl h-14 text-lg font-bold text-red-500 border-red-200"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="w-full rounded-2xl h-14 text-lg font-bold border-2" asChild>
                  <Link href="/auth/login" onClick={() => setIsOpen(false)}>Entrar</Link>
                </Button>
                <Button className="w-full rounded-2xl h-14 text-lg font-bold gradient-brand shadow-xl shadow-primary/20" asChild>
                  <Link href="/auth/register" onClick={() => setIsOpen(false)}>Matricule-se Agora</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

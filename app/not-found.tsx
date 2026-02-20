"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 Illustration */}
        <div className="relative">
          <h1 className="text-[150px] md:text-[200px] font-bold text-muted/20 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-16 h-16 md:w-24 md:h-24 text-muted-foreground/40" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Página Não Encontrada
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Ops! A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg">
            <Link href="/" className="gap-2">
              <Home className="w-4 h-4" />
              Voltar para Home
            </Link>
          </Button>
          <Button variant="outline" size="lg" onClick={() => router.back()} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Página Anterior
          </Button>
        </div>

        {/* Suggestions */}
        <div className="pt-8 border-t">
          <p className="text-sm text-muted-foreground mb-4">
            Você pode estar procurando por:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href="/student/dashboard"
              className="text-sm px-4 py-2 rounded-md bg-muted hover:bg-muted/80 transition-colors"
            >
              Dashboard do Aluno
            </Link>
            <Link
              href="/teacher/dashboard"
              className="text-sm px-4 py-2 rounded-md bg-muted hover:bg-muted/80 transition-colors"
            >
              Dashboard do Professor
            </Link>
            <Link
              href="/student/courses"
              className="text-sm px-4 py-2 rounded-md bg-muted hover:bg-muted/80 transition-colors"
            >
              Cursos
            </Link>
            <Link
              href="/auth/login"
              className="text-sm px-4 py-2 rounded-md bg-muted hover:bg-muted/80 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

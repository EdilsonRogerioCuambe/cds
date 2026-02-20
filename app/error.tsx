"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <AlertTriangle className="w-16 h-16 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Algo deu errado!</h1>
          <p className="text-muted-foreground">
            Ocorreu um erro inesperado. Nossa equipe foi notificada.
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground font-mono mt-4">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Tentar Novamente
          </Button>
          <Button variant="outline" asChild>
            <Link href="/" className="gap-2">
              <Home className="w-4 h-4" />
              Voltar para Home
            </Link>
          </Button>
        </div>

        <div className="pt-6 border-t text-sm text-muted-foreground">
          <p>Se o problema persistir, entre em contato com o suporte.</p>
        </div>
      </div>
    </div>
  )
}

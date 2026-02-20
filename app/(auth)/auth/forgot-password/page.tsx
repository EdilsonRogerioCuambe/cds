"use client"

import { forgotPasswordAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, null)

  useEffect(() => {
    if (state?.success) {
      toast.success("E-mail de redefinição enviado! Verifique sua caixa de entrada.")
      router.push(`/auth/reset-password?email=${state.email}`)
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state, router])

  return (
    <div className="space-y-6">
      <Link
        href="/auth/login"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para o login
      </Link>

      <div className="space-y-2 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Mail className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold font-display tracking-tight text-[#132747]">
          Esqueceu a senha?
        </h1>
        <p className="text-muted-foreground">
          Digite seu e-mail e enviaremos um link para você redefinir sua senha.
        </p>
      </div>

      {state?.success ? (
        <div className="bg-green-50 border border-green-100 p-4 rounded-xl text-center">
          <p className="text-sm text-green-700 font-medium">
            Se existir uma conta vinculada ao e-mail informado, você receberá um link de redefinição em instantes.
          </p>
          <Button asChild variant="outline" className="mt-4 w-full border-green-200 text-green-700 hover:bg-green-100">
            <Link href="/auth/login">Voltar para o login</Link>
          </Button>
        </div>
      ) : (
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="nome@exemplo.com"
              type="email"
              required
              className="h-12"
              disabled={isPending}
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 rounded-xl text-base font-bold gradient-brand shadow-lg shadow-primary/20 transition-all mt-4"
          >
            {isPending ? "Enviando e-mail..." : "Enviar link de redefinição"}
          </Button>
        </form>
      )}
    </div>
  )
}

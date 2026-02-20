"use client"

import { resendVerificationAction, verifyEmailAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useActionState, useEffect, useState, useTransition } from "react"
import { toast } from "sonner"

export default function VerifyEmailPage() {
  const [value, setValue] = useState("")
  const [state, formAction, isPending] = useActionState(verifyEmailAction, null)
  const [isResending, startResendTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  useEffect(() => {
    if (state?.success) {
      toast.success("E-mail verificado com sucesso!")
      router.push("/student/dashboard") // Or login
    } else if (state?.error) {
      toast.error(typeof state.error === 'string' ? state.error : "Falha na verificação.")
    }
  }, [state, router])

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#10D79E]/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-[#10D79E]" />
            </div>
        </div>
        <h1 className="text-3xl font-bold font-display tracking-tight text-[#132747]">
          Verifique seu Email
        </h1>
        <p className="text-muted-foreground">
          Enviamos um código de 6 dígitos para {email || "seu e-mail"}. Digite-o abaixo para confirmar sua conta.
        </p>
      </div>

      <form action={formAction} className="space-y-6 flex flex-col items-center">
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="otp" value={value} />

        <div className="space-y-2 w-full flex flex-col items-center">
            <Label htmlFor="otp" className="sr-only">Código de Verificação</Label>
            <InputOTP
                maxLength={6}
                value={value}
                onChange={(value) => setValue(value)}
            >
                <InputOTPGroup className="gap-2">
                    <InputOTPSlot index={0} className="w-12 h-14 text-lg border-[#132747]/20 focus:border-[#10D79E] focus:ring-[#10D79E]" />
                    <InputOTPSlot index={1} className="w-12 h-14 text-lg border-[#132747]/20 focus:border-[#10D79E] focus:ring-[#10D79E]" />
                    <InputOTPSlot index={2} className="w-12 h-14 text-lg border-[#132747]/20 focus:border-[#10D79E] focus:ring-[#10D79E]" />
                    <InputOTPSlot index={3} className="w-12 h-14 text-lg border-[#132747]/20 focus:border-[#10D79E] focus:ring-[#10D79E]" />
                    <InputOTPSlot index={4} className="w-12 h-14 text-lg border-[#132747]/20 focus:border-[#10D79E] focus:ring-[#10D79E]" />
                    <InputOTPSlot index={5} className="w-12 h-14 text-lg border-[#132747]/20 focus:border-[#10D79E] focus:ring-[#10D79E]" />
                </InputOTPGroup>
            </InputOTP>
            <p className="text-xs text-muted-foreground mt-2">
                Não recebeu o código?{" "}
                <button
                    type="button"
                    disabled={isResending || isPending}
                    onClick={() => {
                        if (!email) {
                            toast.error("E-mail não encontrado.")
                            return
                        }
                        startResendTransition(async () => {
                            const result = await resendVerificationAction(email)
                            if (result.success) {
                                toast.success("Novo código enviado!")
                            } else {
                                toast.error(typeof result.error === 'string' ? result.error : "Erro ao reenviar.")
                            }
                        })
                    }}
                    className="text-[#10D79E] font-bold hover:underline disabled:opacity-50"
                >
                    {isResending ? "Enviando..." : "Reenviar"}
                </button>
            </p>
        </div>

        <Button
          type="submit"
          disabled={isPending || value.length < 6}
          className="w-full bg-[#132747] hover:bg-[#0F2A4A] text-white font-bold h-12 rounded-xl text-base shadow-lg shadow-[#132747]/20 transition-all"
        >
          {isPending ? "Verificando..." : "Verificar Email"}
        </Button>
      </form>

      <div className="text-center">
        <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-[#132747] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
      </div>
    </div>
  )
}

"use client"

import { resetPasswordAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { KeyRound } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"

export default function ResetPasswordPage() {
  const [value, setValue] = useState("")
  const [state, formAction, isPending] = useActionState(resetPasswordAction, null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  useEffect(() => {
    if (state?.success) {
      toast.success("Senha redefinida com sucesso! Você já pode entrar.")
      router.push("/auth/login")
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state, router])

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold font-display tracking-tight text-[#132747]">
          Nova Senha
        </h1>
        <p className="text-muted-foreground">
          Digite o código enviado para {email || "seu e-mail"} e sua nova senha.
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="token" value={value} />

        <div className="space-y-2 flex flex-col items-center">
            <Label htmlFor="token">Código de 6 dígitos</Label>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Nova Senha</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            required
            className="h-12"
            disabled={isPending}
          />
        </div>

        <Button
          type="submit"
          disabled={isPending || value.length < 6}
          className="w-full h-12 rounded-xl text-base font-bold gradient-brand shadow-lg shadow-primary/20 transition-all mt-4"
        >
          {isPending ? "Redefinindo..." : "Redefinir Senha"}
        </Button>
      </form>
    </div>
  )
}

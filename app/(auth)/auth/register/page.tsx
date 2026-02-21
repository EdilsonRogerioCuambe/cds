"use client"

import { signUpAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { UserRole } from "@/types/user"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(signUpAction, null)
  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      toast.success("Conta criada com sucesso!")
      router.push(`/auth/verify-email?email=${state.email}`)
      router.refresh()
    } else if (state?.error) {
      if (typeof state.error === "string") {
        toast.error(state.error)
      } else {
        toast.error("Por favor, corrija os erros no formulário.")
      }
    }
  }, [state, router])

  const getFieldError = (fieldName: string) => {
    if (state?.error && typeof state.error !== "string") {
      return (state.error as Record<string, string[]>)[fieldName]?.[0]
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold font-display tracking-tight text-[#132747]">
          Crie sua conta
        </h1>
        <p className="text-muted-foreground">
          Comece sua jornada para a fluência hoje mesmo
        </p>
      </div>

      <form action={formAction} className="space-y-4">

        <div className="space-y-2">
           <Label htmlFor="name">Nome Completo</Label>
           <Input
            id="name"
            name="name"
            placeholder="Seu nome"
            type="text"
            required
            disabled={isPending}
           />
           {getFieldError("name") && (
            <p className="text-xs text-red-500">{getFieldError("name")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="nome@exemplo.com"
            type="email"
            required
            disabled={isPending}
          />
          {getFieldError("email") && (
            <p className="text-xs text-red-500">{getFieldError("email")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Número de Celular</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="+258 84 123 4567 ou +55 11 91234 5678"
            type="tel"
            required
            disabled={isPending}
          />
          <p className="text-[10px] text-muted-foreground">
            Use o formato internacional com o código do país (ex: +258 para Moçambique, +55 para Brasil).
          </p>
          {getFieldError("phone") && (
            <p className="text-xs text-red-500">{getFieldError("phone")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Eu sou um...</Label>
          <Select name="role" defaultValue={UserRole.STUDENT}>
            <SelectTrigger id="role" className="h-12 rounded-xl">
              <SelectValue placeholder="Selecione seu perfil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UserRole.STUDENT}>Aluno</SelectItem>
              <SelectItem value={UserRole.TEACHER}>Professor / Instrutor</SelectItem>
            </SelectContent>
          </Select>
          {getFieldError("role") && (
            <p className="text-xs text-red-500">{getFieldError("role")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            disabled={isPending}
          />
          {getFieldError("password") && (
            <p className="text-xs text-red-500">{getFieldError("password")}</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-2 pt-2">
            <Checkbox id="terms" name="acceptTerms" required />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-opacity-70"
              >
                Aceito os{" "}
                <Link href="/docs/business-rules" className="text-[#10D79E] hover:underline">
                  termos e condições
                </Link>
              </Label>
              <p className="text-xs text-muted-foreground">
                Ao se registrar, você concorda com nossas políticas de uso.
              </p>
            </div>
          </div>
          {getFieldError("acceptTerms") && (
            <p className="text-xs text-red-500">{getFieldError("acceptTerms")}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#132747] hover:bg-[#0F2A4A] text-white font-bold h-12 rounded-xl text-base shadow-lg shadow-[#132747]/20 transition-all mt-4"
        >
          {isPending ? "Criando conta..." : "Criar Conta"}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Já tem uma conta?{" "}
        <Link href="/auth/login" className="font-bold text-[#10D79E] hover:underline">
          Fazer Login
        </Link>
      </div>
    </div>
  )
}

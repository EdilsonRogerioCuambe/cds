"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

const loginSchema = z.object({
  email: z.string().email("Insira um e-mail válido"),
  password: z.string().min(1, "A senha é obrigatória"),
  rememberMe: z.boolean().default(false),
})

type LoginFormValues = z.infer<typeof loginSchema>

const REMEMBER_ME_KEY = "cds_remember_email"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  // Load saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem(REMEMBER_ME_KEY)
    if (savedEmail) {
      form.setValue("email", savedEmail)
      form.setValue("rememberMe", true)
    }
  }, [form])

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await authClient.signIn.email({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      }, {
        onSuccess: () => {
          // Senior persistence logic: save email only if rememberMe is checked
          if (values.rememberMe) {
            localStorage.setItem(REMEMBER_ME_KEY, values.email)
          } else {
            localStorage.removeItem(REMEMBER_ME_KEY)
          }

          toast.success("Login realizado com sucesso!")
          router.push(callbackUrl)
          router.refresh()
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Erro ao fazer login.")
        }
      })
    } catch (err) {
      toast.error("Ocorreu um erro inesperado.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold font-display tracking-tight text-[#132747]">
          Bem-vindo de volta
        </h1>
        <p className="text-muted-foreground">
          Entre na sua conta para continuar seus estudos
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="nome@exemplo.com"
            type="email"
            disabled={form.formState.isSubmitting}
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-xs font-medium text-red-500">{form.formState.errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <Link
              href="/auth/forgot-password"
              className="text-sm font-medium text-[#10D79E] hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            disabled={form.formState.isSubmitting}
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-xs font-medium text-red-500">{form.formState.errors.password.message}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={form.watch("rememberMe")}
              onCheckedChange={(checked) => form.setValue("rememberMe", checked === true)}
            />
            <Label
              htmlFor="remember"
              className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                Lembrar de mim
            </Label>
        </div>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full bg-[#10D79E] hover:bg-[#0EB082] text-white font-bold h-12 rounded-xl text-base shadow-lg shadow-[#10D79E]/20 transition-all disabled:opacity-70"
        >
          {form.formState.isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Não tem uma conta?{" "}
        <Link href="/auth/register" className="font-bold text-[#132747] hover:underline">
          Matricule-se agora
        </Link>
      </div>
    </div>
  )
}

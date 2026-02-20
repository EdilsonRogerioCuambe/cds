"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, GraduationCap, ShieldAlert, User } from "lucide-react"
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

interface AuthPageProps {
  role: "STUDENT" | "TEACHER" | "ADMIN"
}

export default function SpecializedLoginPage({ role }: AuthPageProps) {
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

          toast.success("Acesso autorizado!")
          router.push(callbackUrl)
          router.refresh()
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Falha na autenticação.")
        }
      })
    } catch (err) {
      toast.error("Ocorreu um erro inesperado.")
    }
  }

  const roleConfig = {
    STUDENT: {
      title: "Área do Aluno",
      subtitle: "Acesse seus cursos e continue aprendendo",
      icon: <User className="w-10 h-10 text-[#10D79E]" />,
      color: "#10D79E",
    },
    TEACHER: {
      title: "Área do Instrutor",
      subtitle: "Gerencie suas aulas e acompanhe seus alunos",
      icon: <GraduationCap className="w-10 h-10 text-[#132747]" />,
      color: "#132747",
    },
    ADMIN: {
      title: "Painel de Administração",
      subtitle: "Acesso restrito para administradores do CDS",
      icon: <ShieldAlert className="w-10 h-10 text-red-500" />,
      color: "#ef4444",
    },
  }[role]


  return (
    <div className="space-y-6">
       <Link
        href="/auth/login"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors absolute top-8 left-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <div className="p-3 rounded-2xl bg-muted/50 border border-border/50 shadow-sm">
            {roleConfig.icon}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-[#132747]">
            {roleConfig.title}
          </h1>
          <p className="text-muted-foreground max-w-[280px] mx-auto">
            {roleConfig.subtitle}
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="nome@exemplo.com"
            type="email"
            disabled={form.formState.isSubmitting}
            className="h-12"
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
              Esqueceu?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            disabled={form.formState.isSubmitting}
            className="h-12"
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
          <Label htmlFor="remember" className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-opacity-70">
            Lembrar de mim
          </Label>
        </div>

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full h-12 rounded-xl text-base font-bold shadow-lg transition-all disabled:opacity-70"
          style={{
            backgroundColor: roleConfig.color,
            boxShadow: `0 10px 15px -3px ${roleConfig.color}33`
          }}
        >
          {form.formState.isSubmitting ? "Acessando..." : "Acessar Portal"}
        </Button>
      </form>

      <div className="text-center text-xs text-muted-foreground pt-4">
        Acesso protegido pelo sistema Connect Digital School.
      </div>
    </div>
  )
}

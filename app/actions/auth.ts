"use server"

import { auth } from "@/lib/auth-server"
import prisma from "@/lib/prisma"
import { UserRole } from "@/types/user"
import { isValidPhoneNumber } from "libphonenumber-js"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  rememberMe: z.boolean().optional(),
})

const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  phone: z.string().refine((val) => {
    try {
      return isValidPhoneNumber(val)
    } catch {
      return false
    }
  }, "Número de telefone inválido. Use o formato internacional (ex: +258..., +55...)"),
  role: z.nativeEnum(UserRole).default(UserRole.STUDENT),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "Você deve aceitar os termos e condições" }),
  }),
})

/**
 * Helper to translate Better Auth error messages
 */
const translateError = (message: string) => {
  if (!message) return message
  const msg = message.toLowerCase()
  if (msg.includes("invalid email or password") || msg.includes("invalid credentials")) return "E-mail ou senha inválidos"
  if (msg.includes("user already exists")) return "Este e-mail já está registrado"
  if (msg.includes("invalid otp") || msg.includes("invalid token")) return "Código de verificação inválido"
  if (msg.includes("expired otp") || msg.includes("expired token")) return "O código expirou. Peça um novo."
  if (msg.includes("user not found")) return "Usuário não encontrado"
  if (msg.includes("session expired")) return "Sua sessão expirou. Faça login novamente."
  if (msg.includes("too many requests")) return "Muitas tentativas. Tente novamente mais tarde."
  return message
}

/**
 * Server Action for User Login
 */
export async function signInAction(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  const validatedFields = loginSchema.safeParse({
    ...data,
    rememberMe: data.rememberMe === "on",
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password, rememberMe } = validatedFields.data

  try {
    const session = await auth.api.signInEmail({
      body: {
        email,
        password,
        rememberMe,
      },
    })

    if (!session) {
      return { error: "Credenciais inválidas" }
    }

    return { success: true }
  } catch (error: any) {
    return { error: translateError(error.message) || "Ocorreu um erro ao fazer login" }
  }
}

/**
 * Server Action for User Registration
 */
export async function signUpAction(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  console.log("[SignUpAction] Iniciando registro para:", data.email)

  const validatedFields = registerSchema.safeParse({
    ...data,
    acceptTerms: data.acceptTerms === "on",
  })

  if (!validatedFields.success) {
    console.log("[SignUpAction] Validação falhou:", validatedFields.error.flatten().fieldErrors)
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, email, password, role, phone } = validatedFields.data

  try {
    console.log("[SignUpAction] Chamando auth.api.signUpEmail...");
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        role,
        phone,
        termsAccepted: true,
        termsAcceptedAt: new Date().toISOString(),
      },
    })
    console.log("[SignUpAction] Registro bem-sucedido para:", email)
    return { success: true, email }
  } catch (error: any) {
    console.error("[SignUpAction] Erro no catch:", error.message || error)
    return { error: translateError(error.message) || "Ocorreu um erro ao criar conta" }
  }
}

/**
 * Server Action for User Logout
 */
export async function signOutAction() {
  try {
    await auth.api.signOut({
      headers: await headers()
    })
  } catch (error) {
    console.error("Sign out error:", error)
  }
  redirect("/auth/login")
}

/**
 * Server Action for Forgot Password
 */
export async function forgotPasswordAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) return { error: "E-mail é obrigatório" };

  try {
    await auth.api.forgetPasswordEmailOTP({
      body: { email }
    });
    return { success: true, email };
  } catch (error: any) {
    return { error: translateError(error.message) || "Ocorreu um erro ao processar sua solicitação" };
  }
}

/**
 * Server Action for Reset Password
 */
export async function resetPasswordAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const token = formData.get("token") as string;

  if (!password || password.length < 6) return { error: "Senha inválida" };
  if (!token) return { error: "Código inválido" };
  if (!email) return { error: "E-mail inválido" };

  try {
    await auth.api.resetPasswordEmailOTP({
      body: {
        password: password,
        otp: token,
        email: email
      }
    });
    return { success: true };
  } catch (error: any) {
    return { error: translateError(error.message) || "Não foi possível redefinir a senha" };
  }
}

/**
 * Server Action for Verify Email OTP
 */
export async function verifyEmailAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const otp = formData.get("otp") as string;

  if (!email) return { error: "E-mail é obrigatório" };
  if (!otp || otp.length < 6) return { error: "Código inválido" };

  try {
    await auth.api.verifyEmailOTP({
      body: {
        email,
        otp
      }
    });
    return { success: true };
  } catch (error: any) {
    return { error: translateError(error.message) || "Falha na verificação do e-mail" };
  }
}

/**
 * Server Action to Resend Verification OTP
 */
export async function resendVerificationAction(email: string) {
  console.log("[ResendAction] Solicitando novo e-mail para:", email);
  if (!email) return { error: "E-mail é obrigatório" };

  try {
    console.log("[ResendAction] Chamando auth.api.sendVerificationEmail...");
    await auth.api.sendVerificationEmail({
      body: { email }
    });
    console.log("[ResendAction] Solicitação aceita pelo Better Auth.");
    return { success: true };
  } catch (error: any) {
    console.error("[ResendAction] Erro no catch:", error.message || error);
    return { error: translateError(error.message) || "Falha ao reenviar o e-mail" };
  }
}

/**
 * Server Action to Approve a Teacher
 */
import { getTeacherApprovalEmail, getTeacherInviteEmail } from "@/lib/email-templates"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function approveTeacherAction(teacherId: string) {
    // 1. Verify if the current user is an admin (Security)
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session || session.user.role !== "ADMIN") {
        return { error: "Não autorizado" }
    }

    try {
        const user = await prisma.user.update({
            where: { id: teacherId },
            data: { status: "ACTIVE" }
        })

        if (!user) return { error: "Usuário não encontrado" }

        // Send Approval Email
        await resend.emails.send({
            from: "CDS <contato@ubuntuweblab.site>",
            to: user.email,
            subject: "Sua conta de instrutor foi aprovada! - CDS",
            html: getTeacherApprovalEmail(user.name || "Instrutor")
        })

        return { success: true }
    } catch (error: any) {
        console.error("[ApproveAction] Erro:", error)
        return { error: "Falha ao aprovar instrutor" }
    }
}

/**
 * Server Action to Invite a Teacher
 */
export async function inviteTeacherAction(email: string, name: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session || session.user.role !== "ADMIN") {
        return { error: "Não autorizado" }
    }

    try {
        // Create user via Better Auth or Prisma directly?
        // Better Auth is better for session/account consistency
        // But we want to send a custom invite link for onboarding
        
        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) return { error: "Este email já está cadastrado" }

        const user = await prisma.user.create({
            data: {
                email,
                name,
                role: "TEACHER",
                status: "PENDING",
                emailVerified: true // They will verify by setting password
            }
        })

        // Generate a reset password / setup link
        // Use sendVerificationEmail or similar if we want them to set password
        // Actually, for invitations, we can use forgetPassword if enabled
        // If not, we'll just send them to the login page with a "forgot password" direction
        // But let's try to use the correct Better Auth API
        
        // Trigger the forgotten password flow to send an OTP
        await auth.api.forgetPasswordEmailOTP({
            body: { email }
        })

        const url = `${process.env.NEXT_PUBLIC_APP_URL}/auth/onboarding?email=${encodeURIComponent(email)}`

        // Send Invite Email
        await resend.emails.send({
            from: "CDS <contato@ubuntuweblab.site>",
            to: email,
            subject: "Convite para Instrutor - CDS",
            html: getTeacherInviteEmail(name, url)
        })

        return { success: true }
    } catch (error: any) {
        console.error("[InviteAction] Erro:", error)
        return { error: "Falha ao enviar convite" }
    }
}

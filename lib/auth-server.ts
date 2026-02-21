import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { Resend } from "resend";
import { getOTPEmailTemplate } from "./email-templates";
import prisma from "./prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mongodb",
    }),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                const typeLabel = type === "email-verification" ? "Verificação de E-mail" : "Redefinição de Senha";
                console.log(`[EmailOTP] Tentando enviar email para: ${email} (Tipo: ${typeLabel})`);

                try {
                    const response = await resend.emails.send({
                        from: "CDS <auth@resend.dev>",
                        to: email,
                        subject: `${typeLabel} - CDS`,
                        html: getOTPEmailTemplate(otp, typeLabel),
                    });

                    if (response.error) {
                        console.error("[EmailOTP] Erro da API Resend:", response.error);
                    } else {
                        console.log("[EmailOTP] Email enviado com sucesso via Resend:", response.data);
                    }
                } catch (err) {
                    console.error("[EmailOTP] Erro fatal ao enviar email:", err);
                }
            },
            otpLength: 6,
            sendVerificationOnSignUp: true,
            expiresIn: 300, // 5 minutes
            overrideDefaultEmailVerification: true,
        }),
    ],
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "STUDENT",
                input: true,
            },
            phone: {
                type: "string",
                required: false,
                input: true,
            },
            status: {
                type: "string",
                required: false,
                defaultValue: "ACTIVE",
            },
            currentLevel: {
                type: "string",
                required: false,
            },
            xp: {
                type: "number",
                required: false,
            },
            streak: {
                type: "number",
                required: false,
            },
            termsAccepted: {
                type: "boolean",
                required: false,
                defaultValue: false,
            },
            termsAcceptedAt: {
                type: "string", // Better Auth handles dates as ISO strings often, or we use "date" if version supports
                required: false,
            }
        }
    },
    advanced: {
        database: {
            generateId: false,
        },
    },
});

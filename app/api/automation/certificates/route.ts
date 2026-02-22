import prisma from "@/lib/prisma"
import { normalizePhone } from "@/lib/utils"
import { NextRequest, NextResponse } from "next/server"

/**
 * Endpoint para consulta de certificados por telefone.
 * Retorna lista de certificados (Módulo ou Curso) disponíveis para o aluno.
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const phoneParam = searchParams.get("phone")

    if (!phoneParam) {
        return NextResponse.json({ error: "Phone is required" }, { status: 400 })
    }

    const phone = normalizePhone(phoneParam)

    try {
        const user = await prisma.user.findFirst({
            where: { phone },
            select: {
                id: true,
                certificates: {
                    include: {
                        module: { select: { title: true } },
                        course: { select: { title: true } }
                    },
                    orderBy: { issuedAt: "desc" }
                }
            }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        return NextResponse.json({
            count: user.certificates.length,
            certificates: user.certificates.map(cert => {
                const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cds.school"
                return {
                    code: cert.verificationCode,
                    type: cert.type,
                    title: cert.type === "MODULE" ? cert.module?.title : cert.course.title,
                    course: cert.course.title,
                    issuedAt: cert.issuedAt,
                    verifyUrl: `${baseUrl}/verify/${cert.verificationCode}`,
                    downloadUrl: `${baseUrl}/api/certificates/${cert.verificationCode}/pdf`
                }
            })
        })
    } catch (error) {
        console.error("[Automation Certificates API] Erro:", error)
        return NextResponse.json({ error: "Database error" }, { status: 500 })
    }
}

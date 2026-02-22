import { CertificateTemplate } from "@/components/certificate-template"
import prisma from "@/lib/prisma"
import { renderToBuffer } from "@react-pdf/renderer"
import { NextRequest, NextResponse } from "next/server"
import QRCode from "qrcode"
import React from "react"

/**
 * Endpoint para gerar o PDF do certificado no servidor.
 * Retorna o arquivo PDF diretamente.
 */
export async function GET(
    req: NextRequest,
    { params }: { params: { code: string } }
) {
    const { code } = params

    try {
        const certificate = await prisma.certificate.findUnique({
            where: { verificationCode: code },
            include: {
                user: { select: { name: true } },
                module: { select: { title: true, description: true } },
                course: { select: { title: true, description: true } }
            }
        })

        if (!certificate) {
            return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
        }

        const isModule = certificate.type === "MODULE"
        const title = isModule ? certificate.module?.title : certificate.course.title
        const description = isModule ? certificate.module?.description : certificate.course.description

        // Gerar QR Code no servidor
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cds.school"
        const qrUrl = await QRCode.toDataURL(`${baseUrl}/verify/${code}`)

        // Renderizar PDF para Buffer
        const buffer = await renderToBuffer(
            React.createElement(CertificateTemplate, {
                studentName: certificate.user.name || "Aluno",
                title: title || "Certificado",
                courseTitle: certificate.course.title,
                description: description || undefined,
                issueDate: certificate.issuedAt.toLocaleDateString('pt-BR'),
                verificationCode: certificate.verificationCode,
                qrDataUrl: qrUrl,
                type: certificate.type as "MODULE" | "COURSE"
            })
        )

        return new Response(new Uint8Array(buffer), {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="Certificado-${code}.pdf"`
            }
        })
    } catch (error) {
        console.error("[Certificate PDF API] Erro:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

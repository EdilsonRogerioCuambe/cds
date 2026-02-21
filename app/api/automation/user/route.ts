import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

/**
 * Endpoint para verificar existência de usuário via telefone.
 * Query Param: ?phone=+258...
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const phone = searchParams.get("phone")

    if (!phone) {
        return NextResponse.json({
            exists: false,
            error: "Parâmetro 'phone' é obrigatório."
        }, { status: 400 })
    }

    try {
        const user = await prisma.user.findFirst({
            where: { phone: phone },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                currentLevel: true,
                points: true,
                xp: true,
                streak: true,
                status: true,
                whatsappOptIn: true
            }
        })

        if (!user) {
            return NextResponse.json({
                exists: false,
                message: "Nenhum usuário encontrado com este telefone."
            })
        }

        return NextResponse.json({
            exists: true,
            user: user
        })
    } catch (error) {
        console.error("[Automation API] Erro ao buscar usuário:", error)
        return NextResponse.json({
            exists: false,
            error: "Erro interno ao processar a solicitação."
        }, { status: 500 })
    }
}

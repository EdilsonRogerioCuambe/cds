import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

/**
 * Endpoint para listagem completa de alunos.
 * Usado para automações de notificação (WhatsApp/Email).
 */
export async function GET() {
    try {
        const students = await prisma.user.findMany({
            where: { role: "STUDENT" },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                status: true,
                currentLevel: true,
                xp: true,
                points: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: "desc" }
        })

        return NextResponse.json({
            count: students.length,
            students: students.map(s => ({
                id: s.id,
                name: s.name,
                email: s.email,
                phone: s.phone,
                status: s.status,
                level: s.currentLevel,
                xp: s.xp,
                points: s.points,
                joinedAt: s.createdAt,
                lastActive: s.updatedAt
            }))
        })
    } catch (error) {
        console.error("[Automation Students API] Erro:", error)
        return NextResponse.json({
            error: "Erro interno ao listar alunos."
        }, { status: 500 })
    }
}

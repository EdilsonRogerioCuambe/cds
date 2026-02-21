import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

/**
 * Retorna o top 20 alunos por pontos.
 */
export async function GET() {
    try {
        const topStudents = await prisma.user.findMany({
            where: { role: "STUDENT" },
            orderBy: { points: "desc" },
            take: 20,
            select: {
                name: true,
                points: true,
                currentLevel: true,
                xp: true
            }
        })

        return NextResponse.json(topStudents)
    } catch (error) {
        return NextResponse.json({ error: "Database error" }, { status: 500 })
    }
}

import prisma from "@/lib/prisma"
import { normalizePhone } from "@/lib/utils"
import { NextRequest, NextResponse } from "next/server"

/**
 * Consulta de conquistas bloqueadas/desbloqueadas.
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const phoneParam = searchParams.get("phone")

    if (!phoneParam) return NextResponse.json({ error: "Phone required" }, { status: 400 })

    const phone = normalizePhone(phoneParam)

    try {
        const user = await prisma.user.findFirst({
            where: { phone },
            include: {
                userAchievements: {
                    include: { achievement: true }
                }
            }
        })

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

        return NextResponse.json(user.userAchievements.map(ua => ({
            id: ua.achievement.id,
            name: ua.achievement.name,
            description: ua.achievement.description,
            earnedAt: ua.earnedAt
        })))
    } catch (error) {
        return NextResponse.json({ error: "Database error" }, { status: 500 })
    }
}

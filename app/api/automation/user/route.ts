import prisma from "@/lib/prisma"
import { normalizePhone } from "@/lib/utils"
import { NextRequest, NextResponse } from "next/server"

/**
 * Consulta completa de perfil por telefone.
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const phoneParam = searchParams.get("phone")

    if (!phoneParam) {
        return NextResponse.json({ exists: false, error: "Phone is required" }, { status: 400 })
    }

    const phone = normalizePhone(phoneParam)

    try {
        const user = await prisma.user.findFirst({
            where: { phone: phone },
            include: {
                activityLogs: { take: 1, orderBy: { createdAt: "desc" } }
            }
        })

        if (!user) return NextResponse.json({ exists: false })

        return NextResponse.json({
            exists: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status,
                metrics: {
                    points: user.points,
                    xp: user.xp,
                    streak: user.streak,
                    level: user.currentLevel
                },
                lastActive: user.activityLogs[0]?.createdAt || user.updatedAt,
                terms: {
                    accepted: user.termsAccepted,
                    at: user.termsAcceptedAt
                }
            }
        })
    } catch (error) {
        return NextResponse.json({ exists: false, error: "Database error" }, { status: 500 })
    }
}

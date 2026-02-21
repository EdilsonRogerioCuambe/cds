import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

/**
 * Endpoints para monitoramento administrativo e gatilhos em massa.
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type") // "inactive" | "expiring" | "payments"

    try {
        if (type === "inactive") {
            const twoDaysAgo = new Date()
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

            const inactiveUsers = await prisma.user.findMany({
                where: {
                    role: "STUDENT",
                    status: "ACTIVE",
                    activityLogs: {
                        none: {
                            createdAt: { gte: twoDaysAgo }
                        }
                    }
                },
                select: { name: true, phone: true, email: true }
            })
            return NextResponse.json(inactiveUsers)
        }

        if (type === "expiring") {
            const nextWeek = new Date()
            nextWeek.setDate(nextWeek.getDate() + 7)

            const expiringEnrollments = await prisma.enrollment.findMany({
                where: {
                    status: "ACTIVE",
                    endDate: { lte: nextWeek, gte: new Date() }
                },
                include: {
                    user: { select: { name: true, phone: true } },
                    course: { select: { title: true } }
                }
            })
            return NextResponse.json(expiringEnrollments)
        }

        if (type === "payments") {
            const pendingPayments = await prisma.payment.findMany({
                where: { status: "PENDING" },
                include: {
                    user: { select: { name: true, phone: true } }
                }
            })
            return NextResponse.json(pendingPayments)
        }

        return NextResponse.json({ error: "Invalid monitoring type" }, { status: 400 })
    } catch (error) {
        return NextResponse.json({ error: "Database error" }, { status: 500 })
    }
}

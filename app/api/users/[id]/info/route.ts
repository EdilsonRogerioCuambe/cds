import { verifyApiKey } from "@/lib/api-auth"
import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

/**
 * Endpoint to fetch student details for n8n automations.
 * Returns progress, stats, and course info.
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!(await verifyApiKey())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                enrollments: {
                    include: {
                        course: {
                            select: {
                                id: true,
                                title: true,
                                level: true,
                            }
                        }
                    }
                },
                activityLogs: {
                    take: 5,
                    orderBy: { createdAt: "desc" }
                }
            }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Clean sensitive data before returning
        const { password, ...safeUser } = user as any

        return NextResponse.json(safeUser)
    } catch (error) {
        console.error("[User Info API] Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

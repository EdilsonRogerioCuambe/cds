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
                                modules: {
                                    orderBy: { order: "asc" },
                                    include: {
                                        lessons: {
                                            orderBy: { order: "asc" },
                                            select: {
                                                id: true,
                                                title: true,
                                                lessonType: true,
                                                published: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                progress: {
                    orderBy: { updatedAt: "desc" },
                    take: 1
                },
                activityLogs: {
                    take: 10,
                    orderBy: { createdAt: "desc" }
                }
            }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Clean sensitive data and flatten for n8n
        const { password, ...userData } = user as any

        return NextResponse.json({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            role: userData.role,
            status: userData.status,
            currentLevel: userData.currentLevel,
            points: userData.points,
            xp: userData.xp,
            streak: userData.streak,
            whatsappOptIn: userData.whatsappOptIn,
            lastActivity: userData.activityLogs[0] || null,
            currentEnrollment: userData.enrollments[0] || null,
            recentProgress: userData.progress[0] || null,
        })
    } catch (error) {
        console.error("[User Info API] Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

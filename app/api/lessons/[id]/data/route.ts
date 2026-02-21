import { verifyApiKey } from "@/lib/api-auth"
import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

/**
 * Endpoint to fetch lesson content and vocabulary for n8n processing.
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
        const lesson = await prisma.lesson.findUnique({
            where: { id },
            include: {
                module: {
                    include: {
                        course: {
                            select: {
                                id: true,
                                title: true,
                            }
                        }
                    }
                }
            }
        })

        if (!lesson) {
            return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
        }

        return NextResponse.json(lesson)
    } catch (error) {
        console.error("[Lesson Data API] Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

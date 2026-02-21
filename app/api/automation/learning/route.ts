import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

/**
 * Consulta de progresso e conteúdo por telefone.
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const phone = searchParams.get("phone")

    if (!phone) return NextResponse.json({ error: "Phone is required" }, { status: 400 })

    try {
        const user = await prisma.user.findFirst({
            where: { phone },
            include: {
                enrollments: {
                    include: { course: true },
                    where: { status: "ACTIVE" }
                },
                progress: {
                    orderBy: { updatedAt: "desc" },
                    take: 1,
                    include: {
                        lesson: {
                            include: { module: true }
                        }
                    }
                }
            }
        })

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

        const enrollment = user.enrollments[0]
        const lastProgress = user.progress[0]
        const lesson = lastProgress?.lesson

        return NextResponse.json({
            activeCourse: enrollment?.course ? {
                id: enrollment.course.id,
                title: enrollment.course.title,
                level: enrollment.course.level
            } : null,
            lastSession: lesson ? {
                id: lesson.id,
                title: lesson.title,
                module: lesson.module.title,
                content: lesson.content,
                vocabulary: lesson.vocabulary,
                completed: lastProgress.completed
            } : null
        })
    } catch (error) {
        return NextResponse.json({ error: "Database error" }, { status: 500 })
    }
}

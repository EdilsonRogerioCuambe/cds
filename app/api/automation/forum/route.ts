import prisma from "@/lib/prisma"
import { normalizePhone } from "@/lib/utils"
import { NextRequest, NextResponse } from "next/server"

/**
 * Consulta de atividade do fórum.
 * Sem telefone: Retorna últimos posts globais.
 * Com telefone: Retorna atividade do aluno.
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const phoneParam = searchParams.get("phone")
    const phone = phoneParam ? normalizePhone(phoneParam) : null

    try {
        if (phone) {
            const user = await prisma.user.findFirst({
                where: { phone },
                include: {
                    forumPosts: { take: 5, orderBy: { createdAt: "desc" } },
                    forumReplies: { take: 5, orderBy: { createdAt: "desc" } }
                }
            })
            if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
            return NextResponse.json({
                postsCount: user.forumPosts.length,
                repliesCount: user.forumReplies.length,
                latestPost: user.forumPosts[0] || null
            })
        }

        const recentPosts = await prisma.forumPost.findMany({
            take: 10,
            orderBy: { createdAt: "desc" },
            include: {
                author: { select: { name: true } }
            }
        })

        return NextResponse.json(recentPosts)
    } catch (error) {
        return NextResponse.json({ error: "Database error" }, { status: 500 })
    }
}

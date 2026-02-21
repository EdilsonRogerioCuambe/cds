import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

/**
 * Endpoint para obter o contexto completo do aluno via telefone.
 * Útil para alimentar IAs no n8n com conteúdo de aulas e progresso.
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const phone = searchParams.get("phone")

    if (!phone) {
        return NextResponse.json({
            exists: false,
            error: "Parâmetro 'phone' é obrigatório."
        }, { status: 400 })
    }

    try {
        // 1. Buscar usuário e suas relações principais
        const user = await prisma.user.findFirst({
            where: { phone: phone },
            include: {
                enrollments: {
                    where: { status: "ACTIVE" },
                    include: {
                        course: {
                            include: {
                                modules: {
                                    orderBy: { order: "asc" },
                                    select: {
                                        id: true,
                                        title: true,
                                        order: true
                                    }
                                }
                            }
                        }
                    }
                },
                progress: {
                    orderBy: { updatedAt: "desc" },
                    take: 1,
                    include: {
                        lesson: {
                            include: {
                                module: true
                            }
                        }
                    }
                }
            }
        })

        if (!user) {
            return NextResponse.json({
                exists: false,
                message: "Nenhum usuário encontrado com este telefone."
            })
        }

        const currentEnrollment = user.enrollments[0]
        const lastProgress = user.progress[0]
        const lastLesson = lastProgress?.lesson

        // 2. Montar objeto de resposta rico em dados
        return NextResponse.json({
            exists: true,
            student: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                level: user.currentLevel,
                stats: {
                    points: user.points,
                    xp: user.xp,
                    streak: user.streak
                }
            },
            context: {
                course: currentEnrollment?.course ? {
                    id: currentEnrollment.course.id,
                    title: currentEnrollment.course.title,
                    level: currentEnrollment.course.level,
                    modulesCount: currentEnrollment.course.modules.length
                } : null,
                lastLesson: lastLesson ? {
                    id: lastLesson.id,
                    title: lastLesson.title,
                    type: lastLesson.lessonType,
                    content: lastLesson.content, // Conteúdo bruto para IA resumir
                    vocabulary: lastLesson.vocabulary,
                    moduleTitle: lastLesson.module.title,
                    completed: lastProgress.completed,
                    updatedAt: lastProgress.updatedAt
                } : null
            }
        })
    } catch (error) {
        console.error("[Automation Context API] Erro:", error)
        return NextResponse.json({
            exists: false,
            error: "Erro interno ao processar os dados do aluno."
        }, { status: 500 })
    }
}

import { verifyApiKey } from "@/lib/api-auth"
import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

/**
 * AI Chat Proxy for WhatsApp.
 * Injects student context and forwards to Gemini.
 */
export async function POST(req: NextRequest) {
    if (!(await verifyApiKey())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { userId, message } = await req.json()

        if (!userId || !message) {
            return NextResponse.json({ error: "Missing userId or message" }, { status: 400 })
        }

        // 1. Fetch Student Context
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                enrollments: {
                    include: {
                        course: true
                    }
                }
            }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const currentCourse = user.enrollments[0]?.course
        const level = user.currentLevel || "Beginner"

        // 2. Build System Prompt with Context
        const systemPrompt = `
Você é o assistente de aprendizado da CDS (Connect Digital School).
Seu objetivo é ajudar o aluno a praticar e tirar dúvidas via WhatsApp.

CONTEXTO DO ALUNO:
- Nome: ${user.name}
- Nível: ${level}
- Curso Atual: ${currentCourse?.title || "Nenhum curso ativo"}

REGRAS:
1. Seja amigável, motivador e conciso (máximo 3 parágrafos).
2. Use emojis ocasionalmente para manter o tom leve.
3. Se o aluno perguntar algo fora do contexto de idiomas ou da plataforma, gentilmente direcione-o de volta.
4. Use o nome do aluno ocasionalmente.
`.trim()

        // 3. Forward to Gemini API (using environment variable key)
        const geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY
        if (!geminiApiKey) {
            return NextResponse.json({ error: "AI service not configured" }, { status: 500 })
        }

        // Call Gemini 1.5 Flash (Base implementation)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${systemPrompt}\n\nPergunta do Aluno: ${message}`
                    }]
                }]
            })
        })

        const data = await response.json()
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Desculpe, não consegui processar sua dúvida agora."

        return NextResponse.json({ response: aiResponse })
    } catch (error) {
        console.error("[AI Chat Proxy] Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

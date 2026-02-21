import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "")
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

export async function generateAIResponse(prompt: string, context: string = "") {
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
        console.error("[AI] Gemini API Key missing")
        return { success: false, error: "API Key missing" }
    }

    const fullPrompt = `
Contexto do Sistema: Você é um assistente de aprendizado da plataforma CDS (Connect Digital School).
Regras:
1. Responda de forma concisa e amigável (máximo 3 parágrafos).
2. Use emojis ocasionalmente para tornar a conversa leve.
3. Se não souber a resposta baseada no contexto, peça ao aluno para consultar o professor no fórum.
4. Responda apenas sobre o conteúdo da plataforma e idiomas.

Contexto Adicional:
${context}

Dúvida do Aluno:
${prompt}
`

    try {
        const result = await model.generateContent(fullPrompt)
        const response = await result.response
        const text = response.text()

        return { success: true, text }
    } catch (error) {
        console.error("[AI] Error generating content:", error)
        return { success: false, error }
    }
}

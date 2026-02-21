import { verifyApiKey } from "@/lib/api-auth"
import { NextRequest, NextResponse } from "next/server"

/**
 * Proxy route to send WhatsApp messages via Evolution API.
 * Requires CDS_API_KEY for authorization.
 */
export async function POST(req: NextRequest) {
    if (!(await verifyApiKey())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { number, text, mediaUrl, mediaType } = body

        if (!number || !text) {
            return NextResponse.json({ error: "Missing number or text" }, { status: 400 })
        }

        const evolutionUrl = process.env.EVOLUTION_API_URL
        const evolutionApiKey = process.env.EVOLUTION_API_KEY
        const instanceName = process.env.EVOLUTION_INSTANCE_NAME

        if (!evolutionUrl || !evolutionApiKey || !instanceName) {
            console.error("[WhatsApp Send] Evolution API config missing")
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
        }

        // Evolution API v2 endpoint for text
        const response = await fetch(`${evolutionUrl}/message/sendText/${instanceName}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": evolutionApiKey
            },
            body: JSON.stringify({
                number,
                text,
                linkPreview: true
            })
        })

        const data = await response.json()
        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.error("[WhatsApp Send] Error sending message:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

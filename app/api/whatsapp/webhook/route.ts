import { NextRequest, NextResponse } from "next/server"

/**
 * Webhook endpoint for Evolution API v2.
 * Receives messages, status updates, and connection events.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        // Log incoming webhook for debugging/audit
        console.log("[WhatsApp Webhook] Received event:", body.event)

        // Here you would typically forward this to n8n or process directly
        // For now, we just acknowledge receipt to avoid Evolution API retries

        return NextResponse.json({ success: true, message: "Webhook received" }, { status: 200 })
    } catch (error) {
        console.error("[WhatsApp Webhook] Error processing request:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

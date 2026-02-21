const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || ""
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || ""
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE || "Main"

export async function sendWhatsAppMessage(to: string, text: string) {
    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) {
        console.error("[WhatsApp] Evolution API configuration missing")
        return { success: false, error: "Configuration missing" }
    }

    // Format number to E.164 if needed, but we assume it's already sanitized
    const cleanNumber = to.replace(/\D/g, "")

    try {
        const response = await fetch(`${EVOLUTION_API_URL}/message/sendText/${EVOLUTION_INSTANCE}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": EVOLUTION_API_KEY,
            },
            body: JSON.stringify({
                number: cleanNumber,
                options: {
                    delay: 1200,
                    presence: "composing",
                    linkPreview: true,
                },
                textMessage: {
                    text: text,
                },
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            console.error("[WhatsApp] Error sending message:", data)
            return { success: false, error: data }
        }

        return { success: true, data }
    } catch (error) {
        console.error("[WhatsApp] Fatal error:", error)
        return { success: false, error }
    }
}

export async function sendWhatsAppMedia(to: string, caption: string, mediaUrl: string, type: "image" | "video" | "document" = "image") {
    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) {
        console.error("[WhatsApp] Evolution API configuration missing")
        return { success: false, error: "Configuration missing" }
    }

    const cleanNumber = to.replace(/\D/g, "")

    try {
        const response = await fetch(`${EVOLUTION_API_URL}/message/sendMedia/${EVOLUTION_INSTANCE}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": EVOLUTION_API_KEY,
            },
            body: JSON.stringify({
                number: cleanNumber,
                options: {
                    delay: 1200,
                    presence: "composing",
                },
                mediaMessage: {
                    mediatype: type,
                    caption: caption,
                    media: mediaUrl,
                },
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            console.error("[WhatsApp] Error sending media:", data)
            return { success: false, error: data }
        }

        return { success: true, data }
    } catch (error) {
        console.error("[WhatsApp] Fatal error sending media:", error)
        return { success: false, error }
    }
}

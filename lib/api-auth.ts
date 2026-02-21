import { headers } from "next/headers"

/**
 * Verifies the CDS_API_KEY in the request headers.
 */
export async function verifyApiKey() {
    const headersList = await headers()
    const apiKey = headersList.get("x-api-key")
    const internalKey = process.env.CDS_API_KEY

    if (!internalKey) {
        console.error("CDS_API_KEY is not defined in environment variables")
        return false
    }

    return apiKey === internalKey
}

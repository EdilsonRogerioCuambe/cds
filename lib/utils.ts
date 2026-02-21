import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(hours: number): string {
  if (hours === 0) return "0 min"

  if (hours < 1) {
    const minutes = Math.round(hours * 60)
    return `${minutes} min`
  }

  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)

  return m > 0 ? `${h}h ${m}m` : `${h}h`
}
export function normalizePhone(phone: string): string {
  if (!phone) return ""

  // URL encoding often turns '+' into ' '
  let cleaned = phone.trim()

  // Handle case where phone might be encoded as space
  if (cleaned.startsWith(" ")) cleaned = "+" + cleaned.trim()

  if (!cleaned.startsWith("+")) {
     const digits = cleaned.replace(/\D/g, "")
     // Default to 258 only if it looks like a local MZ number (9 digits)
     if (digits.length === 9) {
       return `+258${digits}`
     }
     return `+${digits}`
  }

  // Already has +, just strip non-essential chars
  return "+" + cleaned.replace(/\D/g, "")
}

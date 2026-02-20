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

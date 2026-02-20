/**
 * Curated time formatting utilities for the educational platform.
 */

/**
 * Formats a duration in seconds into a localized string (e.g., "1h 30m", "45m").
 */
export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0m"

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`.trim()
  }

  return `${minutes}m`
}

/**
 * Formats a large duration into days or weeks if applicable.
 */
export function formatStudyTime(seconds: number): string {
  if (!seconds || seconds <= 0) return "N/A"

  const hours = seconds / 3600

  if (hours >= 168) { // 1 week
    const weeks = (hours / 168).toFixed(1)
    return `${weeks.replace(".0", "")} ${Number(weeks) === 1 ? "semana" : "semanas"}`
  }

  if (hours >= 24) { // 1 day
    const days = (hours / 24).toFixed(1)
    return `${days.replace(".0", "")} ${Number(days) === 1 ? "dia" : "dias"}`
  }

  return formatDuration(seconds)
}

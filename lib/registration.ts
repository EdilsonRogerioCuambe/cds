/**
 * Utility to generate a unique registration number (matrícula)
 * Format: CDS + 6 digits (e.g., CDS123456)
 */
export function generateRegistrationNumber(): string {
    const letters = "CDS";
    const numbers = Math.floor(100000 + Math.random() * 900000); // 6 digits
    return `${letters}${numbers}`;
}

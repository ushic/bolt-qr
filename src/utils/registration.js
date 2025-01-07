/**
 * Generates a random 6-digit registration code
 * @returns {string} A 6-digit code
 */
export function generateRegistrationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

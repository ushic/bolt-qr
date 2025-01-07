/**
 * Masks a card number showing only first 6 and last 4 digits
 * @param {string} cardNumber The full card number
 * @returns {string} Masked card number
 */
export function maskCardNumber(cardNumber) {
  const cleaned = cardNumber.replace(/\D/g, '')
  if (cleaned.length < 10) return cleaned
  
  const first6 = cleaned.slice(0, 6)
  const last4 = cleaned.slice(-4)
  const middle = '*'.repeat(6) // Always use 6 asterisks for consistent masking
  
  // Format: 123456******3456
  return `${first6}${middle}${last4}`
}

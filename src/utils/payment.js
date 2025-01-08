/**
 * Generates a random number of specified length
 * @param {number} length The length of random number to generate
 * @returns {string} Random number as string
 */
export function generateRandomNumber(length) {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10)
  }
  return result
}

/**
 * Gets the next sequence number and increments it
 * @returns {string} 6-digit sequence number
 */
export function getNextSequence() {
  const key = 'paymentSequence'
  let sequence = parseInt(localStorage.getItem(key) || '0')
  sequence = (sequence + 1) % 1000000 // Reset after 999999
  
  // Store the incremented value
  localStorage.setItem(key, sequence.toString())
  
  // Return padded 6-digit string
  return sequence.toString().padStart(6, '0')
}

/**
 * Formats current date as YYYYMMDD
 * @returns {string} Formatted date
 */
export function getCurrentDate() {
  const date = new Date()
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}${month}${day}`
}

/**
 * Formats current time as HHMMSS
 * @returns {string} Formatted time
 */
export function getCurrentTime() {
  const date = new Date()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return `${hours}${minutes}${seconds}`
}

/**
 * Masks a card number, keeping first 6 and last 4 digits visible
 * @param {string} cardNumber Full card number
 * @returns {string} Masked card number
 */
export function maskCardNumber(cardNumber) {
  const cleaned = cardNumber.replace(/\D/g, '')
  //if (cleaned.length < 10) return cleaned // Return as is if too short
  
  const first6 = cleaned.slice(0, 6)
  const last4 = cleaned.slice(-4)
  const maskedLength = 6//cleaned.length - 10
  if (maskedLength <= 0) return `${first6}${last4}`
  
  return `${first6}${'*'.repeat(maskedLength)}${last4}`
}

/**
 * Formats payment data according to protocol specification
 * @param {Object} params Payment parameters
 * @returns {string} Formatted payment string
 */
export function formatPaymentData({
  serialNumber,
  amount,
  cardNumber
}) {
  return [
		'txn',
    //serialNumber,
    amount,
    getCurrentDate(),
    getCurrentTime(),
    generateRandomNumber(12),
    getNextSequence(),
    '00',
    maskCardNumber(cardNumber)
  ].join('|')
}

/**
 * Validates and parses QR code data according to the specified format
 * @param {string} data - Raw QR code data
 * @returns {Object} Parsed data object or null if invalid
 */
export function parseQrData(data) {
  if (!data || typeof data !== 'string') return null

  const parts = data.split('|')
  if (parts.length !== 8) return null

  const [serialNumber, terminalNo, merchantNo, merchantName, amount, date, time, end ] = parts

  // Validate amount is numeric
  if (!/^\d+$/.test(amount)) return null

	// Extract first 8 digits of the date 
	const date8Digits = date.slice(0, 8)
	
  // Validate date format (MMDD)
  //if (!/^(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/.test(date)) return null

	// Validate date format (YYYYMMDD)
 if (!/^(14|15)\d\d(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/.test(date8Digits)) return null;


  // Validate time format (HHMMSS)
  if (!/^([01]\d|2[0-3])([0-5]\d)([0-5]\d)$/.test(time)) return null

  return {
    serialNumber,
		terminalNo,
		merchantNo,
		merchantName,
    amount: parseInt(amount),
    date: formatDate(date8Digits),
    time: formatTime(time),
    raw: data
  }
}

function formatDate(yyyymmdd) {
  const year = yyyymmdd.slice(0, 4);
  const month = yyyymmdd.slice(4, 6);
  const day = yyyymmdd.slice(6);
  return `${year}/${month}/${day}`;
}


function formatTime(hhmmss) {
  const hours = hhmmss.slice(0, 2)
  const minutes = hhmmss.slice(2, 4)
  const seconds = hhmmss.slice(4)
  return `${hours}:${minutes}:${seconds}`
}

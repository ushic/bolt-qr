/**
 * Appends the MQTT path to a connection URL
 * @param {string} url - The base connection URL
 * @returns {string} The URL with /mqtt appended correctly
 */
export function appendMqttPath(url) {
  if (!url) return url
  
  // Remove trailing slash if present
  const baseUrl = url.endsWith('/') ? url.slice(0, -1) : url
  
  // Append /mqtt
  return `${baseUrl}/mqtt`
}

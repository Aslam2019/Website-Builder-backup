/**
 * Build a wa.me link that opens WhatsApp with a pre-filled message.
 */
export function buildWhatsAppLink(rawNumber, message = '') {
  if (!rawNumber) return null
  const digits = String(rawNumber).replace(/\D/g, '')
  if (!digits) return null

  // If 10-digit Indian number, prepend 91
  const withCC = digits.length === 10 ? `91${digits}` : digits

  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${withCC}${text}`
}
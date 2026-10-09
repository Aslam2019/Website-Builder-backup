export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || '')
export const isMobile = (v) => /^[6-9]\d{9}$/.test((v || '').trim())
export const isUrl = (v) => /^https?:\/\/.+/.test(v || '')
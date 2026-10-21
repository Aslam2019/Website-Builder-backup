/* ============================================================
   ✅ TEMPLATE STANDALONE VERSION
   S3 la host aagum — no .env file
   ============================================================ */

/* Default uploads base — CDN URL */
export const DEFAULT_UPLOADS_BASE = 'https://cdn.yourdomain.com/uploads'

/* Get uploads base from config.json (runtime) */
export function getUploadsBase(config) {
  if (config && config.uploads_base) return config.uploads_base
  if (typeof window !== 'undefined' && window.__UPLOADS_BASE__) {
    return window.__UPLOADS_BASE__
  }
  return DEFAULT_UPLOADS_BASE
}

/* Static export — for backward compatibility */
export const UPLOADS_BASE = DEFAULT_UPLOADS_BASE
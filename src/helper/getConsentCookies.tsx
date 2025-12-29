export const CONSENT_COOKIE_PREFIX = 'consent:'

export type ConsentCookieMap = Record<string, boolean>

/**
 * 🍪 Alle von uns gesetzten Consent-Cookies
 */
export function getAllConsentCookies(): ConsentCookieMap {
  if (typeof document === 'undefined') {return {}}

  return document.cookie
    .split('; ')
    .filter(row => row.startsWith(CONSENT_COOKIE_PREFIX))
    .reduce<ConsentCookieMap>((acc, cookie) => {
      const [key, value] = cookie.split('=')
      const service = key.replace(CONSENT_COOKIE_PREFIX, '')
      acc[service] = value === 'true'
      return acc
    }, {})
}

/**
 * ❌ Optional: Alle Consents löschen
 */
export function clearAllConsents() {
  if (typeof document === 'undefined') {return}

  document.cookie
    .split('; ')
    .filter(row => row.startsWith(CONSENT_COOKIE_PREFIX))
    .forEach(cookie => {
      const key = cookie.split('=')[0]
      document.cookie = `${key}=; path=/; max-age=0`
    })
}

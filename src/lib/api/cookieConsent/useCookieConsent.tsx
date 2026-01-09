import { useEffect, useState } from 'react'

interface UseCookieConsentOptions {
  service: string
  maxAgeSeconds?: number
}
export const CONSENT_COOKIE_PREFIX = 'consent:'

export function useCookieConsent({
  service,
  maxAgeSeconds = 60 * 60 * 24 * 365,
}: UseCookieConsentOptions) {
  const cookieKey = `${CONSENT_COOKIE_PREFIX}${service}`

  const [isAllowed, setIsAllowed] = useState(false)
  const [rememberDecision, setRememberDecision] = useState(false)

  useEffect(() => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${cookieKey}=`))

    if (cookieValue?.split('=')[1] === 'true') {
      setIsAllowed(true)
    }
  }, [cookieKey])

  const allow = () => {
    if (rememberDecision) {
      document.cookie = `${cookieKey}=true; path=/; max-age=${maxAgeSeconds}`
    }
    setIsAllowed(true)
  }

  const setConsent = (value: boolean) => {
    document.cookie = `${cookieKey}=${value}; path=/; max-age=${maxAgeSeconds}`
  }

  return {
    isAllowed,
    rememberDecision,
    setRememberDecision,
    allow,
    setConsent
  }
}

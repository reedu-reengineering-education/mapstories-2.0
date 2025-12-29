import { useEffect, useState } from 'react'

interface UseCookieConsentOptions {
  cookieKey: string
  maxAgeSeconds?: number
}

export function useCookieConsent({
  cookieKey,
  maxAgeSeconds = 60 * 60 * 24 * 365, // default: 1 Jahr
}: UseCookieConsentOptions) {
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

  return {
    isAllowed,
    rememberDecision,
    setRememberDecision,
    allow,
  }
}

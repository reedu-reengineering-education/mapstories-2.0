'use client'

import { useEffect, useState } from 'react'
import { isBfdwHostname } from '@/src/lib/site'

// Client-side check whether the app is served on the BFDW subdomain.
// Resolved in an effect to avoid hydration mismatches (false on first render).
export function useIsBfdwSite() {
  const [isBfdw, setIsBfdw] = useState(false)

  useEffect(() => {
    setIsBfdw(isBfdwHostname(window.location.hostname))
  }, [])

  return isBfdw
}

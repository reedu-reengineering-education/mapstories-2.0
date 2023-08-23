'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

// checks if route has changed (currently only for resetting the theme)
export const useNavigationEvent = (onPathnameChange: () => void) => {
  const pathname = usePathname() // Get current route
  const splitPath = pathname ? pathname.split('/')[2] : ''
  // Save pathname on component mount into a REF
  const savedPathNameRef = useRef(splitPath)

  useEffect(() => {
    // If REF has been changed, do the stuff
    if (savedPathNameRef.current !== splitPath) {
      onPathnameChange()
      // Update REF
      savedPathNameRef.current = splitPath
    }
  }, [pathname, onPathnameChange])
}

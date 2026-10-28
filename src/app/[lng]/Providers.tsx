'use client'

import axios from '@/src/lib/axios'
// import { SWRLogger } from '@/src/lib/SWRLogger'
import { ReactNode } from 'react'
import { SWRConfig } from 'swr'
import { Toaster } from '@/src/lib/toast'
import { useEffect } from 'react'
// import { useUIStore } from '@/src/lib/store/ui'
import { useBoundStore } from '@/src/lib/store/store'
// import { useTranslation } from '../i18n/client'
import { useNavigationEvent } from '@/src/helper/useNavigationEvent'
import { applyTheme } from '@/src/helper/applyTheme'
import { getSiteFromHost } from '@/src/lib/site'
import { getBaseThemeForSite } from '@/src/lib/theme'

export default function Providers({
  children,
  lng,
}: {
  children: ReactNode
  lng: string
}) {
  const setLanguage = useBoundStore(state => state.setLanguage)

  function setBaseTheme() {
    const site = getSiteFromHost(
      typeof window !== 'undefined' ? window.location.hostname : undefined,
    )
    applyTheme(getBaseThemeForSite(site))
  }

  //reapply base theme on route change (might need to be changed later if we allow theming of the whole website)
  useNavigationEvent(() => setBaseTheme())

  // useNavigationEvent only fires on subsequent route changes, not on the
  // initial page load, so the site-specific base theme needs to be applied
  // here too, otherwise the SCSS hardcoded default (Standard) sticks until
  // the user navigates.
  useEffect(() => {
    setBaseTheme()
  }, [])

  useEffect(() => {
    setLanguage(lng)
  }, [lng])

  return (
    <SWRConfig
      value={{
        fetcher: url => axios.get(url).then(res => res.data),
        revalidateOnFocus: false,
        // use: [SWRLogger],
      }}
    >
      {children}
      <Toaster position="bottom-right" />
    </SWRConfig>
  )
}

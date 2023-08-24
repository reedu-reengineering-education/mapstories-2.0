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

export default function Providers({
  children,
  lng,
}: {
  children: ReactNode
  lng: string
}) {
  const setLanguage = useBoundStore(state => state.setLanguage)

  function setBaseTheme() {
    applyTheme({
      name: 'Standard',
      shadow_color: 'rgba(56,56.58, 0.9)',
      border: '3px solid #38383a',
      box_shadow: '4px 4px 0px var(--shadow-color)',
      border_radius: '10px',
      text_color: '#38383a',
      button_color: '#38383a',
      background_color: 'white',
    })
  }

  //reapply base theme on route change (might need to be changed later if we allow theming of the whole website)
  useNavigationEvent(() => setBaseTheme())

  useEffect(() => {
    setLanguage(lng)
  }, [lng])

  return (
    <SWRConfig
      value={{
        fetcher: url => axios.get(url).then(res => res.data),
        revalidateOnFocus: false,
        // @ts-ignore
        // use: [SWRLogger],
      }}
    >
      {children}
      <Toaster position="bottom-right" />
    </SWRConfig>
  )
}

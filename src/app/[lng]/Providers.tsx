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

export default function Providers({
  children,
  lng,
}: {
  children: ReactNode
  lng: string
}) {
  const setLanguage = useBoundStore(state => state.setLanguage)

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

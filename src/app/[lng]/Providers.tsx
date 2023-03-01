'use client'

import axios from '@/src/lib/axios'
// import { SWRLogger } from '@/src/lib/SWRLogger'
import { ReactNode } from 'react'
import { SWRConfig } from 'swr'
import { Toaster } from '@/src/lib/toast'

export default function Providers({ children }: { children: ReactNode }) {
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

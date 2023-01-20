'use client'

import axios from '@/lib/axios'
import { ReactNode } from 'react'
import { SWRConfig } from 'swr'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: url => axios.get(url).then(res => res.data),
      }}
    >
      {children}
    </SWRConfig>
  )
}

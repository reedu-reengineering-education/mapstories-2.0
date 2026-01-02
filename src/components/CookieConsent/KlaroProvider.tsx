'use client'

import { useEffect } from 'react'
import * as klaro from 'klaro'
import 'klaro/dist/klaro.css'
import { klaroConfig } from '@/src/klaro.config'

export default function KlaroProvider() {
  useEffect(() => {
    klaro.setup(klaroConfig)
  }, [])

  return null
}
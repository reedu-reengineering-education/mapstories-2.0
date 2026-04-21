'use client'

import { useEffect } from 'react'

export default function KlaroProvider() {
  useEffect(() => {
    // Dynamically import klaro and config only on the client
    Promise.all([
      import('klaro'),
      import('klaro/dist/klaro.css'),
      import('@/src/klaro.config')
    ]).then(([klaro, _, config]) => {
      if (klaro && config.klaroConfig) {
        klaro.setup(config.klaroConfig)
      }
    }).catch((error) => {
      console.error('Failed to load Klaro:', error)
    })
  }, [])

  return null
}
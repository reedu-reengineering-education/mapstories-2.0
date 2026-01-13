'use client'

import { useEffect } from 'react'
import * as klaro from 'klaro'

const UMAMI_ID = 'b05f27c8-dc51-4d85-bb5e-faaa183ff3ff'
const UMAMI_SRC = 'https://umami.mapstories.de/script.js'

export default function UmamiLoader() {
  useEffect(() => {
    const loadUmami = () => {
      const manager = klaro.getManager()

      if (!manager) {return}

      if (manager.getConsent('umami')) {
        if (document.getElementById('umami-script')) {return}

        const script = document.createElement('script')
        script.id = 'umami-script'
        script.src = UMAMI_SRC
        script.async = true
        script.setAttribute('data-website-id', UMAMI_ID)

        document.body.appendChild(script)
      }
    }

    // Initial check
    loadUmami()

    // Reagiert auf Änderungen im Banner
    window.addEventListener('klaroConsentChanged', loadUmami)

    return () => {
      window.removeEventListener('klaroConsentChanged', loadUmami)
    }
  }, [])

  return null
}

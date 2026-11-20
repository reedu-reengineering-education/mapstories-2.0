'use client'

import { useParams } from 'next/navigation'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { useBoundStore } from '@/src/lib/store/store'

// Language for Mapbox map labels. Mapbox only reads it when the map is
// created, so prefer the [lng] route segment: the persisted store value is
// only synced from the route after the first render.
export function useMapLanguage() {
  const params = useParams()
  const storeLanguage = useBoundStore(state => state.language)
  const routeLanguage = typeof params?.lng === 'string' ? params.lng : undefined

  const lng = routeLanguage || storeLanguage
  return languages.includes(lng) ? lng : fallbackLng
}

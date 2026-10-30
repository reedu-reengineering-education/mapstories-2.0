export const MAP_STYLES = {
  streets: {
    label: 'Straßenkarte',
    url: 'mapbox://styles/mapbox/streets-v12',
  },
  satellite: {
    label: 'Satellit',
    url: 'mapbox://styles/prefect42/cmvtf3xda006d01s27ybkg6un',
  },
  hybrid: {
    label: 'Satellit mit Beschriftung',
    url: 'mapbox://styles/mapbox/satellite-streets-v12',
  },
  light: {
    label: 'Helle Karte',
    url: 'mapbox://styles/mapbox/light-v11',
  },
} as const

export type MapStyleName = keyof typeof MAP_STYLES

export const MAP_STYLE_ENTRIES = Object.entries(MAP_STYLES) as [
  MapStyleName,
  (typeof MAP_STYLES)[MapStyleName],
][]

export const DEFAULT_MAP_STYLE = MAP_STYLE_ENTRIES[0][0]

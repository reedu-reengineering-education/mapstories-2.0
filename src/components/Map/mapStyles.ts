const mapTilerKey = encodeURIComponent(
  process.env.NEXT_PUBLIC_MAPTILER_KEY || '',
)

export const MAP_STYLES = {
  streets: {
    label: 'Straßenkarte',
    url: 'mapbox://styles/mapbox/streets-v12',
  },
  satellite: {
    label: 'Satellit',
    url: `https://api.maptiler.com/maps/satellite/style.json?key=${mapTilerKey}`,
  },
  hybrid: {
    label: 'Satellit mit Beschriftung',
    url: `https://api.maptiler.com/maps/hybrid/style.json?key=${mapTilerKey}`,
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

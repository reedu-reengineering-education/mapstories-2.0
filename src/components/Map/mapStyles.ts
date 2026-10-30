export const MAP_STYLES = {
  streets: 'mapbox://styles/mapbox/streets-v12',
  satellite: 'mapbox://styles/prefect42/cmvtf3xda006d01s27ybkg6un',
  hybrid: 'mapbox://styles/mapbox/satellite-streets-v12',
} as const

export type MapStyleName = keyof typeof MAP_STYLES

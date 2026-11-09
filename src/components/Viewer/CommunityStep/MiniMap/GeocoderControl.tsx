import { ControlPosition, useControl } from 'react-map-gl'
import { useEffect } from 'react'
import maplibregl from 'maplibre-gl'
// resolve import error
const MaplibreGeocoder = require('@maplibre/maplibre-gl-geocoder')
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css'

const geocoder_api = {
  forwardGeocode: async (config: any) => {
    const features = []
    try {
      const request = `https://nominatim.openstreetmap.org/search?q=${config.query}&format=geojson&polygon_geojson=1&addressdetails=1`
      const response = await fetch(request)
      const geojson = await response.json()
      for (const feature of geojson.features) {
        const center = [
          feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
          feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2,
        ]
        const point = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: center,
          },
          place_name: feature.properties.display_name,
          properties: feature.properties,
          text: feature.properties.display_name,
          place_type: ['place'],
          center: center,
        }
        features.push(point)
      }
    } catch (e) {
      console.error(`Failed to forwardGeocode with error: ${e}`)
    }

    return {
      features: features,
    }
  },
}

type GeocoderControlProps = {
  position?: ControlPosition
  language?: string
  placeholder?: string
  onResult?: (_e: { result: MapboxGeocoder.Result }) => void
  onClear?: (_e: { query: string }) => void
}

export default function GeocoderControl(props: GeocoderControlProps) {
  const control = useControl(
    () => {
      const control = new MaplibreGeocoder(geocoder_api, {
        mapboxgl: maplibregl,
        showResultsWhileTyping: true,
        language: props.language,
        placeholder: props.placeholder,
      })

      control.on('result', props.onResult)
      control.on('clear', props.onClear)
      return control
    },
    {
      position: props.position ?? 'top-right',
    },
  )

  // the control is only created once, keep placeholder/language in sync
  useEffect(() => {
    if (props.language) {
      control.setLanguage(props.language)
    }
    control.setPlaceholder(props.placeholder)
  }, [control, props.language, props.placeholder])

  return null
}

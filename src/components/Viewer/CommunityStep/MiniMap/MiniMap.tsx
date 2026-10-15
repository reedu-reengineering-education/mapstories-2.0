'use client'

import { Marker, Map as ReactMap } from 'react-map-gl'
import GeocoderControl from './GeocoderControl'
import { useEffect, useState } from 'react'
import { useMapLanguage } from '@/src/lib/hooks/useMapLanguage'

type Props = {
  handleAddLocation: any
  stepSuggestion: any
}

export default function MiniMap({ handleAddLocation, stepSuggestion }: Props) {
  const [marker, setMarker] = useState<any>(null)
  const language = useMapLanguage()

  useEffect(() => {
    if (stepSuggestion?.feature) {
      setMarker(stepSuggestion.feature)
    }
  }, [stepSuggestion])

  const handleRemovePoint = () => {}
  return (
    <ReactMap
      initialViewState={{
        longitude: 7.5,
        latitude: 51.5,
        zoom: 3,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      onClick={e => {
        const lng = e.lngLat.lng
        const lat = e.lngLat.lat
        const point = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
        }
        setMarker(point)
        handleAddLocation(point)
      }}
      mapboxAccessToken={`${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`}
      // @ts-expect-error mapbox-gl supports `language`, the typings don't
      language={language}
    >
      <GeocoderControl
        language={language}
        onClear={handleRemovePoint}
        onResult={async e => {
          const [lng, lat] = e.result.geometry.coordinates
          const point = {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
            properties: e.result.properties,
          }
          setMarker(point)
          handleAddLocation(point)
          // this would only update the step that was selected when the component got FIRST initialized
          // await updateStep({ feature: point as any })
        }}
        position="top-left"
      />
      {/* only do this when the marker is not null */}
      {marker && (
        <Marker
          color="green"
          draggable={true}
          latitude={marker.geometry.coordinates[1]}
          longitude={marker.geometry.coordinates[0]}
        ></Marker>
      )}
    </ReactMap>
  )
}

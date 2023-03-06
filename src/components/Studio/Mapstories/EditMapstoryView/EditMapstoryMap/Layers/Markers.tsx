import { useEffect, useState } from 'react'
import {
  CircleLayer,
  Layer,
  Marker,
  MarkerDragEvent,
  Source,
} from 'react-map-gl'
import { StepMarker } from '..'

const triggerHoverLayerStyle: CircleLayer = {
  id: 'point',
  type: 'circle',
  paint: {
    'circle-radius': 30,
    'circle-opacity': 0,
    'circle-translate': [0, -12],
  },
}

type Props = {
  markers: StepMarker[]
  onClick: (_m: StepMarker) => void
  onChange: (_e: mapboxgl.MapLayerMouseEvent | MarkerDragEvent) => void
}

export default function Markers({ markers, onClick, onChange }: Props) {
  const [triggerHoverLayerData, setTriggerHoverLayerData] = useState<
    GeoJSON.FeatureCollection | undefined
  >()

  useEffect(() => {
    // this layer triggers the onhover method
    setTriggerHoverLayerData({
      type: 'FeatureCollection',
      features:
        markers?.map(m => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [m.longitude, m.latitude],
          },
          properties: {
            stepId: m.stepId,
          },
        })) ?? [],
    })
  }, [markers])

  return (
    <>
      {markers.map((m, i) => (
        <Marker
          {...m}
          key={(i + 1) * Math.random() * 100}
          onClick={() => onClick(m)}
          onDragEnd={onChange}
          style={{
            padding: '10px',
          }}
        ></Marker>
      ))}
      <Source data={triggerHoverLayerData} type="geojson">
        <Layer {...triggerHoverLayerStyle} id="step-hover" />
      </Source>
    </>
  )
}

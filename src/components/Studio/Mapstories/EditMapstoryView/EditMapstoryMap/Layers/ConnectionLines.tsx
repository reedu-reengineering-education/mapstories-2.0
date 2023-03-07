import { LineLayer } from 'mapbox-gl'
import { useEffect, useState } from 'react'
import { Layer, Source } from 'react-map-gl'
import { StepMarker } from '..'
import { splitMarkers } from '../../splitMarkers'

const lineStyle: LineLayer = {
  id: 'lines',
  type: 'line',
  paint: {
    'line-color': '#d4da68',
    'line-width': 5,
  },
}

export default function ConnectionLines({
  markers,
}: {
  markers: StepMarker[]
}) {
  const [lineData, setLineData] = useState<
    GeoJSON.FeatureCollection | undefined
  >()

  // generate Line string
  useEffect(() => {
    const markerGroups = splitMarkers(markers)
    const features: GeoJSON.Feature[] = markerGroups
      .filter(group => group.length > 1)
      .map(group => ({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: group.map(m => [m.longitude, m.latitude]),
        },
      }))

    setLineData({
      type: 'FeatureCollection',
      features,
    })
  }, [markers])

  return (
    <Source data={lineData} id="linesource" type="geojson">
      <Layer {...lineStyle} />
    </Source>
  )
}

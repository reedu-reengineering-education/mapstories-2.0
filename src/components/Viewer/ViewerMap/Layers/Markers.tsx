import { useBoundStore } from '@/src/lib/store/store'
import { StepMarker } from '@/src/types/Stepmarker'
import { usePathname, useRouter } from 'next/navigation'
import { Fragment, useEffect, useState } from 'react'
import { CircleLayer, Layer, Marker, Source } from 'react-map-gl'

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
}

export default function Markers({ markers }: Props) {
  const [triggerHoverLayerData, setTriggerHoverLayerData] = useState<
    GeoJSON.FeatureCollection | undefined
  >()

  const path = usePathname()
  const selectedStepIndex = useBoundStore(state => state.selectedStepIndex)
  const router = useRouter()

  useEffect(() => {
    // TODO: Either use splitmarker function here or make sure only valid stories make it to the viewer?
    // const markerGroups = splitMarkers(markers);

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

  // Berechnung der Markerfarbe basierend auf `selectedStepIndex`
  const getMarkerColor = (m: StepMarker) => {
    if (selectedStepIndex === undefined) {
      return m.color
    }
    if (selectedStepIndex === m.position) {
      return 'var(--active-color-border)'
    }
    if (m.tags?.includes('community')) {
      return 'green'
    }
    if (selectedStepIndex > m.position) {
      return 'var(--inactive-color-border)'
    }
    if (selectedStepIndex < m.position) {
      return m.color
    }
    return m.color
  }

  return (
    <>
      {markers.map((m, i) => (
        <Fragment key={i + '_fragment1'}>
          {m && (
            <Fragment key={i + 'fragment2'}>
              <Marker
                {...m}
                color={getMarkerColor(m)}
                key={`${m.position}_${selectedStepIndex}_marker`}
                onClick={() => {
                  const pathLocal =
                    path?.split('/').splice(2, 4).join('/') ??
                    'gallery/all/story/'
                  router.push(`/${pathLocal}/${m.position}`)
                }}
                // rotationAlignment='horizon'
                style={{
                  zIndex: selectedStepIndex == m.position ? 10 : 0,
                  padding: '10px',
                  cursor: 'pointer',
                }}
              ></Marker>
              <Marker
                {...m}
                key={i + '_text'}
                offset={[0, 18]}
                // onClick={() => onClick(m)}
                style={{
                  padding: '10px',
                }}
              >
                {selectedStepIndex == m.position && (
                  <h3 className="label-shadow" key={i + 'h3'}>
                    {m.position + 1}. {m.title}{' '}
                  </h3>
                )}
                {selectedStepIndex != m.position && <h3 key={i + 'h3'}></h3>}
              </Marker>
            </Fragment>
          )}
        </Fragment>
      ))}
      <Source data={triggerHoverLayerData} type="geojson">
        <Layer {...triggerHoverLayerStyle} id="step-hover" />
      </Source>
    </>
  )
}

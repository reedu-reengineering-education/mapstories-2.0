import { useBoundStore } from '@/src/lib/store/store'
import { StepMarker } from '@/src/types/Stepmarker'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
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
  onClick?: (_m: StepMarker) => void
}

export default function Markers({ markers, onClick }: Props) {
  const [triggerHoverLayerData, setTriggerHoverLayerData] = useState<
    GeoJSON.FeatureCollection | undefined
  >()
  const path = usePathname()
  const selectedStepIndex = useBoundStore(state => state.selectedStepIndex)
  const storyID = useBoundStore(state => state.storyID)
  const filter = path?.split('/') ? path.split('/')[3].split('-') : ['all']
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

  return (
    <>
      {markers.map((m, i) => (
        <>
          {m && (
            <>
              <Marker
                {...m}
                // className={
                //   selectedStepIndex != undefined &&
                //   selectedStepIndex >= m.position
                //     ? selectedStepIndex == m.position
                //       ? 'z-50'
                //       : ' '
                //     : ' '
                // }
                color={
                  selectedStepIndex != undefined &&
                  selectedStepIndex >= m.position
                    ? selectedStepIndex == m.position
                      ? 'var(--active-color-border)'
                      : 'var(--inactive-color-border)'
                    : m.color
                }
                key={(i + 1) * Math.random() * 100}
                onClick={() => {
                  const pathLocal =
                    path?.split('/').splice(2, 4).join('/') ??
                    'gallery/all/story/'
                  router.push(`${pathLocal}/${m.position + 1}`)
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
                  <h3 className="label-shadow">
                    {m.position + 1}. {m.title}{' '}
                  </h3>
                )}
                {selectedStepIndex != m.position && <h3></h3>}
              </Marker>
            </>
          )}
        </>
      ))}
      <Source data={triggerHoverLayerData} type="geojson">
        <Layer {...triggerHoverLayerStyle} id="step-hover" />
      </Source>
    </>
  )
}

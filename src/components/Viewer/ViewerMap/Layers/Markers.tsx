import { useStoryStore } from '@/src/lib/store/story'
import { StepMarker } from '@/src/types/Stepmarker'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CircleLayer, Layer, Marker, Source } from 'react-map-gl'

// import eric from '@/assets/images/eric.png';
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
  const selectedStepIndex = useStoryStore(state => state.selectedStepIndex)
  const storyID = useStoryStore(state => state.storyID)

  const router = useRouter()

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
        <>
          <Marker
            {...m}
            color={
              selectedStepIndex && selectedStepIndex >= m.position
                ? selectedStepIndex == m.position
                  ? '#eb5933'
                  : '#d4da68'
                : m.color
            }
            key={(i + 1) * Math.random() * 100}
            onClick={() => router.push(`/viewer/story/${storyID}/${m.position}`)}
            // rotationAlignment='horizon'
            style={{
              padding: '10px',
            }}
          >
          </Marker>
          <Marker
            {...m}
            key={i + '_text'}
            offset={[0, 18]}
            // onClick={() => onClick(m)}
            style={{
              padding: '10px',
            }}
          >
            <h3 className="label-shadow">
              {m.position}. {m.title}{' '}
            </h3>
          </Marker>
        </>
      ))}
      <Source data={triggerHoverLayerData} type="geojson">
        <Layer {...triggerHoverLayerStyle} id="step-hover" />
      </Source>
    </>
  )
}

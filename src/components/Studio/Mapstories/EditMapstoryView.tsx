'use client'

import DrawControl from '@/src/components/Map/DrawControl'
import { Story, StoryStep } from '@prisma/client'
import { StudioHeader } from '../Header'
import { StudioShell } from '../Shell'
import Map from '@/src/components/Map'
import { useStoryStore } from '@/src/lib/store/story'
import { useEffect, useState } from 'react'
import { Marker, MarkerDragEvent } from 'react-map-gl'
import { updateStoryStep } from '@/src/lib/api/step/updateStep'
import { usePathname } from 'next/navigation'
import { Layer, Source } from 'react-map-gl'
import { Feature } from 'geojson'
// import { LineString } from 'geojson'
import { useRouter } from 'next/navigation'

type EditMapstoryViewProps = {
  story: Story
  steps: StoryStep[] | undefined
}

export default function EditMapstoryView({
  story,
  steps,
}: EditMapstoryViewProps) {
  const path = usePathname()
  const stepId = path?.split('/').at(-1)
  const updateStory = useStoryStore(state => state.updateStory)
  const [markerCoords, setMarkerCoords] = useState<number[] | undefined>()
  const router = useRouter()
  const addMarker = async (
    e: mapboxgl.MapLayerMouseEvent | MarkerDragEvent,
  ) => {
    setMarkerCoords([e.lngLat.lng, e.lngLat.lat])
    const storyId = await story.id
    if (stepId && storyId) {
      const response = await updateStoryStep(storyId, stepId, {
        feature: {
          point: {
            latitude: e.lngLat.lat as number,
            longitude: e.lngLat.lng as number,
          },
        },
      })
    }
  }

  const markers: any[] = []
  function getMarkers() {
    if (!steps) {
      return
    }
    steps.forEach(s => {
      if (s.feature) {
        if (s.feature['point' as keyof typeof s.feature]) {
          const point = JSON.parse(
            JSON.stringify(s.feature['point' as keyof typeof s.feature]),
          )
          markers.push({ longitude: point.longitude, latitude: point.latitude })
        }
      }
    })
    return markers
  }

  const lineStyle = {
    id: 'lines',
    type: 'line' as 'sky',
    paint: {
      'line-color': 'blue',
      'line-width': 10,
    },
  }

  let lineData = {}

  const createLineData = () => {
    lineData = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: markers.map(m => {
          return [m.longitude, m.latitude]
        }),
      },
    }
    return lineData
  }

  const moveToStoryStep = (coords: { latitude: number; longitude: number }) => {
    const matchingStep = steps?.find(
      step =>
        //@ts-ignore
        step.feature.point.latitude === coords.latitude &&
        //@ts-ignore
        step.feature.point.longitude === coords.longitude,
    )
    if (matchingStep) {
      router.push(`/studio/${story.name}/${matchingStep.id}`)
    }
  }

  useEffect(() => {
    updateStory(story)
    getMarkers()
    createLineData()
  }, [])

  return (
    <StudioShell>
      <StudioHeader heading={story.name || ''} text={story.id} />
      <div className="re-studio-height-full-screen absolute top-0 z-10 w-full overflow-hidden rounded-lg shadow">
        {markerCoords === undefined && (
          <p className="top-15 absolute z-20 w-full text-center text-sm text-black">
            Klicke auf die Karte um deinen Marker hinzuzufügen
          </p>
        )}
        <Map onClick={e => addMarker(e)}>
          <DrawControl
            controls={{
              polygon: true,
              point: true,
              trash: true,
            }}
            displayControlsDefault={false}
            position="top-left"
          />
          {markerCoords != undefined && (
            <Marker
              draggable
              latitude={markerCoords[1]}
              longitude={markerCoords[0]}
              onDragEnd={e => addMarker(e)}
            ></Marker>
          )}
          {getMarkers() &&
            markers.map((m, i) => {
              return (
                <Marker
                  key={i}
                  latitude={m.latitude as number}
                  longitude={m.longitude as number}
                  onClick={() =>
                    moveToStoryStep({
                      latitude: m.latitude as number,
                      longitude: m.longitude as number,
                    })
                  }
                ></Marker>
              )
            })}
          {getMarkers() && markers.length >= 2 && createLineData() && (
            <Source data={lineData as Feature} id="linesource" type="geojson">
              {/* @ts-ignore */}
              <Layer {...lineStyle} />
            </Source>
          )}
        </Map>
      </div>
    </StudioShell>
  )
}

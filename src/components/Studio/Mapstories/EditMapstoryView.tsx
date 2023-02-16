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
import slugify from 'slugify'

type EditMapstoryViewProps = {
  story: Story
  steps: StoryStep[] | undefined
  stateMarkers: MarkerProps[]
}

interface MarkerProps {
  latitude: number
  longitude: number
  color: string
  key: string
}

export default function EditMapstoryView({
  story,
  steps,
  stateMarkers
}: EditMapstoryViewProps) {

  const currentStory = useStoryStore(state => state.story)
  const updateStory = useStoryStore(state => state.updateStory)
  const patchStoryStep = useStoryStore(state => state.patchStoryStep)
  const [currentStep, setCurrentStep] = useState<StoryStep | undefined>()
  const [markerCoords, setMarkerCoords] = useState<number[] | undefined>()
  const [markers, setMarkers] = useState<MarkerProps[]>([])
  const router = useRouter()

  const path = usePathname()
  const stepId = path?.split('/').at(-1)
  // const index = steps?.findIndex(step => step.id === stepId)
  // if (index) {
  //   setCurrentStep(steps?.slice()[index]);
  // }

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
      patchStoryStep(response.data);
      // getMarkers();
    }
  }

  function getMarkers() {
    setMarkers(prevMarkers => []);
    const newMarkers: MarkerProps[] = [...[]];
    if (!currentStory?.steps) {
      return
    }
    currentStory.steps.forEach(s => {
      if (s.feature) {
        if (s.feature['point' as keyof typeof s.feature]) {
          const point = JSON.parse(
            JSON.stringify(s.feature['point' as keyof typeof s.feature]),
          )
          const newMarker: MarkerProps = {
            color: currentStep?.id === s.id ? '#eb5933' : '#85bd41',
            longitude: point.longitude,
            latitude: point.latitude,
            key: s.id,
          }
          // setMarkers(prevMarkers => [...prevMarkers, newMarker])
          newMarkers.push(newMarker)
        }
      }
    })
    setMarkers([...newMarkers])
    // createLineData();
  }

  const lineStyle = {
    id: 'lines',
    type: 'line' as 'sky',
    paint: {
      'line-color': '#d4da68',
      'line-width': 5,
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
    if (matchingStep && story.name) {
      router.push(`/studio/${slugify(story.name)}/${matchingStep.id}`)
    }
  }

  // load story into zustand. TODO: is this the right place to do so?
  useEffect(() => {
    updateStory(story)
  }, [])

  useEffect(() => {
    getMarkers()
    createLineData()
  }, [currentStory])

  useEffect(() => {
    const index = steps?.findIndex(step => step.id === path?.split('/').at(-1))
    if (index) {
      setCurrentStep(steps?.slice()[index]);
    }
  }, [path])

  useEffect(() => {
    getMarkers();
  }, [currentStep])

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
          {markers.map((m, i) => {
            return (
              <>
                <div>
                  {m.color}
                </div>
                <Marker
                  color={m.color}
                  // TODO: find not hacky way to do this, but markers dont update if not with the random o_O
                  // key={(i + 1)}
                  key={(i + 1) * Math.random() * 100}
                  latitude={m.latitude as number}
                  longitude={m.longitude as number}
                  onClick={() =>
                    moveToStoryStep({
                      latitude: m.latitude as number,
                      longitude: m.longitude as number,
                    })
                  }
                ></Marker>
              </>
            )
          })}
          {markers.length >= 2 && createLineData() && (
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

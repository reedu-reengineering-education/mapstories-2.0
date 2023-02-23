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
import { FeatureCollection } from 'geojson'
// import { LineString } from 'geojson'
import { useRouter } from 'next/navigation'
import { useHoverMarkerStore } from '@/src/lib/store/hoverMarker'

type EditMapstoryViewProps = {
  story: Story
  steps: StoryStep[] | undefined
}

interface MarkerProps {
  latitude: number
  longitude: number
  color: string
  key: string
  draggable: boolean
  position: number
}

export default function EditMapstoryView({
  story,
  steps,
}: EditMapstoryViewProps) {
  const currentStory = useStoryStore(state => state.story)
  const updateStory = useStoryStore(state => state.updateStory)
  const patchStoryStep = useStoryStore(state => state.patchStoryStep)
  const [currentStep, setCurrentStep] = useState<StoryStep | undefined>()
  const [markerCoords, setMarkerCoords] = useState<number[] | undefined>()
  const [dragged, setDragged] = useState<number>(0)
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
      patchStoryStep(response.data)
    }
  }

  function getMarkers() {
    setMarkers(prevMarkers => [])
    const newMarkers: MarkerProps[] = [...[]]
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
            draggable: currentStep?.id === s.id,
            color: currentStep?.id === s.id ? '#eb5933' : '#85bd41',
            longitude: point.longitude,
            latitude: point.latitude,
            key: s.id,
            position: s.position,
          }
          newMarkers.push(newMarker)
        }
      }
    })
    setMarkers([...newMarkers])
  }

  const lineStyle = {
    id: 'lines',
    type: 'line' as 'sky',
    paint: {
      'line-color': '#d4da68',
      'line-width': 5,
    },
  }

  const splitMarkers = (markers: MarkerProps[]) => {
    if (!markers || markers.length === 0) {
      return []
    }

    const groups = []
    let currentGroup = [markers[0]]

    for (let i = 1; i < markers.length; i++) {
      const prevMarker = markers[i - 1]
      const currMarker = markers[i]

      if (currMarker.position === prevMarker.position + 1) {
        currentGroup.push(currMarker)
      } else {
        groups.push(currentGroup)
        currentGroup = [currMarker]
      }
    }

    if (currentGroup.length > 0) {
      groups.push(currentGroup)
    }

    return groups
  }

  let lineData = {}

  const createLineData = () => {
    const markerGroups = splitMarkers(markers)
    const features = markerGroups
      .filter(group => group.length > 1)
      .map(group => ({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: group.map(m => [m.longitude, m.latitude]),
        },
      }))
    return (lineData = {
      type: 'FeatureCollection',
      features,
    })
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
      router.push(`/studio/${story.slug}/${matchingStep.id}`)
    }
  }
  const markerId = useHoverMarkerStore(state => state.markerId)
  const setMarkerId = useHoverMarkerStore(state => state.setMarkerId)

  const handleMouseMove = (e: mapboxgl.MapLayerMouseEvent) => {
    markers.forEach(m => {
      if (
        m.latitude.toFixed(2) === e.lngLat.lat.toFixed(2) &&
        m.longitude.toFixed(2) === e.lngLat.lng.toFixed(2)
      ) {
        setMarkerId(m.key)
      }
    })
  }

  // load story into zustand. TODO: is this the right place to do so?
  useEffect(() => {
    updateStory(story)
  }, [])

  useEffect(() => {
    getMarkers()
    createLineData()
  }, [currentStory, dragged])

  useEffect(() => {
    const index = steps?.findIndex(step => step.id === path?.split('/').at(-1))
    if (index) {
      setCurrentStep(steps?.slice()[index])
    }
  }, [path])

  useEffect(() => {
    getMarkers()
  }, [currentStep])

  return (
    <StudioShell>
      <StudioHeader heading={story.name || ''} text={story.id} />
      <div className="re-studio-height-full-screen absolute top-0 z-10 w-full overflow-hidden rounded-lg shadow">
        {markerCoords === undefined && !currentStep?.feature && (
          <p className="top-15 absolute z-20 w-full text-center text-sm text-black">
            Klicke auf die Karte um deinen Marker hinzuzufügen
          </p>
        )}
        {currentStep?.feature && (
          <p className="top-15 absolute z-20 w-full text-center text-sm text-black">
            Verschiebe den roten Marker um dessen Position zu ändern
          </p>
        )}

        <Map
          onClick={e => {
            if (!currentStep?.feature) {
              addMarker(e)
            }
          }}
          onMouseOver={handleMouseMove}
        >
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
              latitude={markerCoords[1]}
              longitude={markerCoords[0]}
              onDragEnd={e => addMarker(e)}
            ></Marker>
          )}
          {markers.map((m, i) => {
            return (
              <>
                <div>{m.color}</div>
                <Marker
                  color={m.color}
                  draggable={m.draggable}
                  // TODO: find not hacky way to do this, but markers dont update if not with the random o_O
                  key={(i + 1) * Math.random() * 100}
                  latitude={m.latitude as number}
                  longitude={m.longitude as number}
                  onClick={() =>
                    moveToStoryStep({
                      latitude: m.latitude as number,
                      longitude: m.longitude as number,
                    })
                  }
                  onDragEnd={async e => {
                    await addMarker(e)
                    setDragged(prev => prev++)
                  }}
                ></Marker>
                <Marker
                  // anchor={'top-right'}
                  key={`${i}-label`}
                  latitude={m.latitude as number}
                  longitude={m.longitude as number}
                >
                  <div className="absolute h-2 w-2">{m.position}</div>
                </Marker>
              </>
            )
          })}
          {markers.length >= 2 && createLineData() && (
            <Source
              data={lineData as FeatureCollection}
              id="linesource"
              type="geojson"
            >
              {/* @ts-ignore */}
              <Layer {...lineStyle} />
            </Source>
          )}
        </Map>
      </div>
    </StudioShell>
  )
}

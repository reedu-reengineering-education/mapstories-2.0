'use client'

import DrawControl from '@/src/components/Map/DrawControl'
import { Story, StoryStep } from '@prisma/client'
import { StudioShell } from '../Shell'
import Map from '@/src/components/Map'
import { useStoryStore } from '@/src/lib/store/story'
import { useEffect, useState } from 'react'
import { Marker, MarkerDragEvent } from 'react-map-gl'
import { usePathname } from 'next/navigation'
import { Layer, Source } from 'react-map-gl'
import { FeatureCollection } from 'geojson'
// import { LineString } from 'geojson'
import { useRouter } from 'next/navigation'
import useStep from '@/src/lib/api/step/useStep'
import useStory from '@/src/lib/api/story/useStory'
import { Spinner } from '../../Elements/Spinner'

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
  const [currentStep, setCurrentStep] = useState<StoryStep>()
  const [markerCoords, setMarkerCoords] = useState<number[]>()
  const [dragged, setDragged] = useState(0)
  const [markers, setMarkers] = useState<MarkerProps[]>([])
  const router = useRouter()

  const path = usePathname()
  const stepId = path?.split('/').at(-1)

  const { story: currentStory, updateStory } = useStory(story.id)
  const { updateStep } = useStep(story.id, stepId!)

  const addMarker = async (
    e: mapboxgl.MapLayerMouseEvent | MarkerDragEvent,
  ) => {
    setMarkerCoords([e.lngLat.lng, e.lngLat.lat])

    const point: GeoJSON.Feature<GeoJSON.Point> = {
      type: 'Feature',
      geometry: {
        coordinates: [e.lngLat.lng, e.lngLat.lat],
        type: 'Point',
      },
      properties: {},
    }

    await updateStep({
      feature: JSON.stringify(point),
    })
  }

  function getMarkers() {
    setMarkers(_prevMarkers => [])
    const newMarkers: MarkerProps[] = []
    if (!currentStory?.steps) {
      return
    }
    currentStory.steps.map(({ id, feature, position }) => {
      const geoFeature = feature as unknown as GeoJSON.Feature<GeoJSON.Point>
      if (geoFeature?.geometry?.coordinates?.length > 0) {
        const newMarker: MarkerProps = {
          draggable: currentStep?.id === id,
          color: currentStep?.id === id ? '#eb5933' : '#85bd41',
          longitude: geoFeature.geometry.coordinates[0],
          latitude: geoFeature.geometry.coordinates[1],
          key: id,
          position: position,
        }
        newMarkers.push(newMarker)
      }
    })
    setMarkers(newMarkers)
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

  const setMarkerId = useStoryStore(state => state.setHoverMarkerId)

  const handleMouseMove = (e: mapboxgl.MapLayerMouseEvent) => {
    const tolerance = 0.01
    markers.forEach(m => {
      if (
        Math.abs(m.latitude - e.lngLat.lat) <= tolerance &&
        Math.abs(m.longitude - e.lngLat.lng) <= tolerance
      ) {
        setMarkerId(m.key)
      }
    })
  }

  useEffect(() => {
    createLineData()
  }, [markers])

  useEffect(() => {
    getMarkers()
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

  if (!currentStory) {
    return (
      <StudioShell>
        <div className="re-studio-height-full-screen absolute top-0 z-10 flex w-full animate-pulse items-center justify-center overflow-hidden rounded-lg bg-zinc-100 shadow">
          <Spinner />
        </div>
      </StudioShell>
    )
  }

  return (
    <StudioShell>
      <div className="re-studio-height-full-screen absolute top-0 z-10 w-full overflow-hidden rounded-lg shadow">
        <div className="absolute top-0 z-20  w-full ">
          <div className=" mapboxgl-ctrl-group mx-auto mt-2 w-fit px-3 py-1 text-center text-sm text-black">
            {markerCoords === undefined && !currentStep?.feature && (
              <span>Klicke auf die Karte um deinen Marker hinzuzufügen</span>
            )}
            {currentStep?.feature && (
              <span>
                Verschiebe den roten Marker um dessen Position zu ändern
              </span>
            )}
          </div>
        </div>

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
                    router.replace(`/studio/${story.slug}/${m.key}`)
                  }
                  onDragEnd={async e => {
                    await addMarker(e)
                    setDragged(prev => prev++)
                  }}
                  style={{
                    padding: '10px',
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

import Map from '@/src/components/Map'
import { StoryStep } from '@prisma/client'
import { MarkerDragEvent, MarkerProps } from 'react-map-gl'
import { useEffect, useState } from 'react'
import useStep from '@/src/lib/api/step/useStep'
import { GeoJsonProperties } from 'geojson'
import useStory from '@/src/lib/api/story/useStory'
import ConnectionLines from './Layers/ConnectionLines'
import Markers from './Layers/Markers'
import { useRouter } from 'next/navigation'
import { useBoundStore } from '@/src/lib/store/store'
import GeocoderControl from '@/src/components/Map/GeocoderControl'

interface EditMapstoryMapProps {
  steps?: StoryStep[]
  currentStepId: string
}

export interface StepMarker extends MarkerProps {
  stepId: string
  position: number
}

export default function EditMapstoryMap({
  steps,
  currentStepId,
}: EditMapstoryMapProps) {
  const router = useRouter()

  const storyId = useBoundStore(state => state.storyID)
  const setHoverMarkerId = useBoundStore(state => state.setHoverMarkerId)
  const hoverMarkerId = useBoundStore(state => state.hoverMarkerId)

  const { story } = useStory(storyId)
  const { updateStep } = useStep(currentStepId)

  const [markers, setMarkers] = useState<StepMarker[]>([])
  const [geocoder_Coords, setGeocoderCoords] = useState<{
    lat: number | undefined
    lng: number | undefined
  }>({
    lat: undefined,
    lng: undefined,
  })
  const [cursor, setCursor] = useState<string>('auto')

  // generate markers
  useEffect(() => {
    if (!steps || !currentStepId) {
      return
    }
    setMarkers(_prevMarkers => [])
    const newMarkers = steps
      .map(({ id, feature, position }) => {
        const geoFeature = feature as unknown as GeoJSON.Feature<GeoJSON.Point>
        if (geoFeature?.geometry?.coordinates?.length > 0) {
          const newMarker: StepMarker = {
            draggable: currentStepId === id,
            longitude: geoFeature.geometry.coordinates[0],
            latitude: geoFeature.geometry.coordinates[1],
            position: position,
            stepId: id,
            color: currentStepId === id ? '#eb5933' : '#85bd41',
          }
          return newMarker
        }
      })
      .filter(Boolean)
    // @ts-ignore
    setMarkers(newMarkers)
  }, [currentStepId, steps])

  const handleMouseMove = (e: mapboxgl.MapLayerMouseEvent) => {
    const hoverSteps = e.features

    if (!hoverSteps || hoverSteps.length < 1) {
      setHoverMarkerId('')
      setCursor('auto')
      return
    }
    setCursor('pointer')

    const { stepId } = hoverSteps[0].properties as GeoJsonProperties & {
      stepId?: string
    }

    if (!stepId) {
      setHoverMarkerId('')
      return
    }

    setHoverMarkerId(stepId)
  }

  const addMarker = async (
    e: mapboxgl.MapLayerMouseEvent | MarkerDragEvent,
  ) => {
    const point: GeoJSON.Feature<GeoJSON.Point> = {
      type: 'Feature',
      geometry: {
        coordinates: [e.lngLat.lng, e.lngLat.lat],
        type: 'Point',
      },
      properties: {},
    }

    await updateStep({
      feature: point as any, //TODO: check what we could use instead
    })
  }

  return (
    <Map
      cursor={cursor}
      interactiveLayerIds={['step-hover']}
      onClick={e => {
        // if (!steps?.find(s => s.id === currentStepId)?.feature) {
        if (hoverMarkerId == '') {
          addMarker(e)
        }
        // }
      }}
      onMouseMove={handleMouseMove}
    >
      <GeocoderControl
        language="de"
        onResult={e =>
          setGeocoderCoords({
            lat: e.result.geometry.coordinates[0],
            lng: e.result.geometry.coordinates[1],
          })
        }
        position="top-left"
      />
      {/* <DrawControl
        controls={{
          polygon: true,
          point: true,
          trash: true,
        }}
        displayControlsDefault={false}
        position="top-left"
      /> */}

      <Markers
        markers={markers}
        onChange={addMarker}
        onClick={m => router.replace(`/studio/${story?.slug}/${m.stepId}`)}
      />
      {/* {geocoder_Coords.lat != undefined && geocoder_Coords.lng != undefined && (
        <Marker
          color={'red'}
          latitude={geocoder_Coords.lng}
          longitude={geocoder_Coords.lat}
        ></Marker>
      )} */}

      <ConnectionLines markers={markers} />
    </Map>
  )
}

import DrawControl from '@/src/components/Map/DrawControl'
import Map from '@/src/components/Map'
import { StoryStep } from '@prisma/client'
import { MarkerDragEvent, MarkerProps } from 'react-map-gl'
import { useEffect, useState } from 'react'
import { useStoryStore } from '@/src/lib/store/story'
import useStep from '@/src/lib/api/step/useStep'
import { GeoJsonProperties } from 'geojson'
import useStory from '@/src/lib/api/story/useStory'
import ConnectionLines from './Layers/ConnectionLines'
import Markers from './Layers/Markers'
import { useRouter } from 'next/navigation'
import WebMercatorViewport from 'viewport-mercator-project'
import { Button } from '@/src/components/Elements/Button'
import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/outline'

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

  const storyId = useStoryStore(store => store.storyID)
  const setHoverMarkerId = useStoryStore(state => state.setHoverMarkerId)

  const { story } = useStory(storyId)
  const { updateStep } = useStep(storyId, currentStepId)

  const [markers, setMarkers] = useState<StepMarker[]>([])
  const [viewState, setViewState] = useState({
    longitude: 7.5,
    latitude: 51.5,
    zoom: 7,
  })
  const viewport = new WebMercatorViewport({ width: 600, height: 400 })

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

  const onPreviewClick = () => {
    if (story?.steps) {
      const coordinates: number[][] = []
      story.steps.forEach(({ feature }) => {
        const geoFeature = feature as unknown as GeoJSON.Feature<GeoJSON.Point>
        if (geoFeature?.geometry?.coordinates?.length > 0) {
          const longitude = geoFeature.geometry.coordinates[0]
          const latitude = geoFeature.geometry.coordinates[1]
          coordinates.push([latitude, longitude])
        }
      })
      if (coordinates.length > 0) {
        const bounds = coordinates.reduce(
          (acc, curr) => {
            return [
              Math.min(acc[0], curr[0]), // minimum latitude
              Math.min(acc[1], curr[1]), // minimum longitude
              Math.max(acc[2], curr[0]), // maximum latitude
              Math.max(acc[3], curr[1]), // maximum longitude
            ]
          },
          [Infinity, Infinity, -Infinity, -Infinity],
        )
        const { longitude, latitude, zoom } = viewport.fitBounds(
          [
            [bounds[1], bounds[0]],
            [bounds[3], bounds[2]],
          ],
          { padding: 20, offset: [0, -40] },
        )
        setViewState({ latitude, longitude, zoom })
      }
    }
  }

  const handleMouseMove = (e: mapboxgl.MapLayerMouseEvent) => {
    const hoverSteps = e.features

    if (!hoverSteps || hoverSteps.length < 1) {
      setHoverMarkerId('')
      return
    }

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
    <>
      <Button
        className="absolute right-0 top-0 z-20"
        onClick={onPreviewClick}
        size={'sm'}
        startIcon={<MagnifyingGlassCircleIcon className="w-5" />}
        variant={'inverse'}
      >
        Preview
      </Button>
      <Map
        {...viewState}
        interactiveLayerIds={['step-hover']}
        onClick={e => {
          if (!steps?.find(s => s.id === currentStepId)?.feature) {
            addMarker(e)
          }
        }}
        onMouseMove={handleMouseMove}
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

        <Markers
          markers={markers}
          onChange={addMarker}
          onClick={m => router.replace(`/studio/${story?.slug}/${m.stepId}`)}
        />
        <ConnectionLines markers={markers} />
      </Map>
    </>
  )
}

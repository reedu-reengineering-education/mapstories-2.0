import { DrawControl } from '@/src/components/Map/DrawControl'
import Map from '@/src/components/Map'
import { StoryStep } from '@prisma/client'
import { MarkerDragEvent, MarkerProps } from 'react-map-gl'
import { useEffect, useRef, useState } from 'react'
import { useStoryStore } from '@/src/lib/store/story'
import useStep from '@/src/lib/api/step/useStep'
import { GeoJsonProperties } from 'geojson'
import useStory from '@/src/lib/api/story/useStory'
import ConnectionLines from './Layers/ConnectionLines'
import { useRouter } from 'next/navigation'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { GeoJSONFeature } from 'maplibre-gl'

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
  const drawRef = useRef<MapboxDraw>(null)

  const storyId = useStoryStore(store => store.storyID)
  const setHoverMarkerId = useStoryStore(state => state.setHoverMarkerId)

  const { story } = useStory(storyId)
  const { updateStep } = useStep(storyId, currentStepId)

  const [markers, setMarkers] = useState<StepMarker[]>([])

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

  const onDrawLoad = () => {
    const featureCollection: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features:
        story?.steps?.map(s => {
          const feature = s.feature as unknown as GeoJSONFeature
          feature.properties = {
            ...feature.properties,
            stepId: s.id,
          }
          return feature
        }) || [],
    }
    drawRef.current?.add(featureCollection)
  }

  const onDrawUpdate = (event: {
    features: GeoJSON.Feature<GeoJSON.Geometry, { stepId: string }>[]
    action: string
  }) => {
    const featToUpdate = event.features.find(
      f => f.properties.stepId === currentStepId,
    )
    if (featToUpdate) {
      updateStep({
        feature: featToUpdate as any,
      })
    }
  }

  const onDrawCreate = (event: {
    features: GeoJSON.Feature<GeoJSON.Geometry, { stepId: string }>[]
  }) => {
    updateStep({
      feature: event.features[0] as any,
    })
  }

  return (
    <Map
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
        onCreate={onDrawCreate}
        onLoad={onDrawLoad}
        onUpdate={onDrawUpdate}
        position="top-left"
        ref={drawRef}
      />

      {/* <Markers
        markers={markers}
        onChange={addMarker}
        onClick={m => router.replace(`/studio/${story?.slug}/${m.stepId}`)}
      /> */}
      <ConnectionLines markers={markers} />
    </Map>
  )
}

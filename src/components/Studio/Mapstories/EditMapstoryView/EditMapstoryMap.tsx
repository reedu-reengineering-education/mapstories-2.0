import DrawControl from '@/src/components/Map/DrawControl'
import { useRouter } from 'next/navigation'
import Map from '@/src/components/Map'
import { StoryStep } from '@prisma/client'
import {
  CircleLayer,
  Layer,
  LineLayer,
  Marker,
  MarkerDragEvent,
  MarkerProps,
  Source,
} from 'react-map-gl'
import { useEffect, useState } from 'react'
import { useStoryStore } from '@/src/lib/store/story'
import useStep from '@/src/lib/api/step/useStep'
import { GeoJsonProperties } from 'geojson'
import useStory from '@/src/lib/api/story/useStory'
import { splitMarkers } from './splitMarkers'

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
  const [lineData, setLineData] = useState<
    GeoJSON.FeatureCollection | undefined
  >()
  const [triggerHoverLayerData, setTriggerHoverLayerData] = useState<
    GeoJSON.FeatureCollection | undefined
  >()

  // generate Line string
  useEffect(() => {
    const markerGroups = splitMarkers(markers)
    const features: GeoJSON.Feature[] = markerGroups
      .filter(group => group.length > 1)
      .map(group => ({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: group.map(m => [m.longitude, m.latitude]),
        },
      }))

    setLineData({
      type: 'FeatureCollection',
      features,
    })
  }, [markers])

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

    // this layer triggers the onhover method
    setTriggerHoverLayerData({
      type: 'FeatureCollection',
      features:
        steps?.map(s => ({
          ...(s.feature as unknown as GeoJSON.Feature),
          properties: {
            stepId: s.id,
          },
        })) ?? [],
    })
  }, [currentStepId, steps])

  const handleMouseMove = (e: mapboxgl.MapLayerMouseEvent) => {
    const hoverSteps = e.features

    if (!hoverSteps || hoverSteps.length < 1) {
      return
    }

    const { stepId } = hoverSteps[0].properties as GeoJsonProperties & {
      stepId?: string
    }

    if (!stepId) {
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

  const lineStyle: LineLayer = {
    id: 'lines',
    type: 'line',
    paint: {
      'line-color': '#d4da68',
      'line-width': 5,
    },
  }

  const layerStyle: CircleLayer = {
    id: 'point',
    type: 'circle',
    paint: {
      'circle-radius': 30,
      'circle-opacity': 0,
      'circle-translate': [0, -12],
    },
  }

  return (
    <Map
      interactiveLayerIds={['story-features']}
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
      {markers.map((m, i) => (
        <Marker
          {...m}
          key={(i + 1) * Math.random() * 100}
          onClick={() => router.replace(`/studio/${story?.slug}/${m.stepId}`)}
          onDragEnd={addMarker}
          style={{
            padding: '10px',
          }}
        ></Marker>
      ))}
      <Source data={triggerHoverLayerData} type="geojson">
        <Layer {...layerStyle} id="story-features" />
      </Source>
      <Source data={lineData} id="linesource" type="geojson">
        <Layer {...lineStyle} />
      </Source>
    </Map>
  )
}

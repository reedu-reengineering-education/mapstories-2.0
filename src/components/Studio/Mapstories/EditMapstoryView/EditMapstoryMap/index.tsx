import Map from '@/src/components/Map'
import { StoryStep } from '@prisma/client'
import {
  Layer,
  MapRef,
  MarkerDragEvent,
  MarkerProps,
  Popup,
  Source,
} from 'react-map-gl'
import { useCallback, useEffect, useState } from 'react'
import useStep from '@/src/lib/api/step/useStep'
import { GeoJsonProperties } from 'geojson'
import useStory from '@/src/lib/api/story/useStory'
import ConnectionLines from './Layers/ConnectionLines'
import Markers from './Layers/Markers'
import { useRouter } from 'next/navigation'
import { useBoundStore } from '@/src/lib/store/store'
import GeocoderControl from '@/src/components/Map/GeocoderControl'
import { toast } from '@/src/lib/toast'
import mapboxgl from 'mapbox-gl'
import React from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Button } from '@/src/components/Elements/Button'

interface EditMapstoryMapProps {
  steps?: StoryStep[]
  currentStep: StoryStep
}

export interface StepMarker extends MarkerProps {
  stepId: string
  position: number
}

export default function EditMapstoryMap({
  steps,
  currentStep,
}: EditMapstoryMapProps) {
  const router = useRouter()

  const storyId = useBoundStore(state => state.storyID)
  const setHoverMarkerId = useBoundStore(state => state.setHoverMarkerId)
  const hoverMarkerId = useBoundStore(state => state.hoverMarkerId)
  const [extend, setExtend] = useState<any>(undefined)
  const mapRef = React.createRef<MapRef>()

  const { story } = useStory(storyId)
  const { updateStep } = useStep(currentStep.id)
  const [settings, setSettings] = useState({
    scrollZoom: true,
    boxZoom: true,
    dragRotate: true,
    dragPan: true,
    keyboard: true,
    doubleClickZoom: true,
    touchZoomRotate: true,
    touchPitch: true,
  })

  // const [initialViewState, setInitialViewState] = useState({})

  useEffect(() => {
    if (currentStep.feature) {
      const geojsonStep: any = currentStep.feature
      mapRef.current?.flyTo({
        center: geojsonStep.geometry?.coordinates,
        zoom: 7,
      })
    }
  }, [currentStep])

  const [markers, setMarkers] = useState<StepMarker[]>([])

  function createPointFeature(
    coordinates: GeoJSON.Position,
  ): GeoJSON.Feature<GeoJSON.Point> {
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: coordinates,
      },
    }
  }

  const [geocoderResult, setGeocoderResult] =
    useState<GeoJSON.Feature<GeoJSON.Point>>()

  const handleRemovePoint = useCallback(() => {
    setGeocoderResult(undefined)
  }, [])

  // generate markers
  useEffect(() => {
    if (!steps || !currentStep) {
      return
    }

    setMarkers(_prevMarkers => [])
    const newMarkers = steps
      .map(({ id, feature, position }) => {
        const geoFeature = feature as unknown as GeoJSON.Feature<GeoJSON.Point>
        if (geoFeature?.geometry?.coordinates?.length > 0) {
          const newMarker: StepMarker = {
            draggable: currentStep.id === id,
            longitude: geoFeature.geometry.coordinates[0],
            latitude: geoFeature.geometry.coordinates[1],
            position: position,
            stepId: id,
            color:
              currentStep.id === id
                ? 'var(--active-color-border)'
                : 'var(--inactive-color-border)',
          }
          return newMarker
        }
      })
      .filter(Boolean)
    // @ts-ignore
    setMarkers(newMarkers)
    // handleRemovePoint()
  }, [currentStep, steps])

  useEffect(() => {
    if (story && story.steps) {
      const coordinates: any[] = []
      story.steps.forEach(step => {
        //@ts-ignore
        if (step.feature && step.feature?.geometry?.coordinates) {
          //@ts-ignore
          coordinates.push(step.feature?.geometry?.coordinates)
        }
      })
      // Create a 'LngLsatBounds' with both corners at the first coordinate.
      let bounds
      if (coordinates.length == 0) {
        bounds = new mapboxgl.LngLatBounds([0, 0], [0, 0])
      } else {
        bounds = new mapboxgl.LngLatBounds(
          [coordinates[0][0], coordinates[0][1]],
          [coordinates[0][0], coordinates[0][1]],
        )
      }

      // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
      for (const coord of coordinates) {
        bounds.extend([coord[0], coord[1]])
      }
      setExtend(bounds)
    }
  }, [story])

  useEffect(() => {
    const settingsValue = currentStep.id !== story?.firstStepId
    setSettings({
      boxZoom: settingsValue,
      doubleClickZoom: settingsValue,
      dragPan: settingsValue,
      dragRotate: settingsValue,
      keyboard: settingsValue,
      scrollZoom: settingsValue,
      touchPitch: settingsValue,
      touchZoomRotate: settingsValue,
    })

    if (currentStep.id == story?.firstStepId && story.steps) {
      if (mapRef && extend) {
        mapRef.current?.fitBounds(extend, {
          padding: 100,
        })
      }
    }
  }, [currentStep])

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
    <Map
      // {...initialViewState}
      // initialViewState={initialViewState}
      {...settings}
      interactiveLayerIds={['step-hover']}
      onClick={e => {
        if (currentStep.id === story?.firstStepId) {
          toast({
            title: 'Dies ist deine Titelfolie.',
            message: 'Hier kannst du keinen Marker setzen.',
            type: 'error',
          })
        }
        // if (!steps?.find(s => s.id === currentStepId)?.feature) {
        if (hoverMarkerId == '') {
          addMarker(e)
        }
        // }
      }}
      onMouseMove={handleMouseMove}
      ref={mapRef}
    >
      <GeocoderControl
        language="de"
        onClear={handleRemovePoint}
        onResult={async e => {
          const [lng, lat] = e.result.geometry.coordinates
          setGeocoderResult({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
            properties: e.result.properties,
          })
          const point: GeoJSON.Feature<GeoJSON.Point> = {
            type: 'Feature',
            geometry: {
              coordinates: [lng, lat],
              type: 'Point',
            },
            properties: {},
          }
          // this would only update the step that was selected when the component got FIRST initialized
          // await updateStep({ feature: point as any })
        }}
        position="top-right"
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
        onClick={m => router.replace(`/storylab/${story?.slug}/${m.stepId}`)}
      />
      {story?.lines && <ConnectionLines markers={markers} />}
      {geocoderResult?.geometry?.coordinates && (
        <>
          <Popup
            anchor="bottom-left"
            latitude={geocoderResult.geometry.coordinates[1]}
            longitude={geocoderResult.geometry.coordinates[0]}
          >
            <Button
              onClick={async () => {
                await updateStep({ feature: geocoderResult as any })
                handleRemovePoint()
              }}
            >
              Click to set marker
            </Button>
          </Popup>
          <Source data={geocoderResult} id="geocode-point" type="geojson">
            <Layer
              id="point"
              paint={{
                'circle-color': '#FF0000',
                'circle-radius': {
                  base: 9,
                  stops: [
                    [1, 3],
                    [7, 5],
                    [12, 8],
                    [18, 15],
                    [22, 22],
                  ],
                },
                'circle-stroke-color': '#FF0000',
                'circle-stroke-width': 2,
              }}
              type="circle"
            />
          </Source>
        </>
      )}
    </Map>
  )
}

import Map from '@/src/components/Map'
import { StoryStep } from '@prisma/client'
import {
  Layer,
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
import { XMarkIcon } from '@heroicons/react/24/outline'

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

  // useEffect(() => {
  //   const newBounds = steps?.reduce((acc, step) => {
  //     if (!step.feature) {
  //       return acc
  //     }
  //     const geoFeature =
  //       step.feature as unknown as GeoJSON.Feature<GeoJSON.Point>
  //     const [lng, lat] = geoFeature.geometry.coordinates
  //     return acc.extend([lng, lat])
  //   }, new mapboxgl.LngLatBounds())

  //   if (newBounds) {
  //     setInitialViewState({
  //       longitude: newBounds.getCenter().lng,
  //       latitude: newBounds.getCenter().lat,
  //       zoom: 2, //TODO calculate zoom level
  //     })
  //   }
  // }, [])

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
    handleRemovePoint()
  }, [currentStepId, steps])

  useEffect(() => {
    const settingsValue = currentStepId !== story?.firstStepId
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
  }, [currentStepId])

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
        if (currentStepId === story?.firstStepId) {
          toast({
            title: 'Dies ist deine Titelfolie.',
            message: 'Hier kannst du <strong>keinen Marker</strong> setzen.',
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
    >
      <GeocoderControl
        language="de"
        onClear={handleRemovePoint}
        onResult={e => {
          const [lng, lat] = e.result.geometry.coordinates
          setGeocoderResult({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
            properties: e.result.properties,
          })
        }}
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
      {geocoderResult?.geometry?.coordinates && (
        <>
          <Popup
            anchor="bottom-left"
            latitude={geocoderResult.geometry.coordinates[1]}
            longitude={geocoderResult.geometry.coordinates[0]}
          >
            <XMarkIcon
              className="h-5 w-5 hover:cursor-pointer"
              onClick={handleRemovePoint}
            />
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

      <ConnectionLines markers={markers} />
    </Map>
  )
}

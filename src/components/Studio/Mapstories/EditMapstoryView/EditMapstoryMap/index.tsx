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

  const [markers, setMarkers] = useState<StepMarker[]>([])
  // const [geocoder_Coords, setGeocoderCoords] = useState<{
  //   lat: number | undefined
  //   lng: number | undefined
  // }>({
  //   lat: undefined,
  //   lng: undefined,
  // })

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

  const [geocoder_Coords, setGeocoderCoords] =
    useState<GeoJSON.Feature<GeoJSON.Point>>()

  const handleRemovePoint = useCallback(() => {
    setGeocoderCoords(undefined)
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

  return (
    <Map
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
        onClear={handleRemovePoint}
        onResult={e => {
          const coordinates = e.result.geometry.coordinates as GeoJSON.Position
          const pointFeature = createPointFeature(coordinates)
          setGeocoderCoords(pointFeature)
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
      {geocoder_Coords?.geometry?.coordinates && (
        <>
          <Popup
            anchor="bottom-left"
            latitude={geocoder_Coords.geometry.coordinates[1]}
            longitude={geocoder_Coords.geometry.coordinates[0]}
          >
            <XMarkIcon
              className="h-5 w-5 hover:cursor-pointer"
              onClick={handleRemovePoint}
            />
          </Popup>
          <Source data={geocoder_Coords} id="geocode-point" type="geojson">
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

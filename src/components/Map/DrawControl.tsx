'use client'

import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { forwardRef, MutableRefObject, useImperativeHandle } from 'react'
import { ControlPosition, useControl } from 'react-map-gl'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

type GenericGeoJSONFeature = GeoJSON.Feature<
  GeoJSON.Geometry,
  GeoJSON.GeoJsonProperties & any
>

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  ref: MutableRefObject<MapboxDraw>
  position?: ControlPosition

  onCreate?: <T extends GenericGeoJSONFeature[]>(_event: {
    features: T
  }) => void
  onUpdate?: <T extends GenericGeoJSONFeature[]>(_event: {
    features: T
    action: string
  }) => void
  onDelete?: <T extends GenericGeoJSONFeature[]>(_event: {
    features: T
  }) => void
  onLoad?: () => void
}

export const DrawControl = forwardRef((props: DrawControlProps, ref) => {
  const drawRef = useControl<MapboxDraw>(
    () => new MapboxDraw(props),
    ({ map }) => {
      props.onCreate && map.on('draw.create', props.onCreate)
      props.onUpdate && map.on('draw.update', props.onUpdate)
      props.onDelete && map.on('draw.delete', props.onDelete)
      props.onLoad && map.on('load', props.onLoad)
    },
    ({ map }) => {
      props.onCreate && map.off('draw.create', props.onCreate)
      props.onUpdate && map.off('draw.update', props.onUpdate)
      props.onDelete && map.off('draw.delete', props.onDelete)
      props.onLoad && map.off('load', props.onLoad)
    },
    {
      position: props.position,
    },
  )

  useImperativeHandle(ref, () => drawRef, [drawRef]) // This way I exposed drawRef outside the component

  return null
})

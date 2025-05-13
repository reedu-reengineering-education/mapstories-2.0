'use client'

import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { useControl } from 'react-map-gl'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

import type { ControlPosition, MapRef } from 'react-map-gl'

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  position?: ControlPosition

  onCreate?: (_evt: { features: object[] }) => void
  onUpdate?: (_evt: { features: object[]; action: string }) => void
  onDelete?: (_evt: { features: object[] }) => void
}

export default function DrawControl(props: DrawControlProps) {
  useControl<MapboxDraw>(
    () => new MapboxDraw(props),
    // @ts-ignore
    ({ map }: { map: MapRef }) => {
      props.onCreate && map.on('draw.create', props.onCreate)
      props.onUpdate && map.on('draw.update', props.onUpdate)
      props.onDelete && map.on('draw.delete', props.onDelete)
    },
    ({ map }: { map: MapRef }) => {
      props.onCreate && map.off('draw.create', props.onCreate)
      props.onUpdate && map.off('draw.update', props.onUpdate)
      props.onDelete && map.off('draw.delete', props.onDelete)
    },
    {
      position: props.position,
    },
  )

  return null
}

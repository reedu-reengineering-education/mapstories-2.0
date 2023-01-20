'use client'

import {
  MapProps,
  MapRef,
  NavigationControl,
  Map as ReactMap,
} from 'react-map-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import maplibregl from 'maplibre-gl'
import { forwardRef } from 'react'

const Map = forwardRef<MapRef, MapProps>(
  (
    // take fog and terrain out of props to resolve error
    // eslint-disable-next-line unused-imports/no-unused-vars
    { children, mapStyle, fog = null, terrain = null, ...props },
    ref,
  ) => {
    return (
      <ReactMap
        dragRotate={false}
        initialViewState={{
          longitude: 7.5,
          latitude: 51.5,
          zoom: 7,
        }}
        mapLib={maplibregl}
        mapStyle={
          mapStyle ||
          `https://api.maptiler.com/maps/basic-gray/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`
        }
        pitchWithRotate={false}
        preserveDrawingBuffer
        ref={ref}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        touchZoomRotate={false}
        {...props}
      >
        {children}
        <NavigationControl position="bottom-left" showCompass={false} />
      </ReactMap>
    )
  },
)

Map.displayName = 'Map'

export default Map

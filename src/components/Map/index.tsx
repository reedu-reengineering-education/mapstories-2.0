'use client'

import {
  MapProps,
  MapRef,
  NavigationControl,
  Map as ReactMap,
} from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
// import 'maplibre-gl/dist/maplibre-gl.css'
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
        fog={{
          color: 'rgb(186, 210, 235)',
          // 'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
          'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
          // 'space-color': 'rgb(11, 11, 25)', // Background color
          // 'star-intensity': 0.6, // Background star brightness (default 0.35 at low zoooms )
        }}
        initialViewState={{
          longitude: 7.5,
          latitude: 51.5,
          zoom: 7,
        }}
        mapboxAccessToken={`${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`}
        // mapLib={maplibregl}
        mapStyle={
          mapStyle ||
          `https://api.maptiler.com/maps/outdoor/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`
        }
        pitchWithRotate={false}
        preserveDrawingBuffer
        projection={'globe'}
        ref={ref}
        style={{
          width: '100%',
          height: '100%',
        }}
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

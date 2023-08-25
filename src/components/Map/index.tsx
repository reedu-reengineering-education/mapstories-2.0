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
        customAttribution={`Old mapstories version can be seen at <a href="https://old.mapstories.de/">old.mapstories</a> | Designed by <a href="https://www.reedu.de">re:edu</a>   |   <a href="/de/impressum/">Imprint</a> | ${
          process.env.NEXT_PUBLIC_APP_VERSION || 'development'
        }`}
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
          zoom: 3,
        }}
        mapboxAccessToken={`${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`}
        // mapLib={maplibregl}
        mapStyle={mapStyle || 'mapbox://styles/mapbox/streets-v12'}
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
        <NavigationControl position="top-right" showCompass={false} />
      </ReactMap>
    )
  },
)

Map.displayName = 'Map'

export default Map

'use client'

import {
  AttributionControl,
  MapProps,
  MapRef,
  Map as ReactMap,
} from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
// import 'maplibre-gl/dist/maplibre-gl.css'
import { forwardRef } from 'react'
import { useBreakpoint } from '@/src/lib/hooks/useBreakpoint'
import { DEFAULT_MAP_STYLE, MAP_STYLES } from './mapStyles'

const Map = forwardRef<MapRef, MapProps>(
  (
    // take fog and terrain out of props to resolve error
    // eslint-disable-next-line unused-imports/no-unused-vars
    { children, mapStyle, fog = null, terrain = null, ...props },
    ref,
  ) => {
    const { isDesktop } = useBreakpoint()
    const resolvedMapStyle = mapStyle || MAP_STYLES[DEFAULT_MAP_STYLE].url
    const usesMapTiler =
      typeof resolvedMapStyle === 'string' &&
      resolvedMapStyle.startsWith('https://api.maptiler.com/')

    return (
      <ReactMap
        // disable the default attribution
        attributionControl={false}
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
        mapStyle={resolvedMapStyle}
        preserveDrawingBuffer
        // @ts-expect-error
        projection={'globe'}
        ref={ref}
        style={{
          width: '100%',
          height: '100%',
        }}
        {...props}
      >
        <AttributionControl
          customAttribution={
            isDesktop
              ? ` Designed by <a href="https://www.reedu.de">re:edu</a>   |   <a href="/de/impressum/">Imprint</a> | <a href="/de/privacy"> Privacy Policy </a> | ${
                  process.env.NEXT_PUBLIC_APP_VERSION || 'development'
                }`
              : ''
          }
        />
        {usesMapTiler && (
          <a
            className="absolute bottom-8 left-2 z-10"
            href="https://www.maptiler.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <img
              alt="MapTiler logo"
              height={30}
              src="https://api.maptiler.com/resources/logo.svg"
              width={100}
            />
          </a>
        )}
        {children}
      </ReactMap>
    )
  },
)

Map.displayName = 'Map'

export default Map

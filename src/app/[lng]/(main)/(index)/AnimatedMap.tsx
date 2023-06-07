'use client'

import { useRef } from 'react'
import { MapRef } from 'react-map-gl'
import React from 'react'
import Map from '@/src/components/Map'

export default function AnimatedMap() {
  const mapRef = useRef<MapRef>(null)

  const onMapLoad = () => {
    mapRef.current?.flyTo({
      animate: true,
      duration: 5000,
      zoom: 4,
      pitch: 45,
      center: [21, 45],
    })
  }
  // 38°33'03.1"N 19°09'49.6"E
  return (
    <Map
      initialViewState={{
        latitude: 0,
        longitude: -45,
        zoom: 2,
      }}
      onLoad={onMapLoad}
      ref={mapRef}
    ></Map>
  )
}

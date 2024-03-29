'use client'

import { useEffect, useRef } from 'react'
import { MapRef } from 'react-map-gl'
import React from 'react'
import Map from '@/src/components/Map'

export default function AnimatedMap() {
  const mapRef = useRef<MapRef>(null)

  useEffect(() => {
    if (!mapRef.current) {
      return
    }
  }, [mapRef])

  const onMapLoad = () => {
    mapRef.current?.flyTo({
      animate: true,
      duration: 5000,
      zoom: 4,
      pitch: 45,
      center: [5, 40],
    })
  }

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

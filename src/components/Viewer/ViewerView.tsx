'use client'

import { SlideContent, Story, StoryStep, Theme } from '@prisma/client'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { MapRef, Popup, Source } from 'react-map-gl'
import { Feature, GeoJsonProperties, LineString } from 'geojson'
// import { LineString } from 'geojson'
import { usePathname, useRouter } from 'next/navigation'
import mapboxgl from 'mapbox-gl'
import React from 'react'
import Markers from './ViewerMap/Layers/Markers'
import { useBoundStore } from '@/src/lib/store/store'
import { getSlideTitle } from '@/src/lib/getSlideTitle'
import Map from '../Map'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { applyTheme } from '@/src/helper/applyTheme'
import StorySourceLayer from './ViewerMap/Layers/StorySourceAndLayer'
import { ViewerPopup } from './ViewerPopup'
import { useBreakpoint } from '@/src/lib/hooks/useBreakpoint'

type ViewerViewProps = {
  inputStories: (Story & {
    theme?: Theme | null
    firstStep?: (StoryStep & { content: SlideContent[] }) | null
    steps: (StoryStep & { content: SlideContent[] })[]
  })[]
}

export default function ViewerView({ inputStories }: ViewerViewProps) {
  const mapRef = React.createRef<MapRef>()

  const path = usePathname()
  const storyID = useBoundStore(state => state.storyID)
  const setStoryID = useBoundStore(state => state.setStoryID)
  const selectedStepIndex = useBoundStore(state => state.selectedStepIndex)

  const [mapData, setMapData] = useState<
    GeoJSON.Feature<GeoJSON.LineString>[] | undefined
  >()
  const [selectedFeature, setSelectedFeature] = useState<Feature | undefined>()

  const [interactiveLayerIds, setInteractiveLayerIds] = useState<any[]>()
  const [savedView, setSavedView] = useState<any>()
  const [startView, setStartView] = useState<any>()
  const [pathend2, setPathend2] = useState<string | undefined>('')
  const [markers, setMarkers] = useState<any[]>([])
  const [selectedStorySlug, setSelectedStorySlug] = useState<string>()
  const { width } = useBreakpoint()
  const router = useRouter()

  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  const setViewerStories = useBoundStore(state => state.setViewerStories)
  const stories = useBoundStore(state => state.viewerStories)

  // Helper function to safely parse and validate feature
  const parseFeature = (feature: any): GeoJSON.Feature<GeoJSON.Point> | null => {
    if (!feature) {return null}
    
    let parsed = feature
    if (typeof parsed === 'string') {
      try {
        parsed = JSON.parse(parsed)
      } catch {
        console.warn('Failed to parse feature:', feature)
        return null
      }
    }
    
    const coords = parsed?.geometry?.coordinates
    // Validate coordinates are valid numbers
    if (!coords || coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) {
      console.warn('Invalid coordinates:', coords)
      return null
    }
    
    return parsed as GeoJSON.Feature<GeoJSON.Point>
  }

  useEffect(() => {
    if (selectedStepIndex != undefined) {
      updateToStep(selectedStepIndex)
    }
  }, [selectedStepIndex])

  useEffect(() => {
    if (inputStories && inputStories.length > 0) {
      //removed this because it causes bugs, not sure we still need it
      // if (inputStories.map(story => story.id).indexOf(storyID) != -1) {
      setViewerStories(inputStories)
      // }
    }
  }, [inputStories])

  useEffect(() => {
    extractGeoJson(stories)
  }, [stories])

  useEffect(() => {
    // Zoom back to former extend if not viewing a story
    const pathend = path?.split('/').at(-1)
    setPathend2(path?.split('/').at(-2))
    if (pathend === 'all' && path?.split('/').at(-2) === 'mystories') {
      setStoryID('')
      if (savedView) {
        mapRef.current?.fitBounds(savedView)
      }
    }
    if (path?.split('/').at(-2) === 'gallery') {
      setStoryID('')
      setViewerStories(inputStories)
      if (savedView) {
        mapRef.current?.fitBounds(savedView)
      }
      // setViewerStories([])
    }
  }, [path])

  useEffect(() => {
    if (mapData && mapData.length > 0) {
      const ids = mapData
        ?.map(m => {
          if (m.geometry?.coordinates?.length > 0 && m.properties?.id) {
            return m.properties.id.toString() + 'buffer'
          }
          return undefined
        })
        .filter(item => item !== undefined)
      setInteractiveLayerIds(ids || [])
    }
  }, [mapData])

  useEffect(() => {
    if (storyID != undefined && mapData != undefined) {
      const m: Feature<LineString, GeoJsonProperties> | undefined =
        mapData.find(story => story?.properties?.id === storyID)
      if (m && selectedStorySlug != m.properties?.slug) {
        selectStory(m)
      }
    }
  }, [storyID])

  // generate markers
  useEffect(() => {
    const story = stories?.filter(story => story.id === storyID)[0]
    // update Theme
    if (storyID != '' && story?.theme) {
      applyTheme(story.theme)
    } else {
      // go back to Standard theme (TODO: get this from db)
      applyTheme({
        name: 'Standard',
        shadow_color: 'rgba(56,56.58, 0.9)',
        border: '3px solid #38383a',
        box_shadow: '4px 4px 0px var(--shadow-color)',
        border_radius: '10px',
        text_color: '#38383a',
        button_color: '#38383a',
        background_color: 'white',
      })
    }
    if (story?.steps && story?.steps.length > 0) {
      let bounds: any = undefined
      const newMarkers = story?.steps
        .filter(step => step.feature)
        .map(({ id, feature, position, content, tags }) => {
          const geoFeature = parseFeature(feature)
          if (!geoFeature?.geometry?.coordinates) {return null}
          
          const [lng, lat] = geoFeature.geometry.coordinates
          
          // Validate coordinates are numbers and not NaN
          if (isNaN(lng) || isNaN(lat)) {
            console.warn('Skipping marker with NaN coordinates:', { lng, lat, stepId: id })
            return null
          }
          
          try {
            if (bounds === undefined) {
              bounds = new mapboxgl.LngLatBounds([lng, lat], [lng, lat])
            } else {
              bounds.extend([lng, lat])
            }
          } catch (e) {
            console.error('Error creating bounds:', e, { lng, lat })
            return null
          }
          
          const newMarker: any = {
            longitude: lng,
            latitude: lat,
            position: position,
            stepId: id,
            color: '#18325b',
            title: getSlideTitle(content),
            tags: tags,
          }
          return newMarker
        })
        .filter(m => m !== null)
      
      setMarkers(newMarkers)

      //save bounds to zoomTo once map is initiated)
      setStartView(bounds)
    }
  }, [storyID, stories])

  function extractGeoJson(currentStories: any) {
    if (!currentStories) {
      return
    }

    const geojsons: any[] = []

    currentStories.forEach((s: any) => {
      if (!s?.steps) {
        return
      }
      
      const story = s.steps
        .filter((step: any) => parseFeature(step.feature) !== null)
        .sort((a: any, b: any) => a.position - b.position)
        .map((step: any) => {
          const geoFeature = parseFeature(step.feature)
          return geoFeature?.geometry?.coordinates || []
        })
        .filter((coords: any[]) => coords.length === 2)
      
      if (story.length === 0) {
        return
      }
      
      const commonProperties = {
        id: s.id,
        desc: s.description,
        name: s.name,
        slug: s.slug,
        mode: s.mode,
      }

      if (s.lines) {
        geojsons.push({
          type: 'Feature',
          properties: commonProperties,
          geometry: {
            type: 'LineString',
            coordinates: story,
          },
        })
      } else {
        story.forEach((coordinates: []) => {
          geojsons.push({
            type: 'Feature',
            properties: commonProperties,
            geometry: {
              type: 'Point',
              coordinates: coordinates,
            },
          })
        })
      }
    })

    setMapData(geojsons)
    console.log('Valid geojsons:', geojsons)
  }

  function selectStory(m: GeoJSON.Feature<GeoJSON.LineString>) {
    setSelectedStorySlug(m.properties?.slug)

    if (m) {
      const coordinates = m.geometry.coordinates

      // Create a 'LngLatBounds' with both corners at the first coordinate.
      if (coordinates.length !== 0) {
        const bounds = new mapboxgl.LngLatBounds(
          [coordinates[0][0], coordinates[0][1]],
          [coordinates[0][0], coordinates[0][1]],
        )
        for (const coord of coordinates) {
          bounds.extend([coord[0], coord[1]])
        }
        if (mapRef) {
          setSavedView(mapRef.current?.getBounds())
          mapRef.current?.fitBounds(bounds, {
            padding: 100,
          })
        }
      }
      // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
    }
    const pathLocal =
      path?.split('/').splice(2, 2).join('/') ?? 'gallery/story/'
    router.push(`/${pathLocal}/story/${m.properties?.slug}/start`)
  }
  function getDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const earthRadius = 6371 // Durchmesser der Erde in Kilometern

    const toRadians = (degrees: number): number => (degrees * Math.PI) / 180

    const dLat = toRadians(lat2 - lat1)
    const dLon = toRadians(lon2 - lon1)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    const distance = earthRadius * c
    return distance // Entfernung in Kilometern
  }

  function calculateWeightedZoom(distance: number): number {
    const minZoom = 4
    const maxZoom = 15

    // Gewichtete Anpassung: Kleinere Entfernungen -> Höherer Zoom, größere Entfernungen -> Weniger Zoom
    const weight = 0.5 // Gewichtung anpassen
    const zoom = 16 - Math.log2(distance * weight)

    return Math.max(minZoom, Math.min(maxZoom, zoom))
  }

  function updateToStep(index: number) {
    const story = stories?.filter(story => story.id === storyID)[0]
    if (
      story?.steps?.length &&
      index <= Math.max(
        ...(story?.steps?.map(step => step.position) ?? []),
      )


    ) {
      const stepData = story?.steps.find(step => step.position === index)
      const stepFeat = parseFeature(stepData?.feature)
      
      // No animation if step has no GPS coordinates
      if (!stepFeat?.geometry?.coordinates) {
        return
      }

      // take either next or previous step with valid geometry
      const previousStepData = story?.steps.find(step => {
        const feat = parseFeature(step.feature)
        return (index === 0
          ? step.position === index + 1
          : step.position === index - 1) && feat?.geometry
      })
      
      const previousStepFeat = parseFeature(previousStepData?.feature)

      // Mobile detection
      const isMobile = width < 768
      const mobileOffset: [number, number] = [0, -window.innerHeight * 0.25]

      if (!previousStepFeat?.geometry?.coordinates) {
        const [lng, lat] = stepFeat.geometry.coordinates
        mapRef.current?.flyTo({
          center: [lng, lat],
          offset: isMobile ? mobileOffset : [-width / 7, -75],
          zoom: 8,
          essential: true,
          duration: 1000,
        })
        return
      }

      let distance = 100
      if (mapRef && stepFeat) {
        const feature: Feature<GeoJSON.Point> =
          stepFeat as unknown as Feature<GeoJSON.Point>
        if (previousStepFeat.geometry.coordinates.length > 0) {
          distance = getDistance(
            previousStepFeat.geometry.coordinates[1],
            previousStepFeat.geometry.coordinates[0],
            feature.geometry.coordinates[1],
            feature.geometry.coordinates[0],
          )
        }

        mapRef.current?.flyTo({
          center: [
            feature.geometry.coordinates[0],
            feature.geometry.coordinates[1],
          ],
          offset: isMobile ? mobileOffset : [-width / 5, 0],
          zoom: calculateWeightedZoom(distance),
          essential: true,
          duration: Math.min(Math.max(distance * 100, 1000), 3000),
        })
      }
    }
  }

  const onMapLoad = useCallback(() => {
    if (selectedStepIndex) {
      updateToStep(selectedStepIndex)
    }
    if (Number.isNaN(selectedStepIndex) && mapRef.current && startView) {
      try {
        const distance = getDistance(
          startView.getSouthEast().lat,
          startView.getSouthEast().lng,
          startView.getNorthWest().lat,
          startView.getNorthWest().lng,
        )
        mapRef.current?.flyTo({
          center: startView.getCenter(),
          zoom: calculateWeightedZoom(distance),
          offset: [-width / 5, 75],
        })
      } catch (error) {
        // startView might be null if no steps with features exist
        console.warn('Could not fly to start view:', error)
      }
      // mapRef.current?.fitBounds(startView, {
      //   offset: [width > 820 ? width / 3 : -width / 4, 0],
      // })
    }
  }, [startView, mapRef])

  return (
    <Map
      // cursor={cursor}
      interactiveLayerIds={interactiveLayerIds}
      onLoad={onMapLoad}
      // onMouseMove={onHover}
      ref={mapRef}
    >
      {pathend2 != 'gallery' && (
        <StorySourceLayer
          geojsons={mapData}
          selectedFeature={selectedFeature}
          selectedStepIndex={selectedStepIndex}
          storyID={storyID}
        />
      )}

      {mapData &&
        mapData.map((m) => {
          const storyData = stories?.find((s) => s.id === m.properties?.id)
          if (m.geometry.coordinates[0][1] === undefined || m.geometry.coordinates[0][0] === undefined) {
            console.warn('Skipping feature with invalid coordinates:', m)
            return null
          }
          return (
            <Fragment key={m.properties?.id}>
              {m.geometry.coordinates.length > 0 && (

                <>
                  <Source
                    data={m as Feature}
                    id={m.properties?.id + 'source'}
                    type="geojson"
                  ></Source>

                  {storyID === '' && storyData && (
                    <Popup
                      anchor="bottom"
                      closeOnClick={false}
                      latitude={m.geometry.coordinates[0][1]}
                      longitude={m.geometry.coordinates[0][0]}
                      // onClose={() => setPopupInfo(null)}
                    >
                      <div
                        className="cursor-pointer rounded-xl border-slate-500 bg-white shadow-xl"
                        onClick={() => selectStory(m)}
                      >
                        <ViewerPopup
                          // @ts-expect-error
                          firstStepId={storyData.firstStepId}
                          story={storyData}
                        />
                      </div>
                    </Popup>
                  )}
                  {storyID != '' && (
                    <>
                      <Markers
                        markers={markers}
                        // onClick={m => router.push(`/viewer/story/${SLUGWHERE}}/${m.position}`)}
                      />
                    </>
                  )}
                </>
              )}
            </Fragment>
          )
        })}
    </Map>
  )
}

'use client'

import { SlideContent, Story, StoryStep, Theme } from '@prisma/client'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { MapRef, Popup, Source } from 'react-map-gl'
import { Feature, GeoJsonProperties, LineString } from 'geojson'
// import { LineString } from 'geojson'
import { Button } from './../Elements/Button'
import { usePathname, useRouter } from 'next/navigation'
import mapboxgl from 'mapbox-gl'
import React from 'react'
import Markers from './ViewerMap/Layers/Markers'
import StorySourceLayer from './ViewerMap/Layers/StorySourceAndLayer'
import { useBoundStore } from '@/src/lib/store/store'
import { getSlideTitle } from '@/src/lib/getSlideTitle'
import Map from '../Map'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { useTranslation } from '@/src/app/i18n/client'
import { StoryBadge } from '../Studio/Mapstories/StoryBadge'
import { applyTheme } from '@/src/helper/applyTheme'

type ViewerViewProps = {
  inputStories:
    | (Story & {
        theme?: Theme | null
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

  const [markers, setMarkers] = useState<any[]>([])
  const [selectedStorySlug, setSelectedStorySlug] = useState<string>()

  const router = useRouter()
  const [cursor, setCursor] = useState<string>('auto')

  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  const { t } = useTranslation(lng, 'viewer')
  const setViewerStories = useBoundStore(state => state.setViewerStories)
  const stories = useBoundStore(state => state.viewerStories)

  useEffect(() => {
    if (selectedStepIndex != undefined) {
      updateToStep(selectedStepIndex)
    }
  }, [selectedStepIndex])

  useEffect(() => {
    if (inputStories && inputStories.length > 0) {
      setViewerStories(inputStories)
    }
  }, [inputStories])

  useEffect(() => {
    extractGeoJson(stories)
  }, [stories])

  useEffect(() => {
    // Zoom back to former extend if not viewing a story
    const pathend = path?.split('/').at(-1)
    const pathend2 = path?.split('/').at(-2)
    if (pathend === 'all' && pathend2 === 'mystories') {
      setStoryID('')
      if (savedView) {
        mapRef.current?.fitBounds(savedView)
      }
    }
    if (pathend2 === 'gallery') {
      setStoryID('')
      setViewerStories([])
    }
  }, [path])

  useEffect(() => {
    if (mapData) {
      // drawMapData(mapData)
      const ids = mapData
        ?.map(m => {
          if (m.geometry.coordinates.length > 0) {
            return m.properties?.id.toString() + 'buffer'
          }
        })
        .filter(item => item != undefined)
      setInteractiveLayerIds(ids)
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
    const pathend = path?.split('/').at(-1)
    const pathend2 = path?.split('/').at(-2)
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
        .map(({ id, feature, position, content }) => {
          const geoFeature =
            feature as unknown as GeoJSON.Feature<GeoJSON.Point>
          if (geoFeature?.geometry?.coordinates?.length > 0) {
            if (bounds === undefined) {
              bounds = new mapboxgl.LngLatBounds(
                [
                  geoFeature?.geometry?.coordinates[0],
                  geoFeature?.geometry?.coordinates[1],
                ],
                [
                  geoFeature?.geometry?.coordinates[0],
                  geoFeature?.geometry?.coordinates[1],
                ],
              )
            } else {
              bounds.extend([
                geoFeature?.geometry?.coordinates[0],
                geoFeature?.geometry?.coordinates[1],
              ])
            }
            const newMarker: any = {
              longitude: geoFeature.geometry.coordinates[0],
              latitude: geoFeature.geometry.coordinates[1],
              position: position,
              stepId: id,
              color: '#18325b',
              title: getSlideTitle(content),
            }
            return newMarker
          }
        })
      // @ts-ignore
      setMarkers(newMarkers)

      //save bounds to zoomTo once map is initiated
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
        .filter((step: any) => {
          const geoFeature = step.feature as GeoJSON.Feature<GeoJSON.Point>
          return geoFeature?.geometry?.coordinates?.length > 0
        })
        .sort((a: any, b: any) => a.position - b.position)
        .map((step: any) => {
          const geoFeature = step.feature as GeoJSON.Feature<GeoJSON.Point>
          return geoFeature.geometry.coordinates
        })

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
    console.log(geojsons, 'geojsons')
    setMapData(geojsons)
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
    router.push(`${pathLocal}/story/${m.properties?.slug}/start`)
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

  function calculateZoomLogarithmic(distance: number): number {
    const maxZoom = 12 // Maximaler Zoom-Level
    const minZoom = 2 // Minimaler Zoom-Level
    const scaleFactor = 1.1 // Ein Skalierungsfaktor

    const adjustedZoom = maxZoom - Math.log(distance + 1) * scaleFactor
    return Math.max(Math.min(adjustedZoom, maxZoom), minZoom)
  }

  function updateToStep(index: number) {
    const story = stories?.filter(story => story.id === storyID)[0]
    if (
      story?.steps?.length &&
      index <=
        Math.max.apply(
          Math,
          story?.steps?.map(step => step.position),
        )
    ) {
      const stepFeat = story?.steps.find(step => step.position === index)
        ?.feature as unknown as Feature<GeoJSON.Point>
      if (!stepFeat || !stepFeat.geometry) {
        return
      }

      // take either next or previous step
      const previousStepFeat = story?.steps.find(step => {
        return index === 0
          ? step.position === index + 1
          : step.position === index - 1
      })?.feature as unknown as Feature<GeoJSON.Point>

      if (!previousStepFeat || !previousStepFeat?.geometry) {
        mapRef.current?.flyTo({
          center: [
            stepFeat.geometry.coordinates[0],
            stepFeat.geometry.coordinates[1],
          ],
          offset: [-window.innerWidth / 7, -75],
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
          offset: [-window.innerWidth / 7, -75],
          zoom: calculateZoomLogarithmic(distance),
          essential: true,
          duration: 1000,
        })
      }
    }
  }

  // const onHover = (event: mapboxgl.MapLayerMouseEvent) => {
  //   const hoverSteps = event.features

  //   if (!hoverSteps || hoverSteps.length < 1) {
  //     setCursor('auto')
  //     return
  //   }
  //   setCursor('pointer')
  // }

  const onMapLoad = useCallback(() => {
    if (selectedStepIndex) {
      updateToStep(selectedStepIndex)
    }
    if (Number.isNaN(selectedStepIndex) && mapRef.current && startView) {
      mapRef.current?.fitBounds(startView)
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
      <StorySourceLayer
        geojsons={mapData}
        selectedFeature={selectedFeature}
        selectedStepIndex={selectedStepIndex}
        storyID={storyID}
      />

      {mapData &&
        mapData.map((m, i) => {
          return (
            <Fragment key={m.properties?.id}>
              {m.geometry.coordinates.length > 0 && (
                <>
                  <Source
                    data={m as Feature}
                    id={m.properties?.id + 'source'}
                    type="geojson"
                  ></Source>

                  {storyID === '' && (
                    <Popup
                      anchor="top"
                      closeOnClick={false}
                      latitude={m.geometry.coordinates[0][1]}
                      longitude={m.geometry.coordinates[0][0]}
                      // onClose={() => setPopupInfo(null)}
                    >
                      <div className="re-basic-box-no-filter overflow-hidden">
                        <div className="p-5">
                          <StoryBadge mode={m.properties?.mode} />
                          <h3>{m.properties?.name}</h3>
                          <p> {m.properties?.desc}</p>
                          <div className="mt-2 flex justify-end">
                            <Button className="" onClick={() => selectStory(m)}>
                              {t('more')}
                            </Button>
                          </div>
                        </div>
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

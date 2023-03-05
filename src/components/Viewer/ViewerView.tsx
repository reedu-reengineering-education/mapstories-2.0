'use client'

import { SlideContent, Story, StoryStep } from '@prisma/client'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { MapRef, Popup, Source } from 'react-map-gl'
import { Feature } from 'geojson'
// import { LineString } from 'geojson'
import ViewerMap from './ViewerMap'
import { Button } from './../Elements/Button'
import { usePathname, useRouter } from 'next/navigation'
import mapboxgl from 'mapbox-gl'
import { useStoryStore } from '@/src/lib/store/story'
import React from 'react'
import Markers from './ViewerMap/Layers/Markers'
import StorySourceLayer from './ViewerMap/Layers/StorySourceAndLayer'

type ViewerViewProps = {
  stories:
    | (Story & {
        steps: (StoryStep & { content: SlideContent[] })[]
    })[]
}

export default function ViewerView({ stories }: ViewerViewProps) {
  const mapRef = useRef<MapRef>()
  const path = usePathname()
  const storyID = useStoryStore(state => state.storyID)
  const setStoryID = useStoryStore(state => state.setStoryID)

  const selectedStepIndex = useStoryStore(state => state.selectedStepIndex)

  const [mapData, setMapData] = useState<
    GeoJSON.Feature<GeoJSON.LineString>[] | undefined
  >()
  const [selectedFeature, setSelectedFeature] = useState<Feature | undefined>()

  const [interactiveLayerIds, setInteractiveLayerIds] = useState<any[]>()
  const [savedView, setSavedView] = useState<any>()
  const [markers, setMarkers] = useState<any[]>([])
  const [selectedStorySlug, setSelectedStorySlug] = useState<string>()

  const router = useRouter()

  useEffect(() => {
    updateToStep(selectedStepIndex)
  }, [selectedStepIndex])

  useEffect(() => {
    extractGeoJson(stories)
  }, [stories])

  useEffect(() => {
    // Zoom back to former extend if not viewing a story
    const pathend = path?.split('/').at(-1)
    if (pathend === 'viewer') {
      setStoryID('')
      if (savedView) {
        mapRef.current?.fitBounds(savedView)
      }
    }
  }, [path])

  useEffect(() => {
    if (mapData) {
      // drawMapData(mapData)
      const ids = mapData
        ?.map(m => {
          if (m.geometry.coordinates.length > 0) {
            return m.properties.id.toString() + 'buffer'
          }
        })
        .filter(item => item != undefined)
      setInteractiveLayerIds(ids)
    }
  }, [mapData])

  // generate markers
  useEffect(() => {
    const story = stories?.filter(story => story.id === storyID)[0]
    if (story?.steps) {
      const newMarkers = story?.steps.map(
        ({ id, feature, position, content }) => {
          const geoFeature =
            feature as unknown as GeoJSON.Feature<GeoJSON.Point>
          const title = content.filter((item: SlideContent) => item.title)
          if (geoFeature?.geometry?.coordinates?.length > 0) {
            const newMarker: any = {
              longitude: geoFeature.geometry.coordinates[0],
              latitude: geoFeature.geometry.coordinates[1],
              position: position,
              stepId: id,
              color: '#18325b',
              title: title[0] ? title[0].title : 'No title',
            }
            return newMarker
          }
        },
      )
      // @ts-ignore
      setMarkers(newMarkers)
    }
  }, [storyID])

  function extractGeoJson(
    currentStories:
      | (Story & {
          steps?: StoryStep[] | undefined
        })[]
      | undefined,
  ) {
    const geojsons: any[] = []
    if (!currentStories) {
      return
    }
    currentStories.forEach(s => {
      const story: any[] = []
      if (!s?.steps) {
        return
      }
      s.steps.forEach((step: StoryStep) => {
        const geoFeature =
          step.feature as unknown as GeoJSON.Feature<GeoJSON.Point>
        if (geoFeature?.geometry?.coordinates?.length > 0) {
          story.push([
            geoFeature.geometry.coordinates[0],
            geoFeature.geometry.coordinates[1],
          ])
        }
      })
      geojsons.push({
        type: 'Feature',
        properties: {
          id: s.id,
          desc: s.description,
          name: s.name,
          slug: s.slug,
        },
        geometry: {
          type: 'LineString',
          coordinates: story,
        },
      })
    })
    setMapData(geojsons)
  }

  function selectStory(m) {
    if (m) {
      const coordinates = m.geometry.coordinates

      // Create a 'LngLatBounds' with both corners at the first coordinate.
      const bounds = new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])

      // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
      for (const coord of coordinates) {
        bounds.extend(coord)
      }
      if (mapRef) {
        setSavedView(mapRef.current?.getBounds())
        mapRef.current?.fitBounds(bounds, {
          padding: 100,
        })
      }
    }
    setSelectedStorySlug(m.properties.slug)
    router.push(`/viewer/story/${m.properties.slug}/0`)
  }

  function updateToStep(index) {
    const story = stories?.filter(story => story.id === storyID)[0]
    if (story?.steps?.length && story?.steps?.length > index) {
      if (mapRef && story.steps[index].feature) {
        mapRef.current?.flyTo({
          center: [
            story?.steps[index].feature.geometry.coordinates[0],
            story?.steps[index].feature.geometry.coordinates[1],
          ],
          zoom: 15,
          essential: true,
        })
      }
    }
  }

  const onHover = useCallback(event => {
    //TODO: we want this?

    // const feature = event.features && event.features[0]
    // if (feature) {
    //   // setPopupPosition(event.lngLat)
    //   setSelectedFeature(feature)
    // } else {
    //   setSelectedFeature(undefined)
    // }
  }, [])

  const onMapLoad = React.useCallback(() => {
    if (selectedStepIndex) {
      updateToStep(selectedStepIndex)
    }
  }, [])

  return (
    <div>
      <ViewerMap
        interactiveLayerIds={interactiveLayerIds}
        onLoad={onMapLoad}
        onMouseMove={onHover}
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
              <Fragment key={i}>
                {m.geometry.coordinates.length > 0 && (
                  <>
                    <Source
                      data={m as Feature}
                      id={m.properties.id + 'source'}
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
                        <div className="re-basic-box-no-filter">
                          <div className="p-5">
                            <h3>{m.properties?.name}</h3>
                            <p> {m.properties?.desc}</p>
                            <div className="mt-2 flex justify-end">
                              <Button
                                className=""
                                onClick={() => selectStory(m)}
                              >
                                Mehr erfahren
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
      </ViewerMap>
    </div>
  )
}

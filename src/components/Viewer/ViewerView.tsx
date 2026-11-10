'use client'

import { SlideContent, Story, StoryStep, Theme } from '@prisma/client'
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { MapRef, Marker, Source } from 'react-map-gl'
import { Feature, GeoJsonProperties, LineString } from 'geojson'
// import { LineString } from 'geojson'
import { usePathname, useRouter } from 'next/navigation'
import mapboxgl from 'mapbox-gl'
import React from 'react'
import Markers from './ViewerMap/Layers/Markers'
import { useBoundStore } from '@/src/lib/store/store'
import { getSlideTitle } from '@/src/lib/getSlideTitle'
import { getContinent, getRegion } from '@/src/lib/geoRegions'
import Map from '../Map'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { applyTheme } from '@/src/helper/applyTheme'
import StorySourceLayer from './ViewerMap/Layers/StorySourceAndLayer'
import {
  getGalleryCardSize,
  getStoryAccent,
} from './Gallery/GalleryStoryMarker'
import { GalleryStoryCluster } from './Gallery/GalleryStoryCluster'
import {
  GalleryStoryPreview,
  PreviewStation,
} from './Gallery/GalleryStoryPreview'
import { useBreakpoint } from '@/src/lib/hooks/useBreakpoint'
import { getSiteFromHost } from '@/src/lib/site'
import {
  getBaseThemeForSite,
  getRouteColor,
  getSiteAccent,
} from '@/src/lib/theme'
import { ErrorBoundary } from '@/src/components/ErrorBoundary'
import { navigateToStep } from '@/src/lib/viewerNavigation'

type ViewerViewProps = {
  inputStories: (Story & {
    theme?: Theme | null
    firstStep?: (StoryStep & { content: SlideContent[] }) | null
    steps: (StoryStep & { content: SlideContent[] })[]
  })[]
}

type GalleryCluster = {
  // id of the first story; the stack sits on that story's location
  leaderId: string
  members: { id: string; offset: [number, number] }[]
}

// extra space between cards before they count as overlapping
const CLUSTER_MARGIN = 12

// below these zoom levels, stories are only stacked together if they are on
// the same continent / in the same region (see src/lib/geoRegions.ts), even
// if their cards overlap; above, purely by on-screen overlap
const CONTINENT_ZOOM = 2.5
const REGION_ZOOM = 4

// gallery cards shrink when zoomed out, otherwise two cards cover most of the
// globe: MIN_CARD_SCALE at MIN_SCALE_ZOOM and below, full size from
// FULL_SCALE_ZOOM on, linear in between
const MIN_CARD_SCALE = 0.6
const MIN_SCALE_ZOOM = 1.5
const FULL_SCALE_ZOOM = 3.5

function getCardScale(zoom: number) {
  const t = (zoom - MIN_SCALE_ZOOM) / (FULL_SCALE_ZOOM - MIN_SCALE_ZOOM)
  const scale = MIN_CARD_SCALE + (1 - MIN_CARD_SCALE) * t
  // rounded, so tiny zoom changes don't re-render all cards
  return Math.round(Math.min(1, Math.max(MIN_CARD_SCALE, scale)) * 20) / 20
}

// A point is on the far side of the globe if projecting it to the screen and
// back lands somewhere else (unproject hits the front of the sphere).
function isBehindGlobe(map: MapRef, lng: number, lat: number) {
  const back = map.unproject(map.project([lng, lat]))
  let dLng = Math.abs(back.lng - lng) % 360
  dLng = Math.min(dLng, 360 - dLng)
  return dLng > 0.5 || Math.abs(back.lat - lat) > 0.5
}

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

type SavedCamera = {
  center: [number, number]
  zoom: number
  bearing: number
  pitch: number
}

function readCamera(map: MapRef | null | undefined): SavedCamera | undefined {
  try {
    if (!map) {
      return undefined
    }
    const center = map.getCenter()
    const camera: SavedCamera = {
      center: [center.lng, center.lat],
      zoom: map.getZoom(),
      bearing: map.getBearing(),
      pitch: map.getPitch(),
    }
    const valid = [...camera.center, camera.zoom, camera.bearing, camera.pitch]
    return valid.every(Number.isFinite) ? camera : undefined
  } catch {
    return undefined
  }
}

function prefersReducedMotion() {
  try {
    return (
      typeof window !== 'undefined' &&
      !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    )
  } catch {
    return false
  }
}

// gallery -> story transition timings (ms)
const CARD_EXIT_DURATION = 380
const STORY_FLY_DURATION = 3200
// story -> gallery: the flight back is a bit quicker and the cards already
// start popping in while the camera is still moving
const GALLERY_RETURN_FLY_DURATION = 2400
const GALLERY_ENTRANCE_AT = 0.35

// camera never zooms in closer than this when showing a story / step
// (~city level instead of street level, also gives mapbox time to load tiles)
const MAX_STORY_ZOOM = 11
const MIN_FLY_DURATION = 1500
const MAX_FLY_DURATION = 4500

// flight duration scaled by how far the camera has to zoom and travel, so a
// globe -> city flight is not squeezed into one second
function getFlyDuration(
  map: { getZoom: () => number } | undefined | null,
  targetZoom: number,
  distanceKm = 0,
) {
  const currentZoom = map?.getZoom?.() ?? 2
  const zoomDelta = Math.abs(targetZoom - currentZoom)
  const duration = 1000 + zoomDelta * 350 + Math.min(distanceKm, 5000) * 0.3
  return Math.round(
    Math.min(MAX_FLY_DURATION, Math.max(MIN_FLY_DURATION, duration)),
  )
}

function ViewerViewInner({ inputStories }: ViewerViewProps) {
  const mapRef = useRef<MapRef>(null)

  const path = usePathname()
  const storyID = useBoundStore(state => state.storyID)
  const setStoryID = useBoundStore(state => state.setStoryID)
  const selectedStepIndex = useBoundStore(state => state.selectedStepIndex)

  const [mapData, setMapData] = useState<
    GeoJSON.Feature<GeoJSON.LineString>[] | undefined
  >()
  const [selectedFeature, setSelectedFeature] = useState<Feature | undefined>()

  const [interactiveLayerIds, setInteractiveLayerIds] = useState<any[]>()
  // camera of the gallery/list view before a story was opened. Stored as a
  // camera instead of getBounds(): on the globe, getBounds() spans up to the
  // pole whenever the pole is visible, and fitBounds() to that box ends up
  // zooming onto the north pole.
  const [savedView, setSavedView] = useState<SavedCamera>()
  const [startView, setStartView] = useState<any>()
  const [pathend2, setPathend2] = useState<string | undefined>('')
  const [markers, setMarkers] = useState<any[]>([])
  const [selectedStorySlug, setSelectedStorySlug] = useState<string>()
  const [hoveredStoryId, setHoveredStoryId] = useState<string>()
  // gallery cards grouped into stacks so they never overlap on screen
  const [clusters, setClusters] = useState<GalleryCluster[]>()
  // size factor of the gallery cards for the current zoom, see getCardScale
  const [cardScale, setCardScale] = useState(1)
  // gallery anchors currently on the far side of the globe (we hide those
  // ourselves, because mapbox' own marker fading is disabled via CSS, see
  // [data-gallery-cluster] in re-mapbox.scss)
  const [behindGlobeKey, setBehindGlobeKey] = useState('')
  const [expandedClusterId, setExpandedClusterId] = useState<string>()
  const [collapseSignal, setCollapseSignal] = useState(0)
  // story whose card was clicked: cards play their exit animation
  const [leavingStory, setLeavingStory] = useState<{
    id: string
    lng: number
    lat: number
    color: string
  }>()
  // pulsing rings on the clicked story's location (outlives the cards)
  const [ripple, setRipple] = useState<{
    key: number
    lng: number
    lat: number
    color: string
  }>()
  // story -> gallery: cards stay hidden during the flight back, then enter
  const [galleryEntrance, setGalleryEntrance] = useState<{
    fromStoryId: string
    phase: 'hidden' | 'entering'
  }>()
  // delays the overview path drawing until the camera has arrived
  const [overviewDelay, setOverviewDelay] = useState(0)
  const transitionTimers = useRef<ReturnType<typeof setTimeout>[]>([])
  const { width } = useBreakpoint()

  // the story text box covers the right side (desktop) / the bottom (mobile)
  // of the map, so the camera always puts the marker left of / above center
  function getStoryCameraOffset(): [number, number] {
    if (width < 768) {
      return [0, -window.innerHeight * 0.25]
    }
    return [-width / 5, 0]
  }

  // same shift as getStoryCameraOffset, expressed as fitBounds padding
  function getStoryCameraPadding() {
    if (width < 768) {
      return {
        top: 60,
        left: 40,
        right: 40,
        bottom: Math.round(window.innerHeight * 0.5) + 60,
      }
    }
    return {
      top: 100,
      bottom: 100,
      left: 100,
      right: 100 + Math.round((width * 2) / 5),
    }
  }
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
        mapRef.current?.flyTo({ ...savedView, essential: true })
      }
    }
    if (path?.split('/').at(-2) === 'gallery') {
      const fromStoryId = storyID
      setStoryID('')
      setViewerStories(inputStories)
      if (fromStoryId && !prefersReducedMotion()) {
        playGalleryReturn(fromStoryId)
      } else if (savedView) {
        mapRef.current?.flyTo({ ...savedView, essential: true })
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
      const site = getSiteFromHost(
        typeof window !== 'undefined' ? window.location.hostname : undefined,
      )
      applyTheme(getBaseThemeForSite(site))
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
  }

  function clearTransitionTimers() {
    transitionTimers.current.forEach(clearTimeout)
    transitionTimers.current = []
  }

  useEffect(() => clearTransitionTimers, [])

  // a story is open now (or we are back in the gallery): end the exit state
  useEffect(() => {
    setLeavingStory(undefined)
  }, [storyID])

  // back from a story: fly to the previous gallery view, then let the cards
  // pop in again (the story we came from grows out of its location first)
  function playGalleryReturn(fromStoryId: string) {
    clearTransitionTimers()
    setLeavingStory(undefined)
    setHoveredStoryId(undefined)
    setOverviewDelay(0)
    setGalleryEntrance({ fromStoryId, phase: 'hidden' })

    const flyDuration = savedView ? GALLERY_RETURN_FLY_DURATION : 0
    const entranceStart = Math.round(flyDuration * GALLERY_ENTRANCE_AT)
    if (savedView) {
      try {
        mapRef.current?.flyTo({
          ...savedView,
          duration: flyDuration,
          essential: true,
          easing: easeInOutCubic,
        })
      } catch (e) {
        console.warn('Could not fly back to gallery view:', e)
      }
    }

    transitionTimers.current.push(
      setTimeout(() => {
        computeClustersRef.current()
        setGalleryEntrance({ fromStoryId, phase: 'entering' })
        const anchor = galleryAnchorsRef.current.find(
          a => a.id === fromStoryId,
        )
        if (anchor) {
          setRipple({
            key: Date.now(),
            lng: anchor.lng,
            lat: anchor.lat,
            color: getStoryAccent(anchor.story),
          })
        }
      }, entranceStart),
      // the stacks computed mid-flight are refreshed once the camera stops
      // (onMoveEnd), this only ends the entrance state
      setTimeout(() => setRipple(undefined), entranceStart + 1400),
      setTimeout(
        () => setGalleryEntrance(undefined),
        Math.max(entranceStart + 1200, flyDuration + 100),
      ),
    )
  }

  // gallery card clicked: play the exit animation, then fly to the story
  function startStoryTransition(
    m: GeoJSON.Feature<GeoJSON.LineString>,
    location: { id: string; lng: number; lat: number; color: string },
  ) {
    if (leavingStory) {
      return
    }
    if (prefersReducedMotion()) {
      selectStory(m)
      return
    }
    clearTransitionTimers()
    setLeavingStory(location)
    setRipple({ ...location, key: Date.now() })
    setHoveredStoryId(undefined)
    setOverviewDelay(STORY_FLY_DURATION)
    transitionTimers.current.push(
      setTimeout(() => selectStory(m, STORY_FLY_DURATION), CARD_EXIT_DURATION),
      setTimeout(() => setRipple(undefined), CARD_EXIT_DURATION + 1400),
      // fallback in case the navigation never sets the story id
      setTimeout(() => setLeavingStory(undefined), 4000),
      // later visits of the overview should draw immediately again
      setTimeout(
        () => setOverviewDelay(0),
        CARD_EXIT_DURATION + STORY_FLY_DURATION + 1500,
      ),
    )
  }

  function selectStory(
    m: GeoJSON.Feature<GeoJSON.LineString>,
    flyDuration?: number,
  ) {
    setSelectedStorySlug(m.properties?.slug)

    if (m) {
      // Stories without lines are stored as one Point feature per step, so
      // collect the coordinates of all features belonging to this story.
      const features = (mapData ?? [m]) as GeoJSON.Feature<
        GeoJSON.Point | GeoJSON.LineString
      >[]
      const coordinates = features
        .filter(f => f.properties?.id === m.properties?.id)
        .flatMap(f =>
          f.geometry.type === 'Point'
            ? [f.geometry.coordinates]
            : f.geometry.coordinates,
        )
        .filter(c => Number.isFinite(c?.[0]) && Number.isFinite(c?.[1]))

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
          // only remember the view we come from when leaving the overview
          // (gallery / list), not when switching between stories
          if (!storyID) {
            const camera = readCamera(mapRef.current)
            if (camera) {
              setSavedView(camera)
            }
          }
          mapRef.current?.fitBounds(
            bounds,
            flyDuration
              ? {
                  padding: getStoryCameraPadding(),
                  maxZoom: MAX_STORY_ZOOM,
                  duration: flyDuration,
                  essential: true,
                  // smooth ease-in-out for the gallery -> story flight
                  easing: easeInOutCubic,
                }
              : {
                  padding: getStoryCameraPadding(),
                  maxZoom: MAX_STORY_ZOOM,
                  duration: getFlyDuration(mapRef.current, MAX_STORY_ZOOM),
                  essential: true,
                },
          )
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
    const maxZoom = MAX_STORY_ZOOM
    if (!Number.isFinite(distance) || distance <= 0) {
      return maxZoom
    }

    // Gewichtete Anpassung: Kleinere Entfernungen -> Höherer Zoom, größere Entfernungen -> Weniger Zoom
    const weight = 2 // Gewichtung anpassen
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

      if (!previousStepFeat?.geometry?.coordinates) {
        const [lng, lat] = stepFeat.geometry.coordinates
        mapRef.current?.flyTo({
          center: [lng, lat],
          offset: getStoryCameraOffset(),
          zoom: 8,
          essential: true,
          duration: getFlyDuration(mapRef.current, 8),
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

        const targetZoom = calculateWeightedZoom(distance)
        mapRef.current?.flyTo({
          center: [
            feature.geometry.coordinates[0],
            feature.geometry.coordinates[1],
          ],
          offset: getStoryCameraOffset(),
          zoom: targetZoom,
          essential: true,
          duration: getFlyDuration(mapRef.current, targetZoom, distance),
        })
      }
    }
  }

  // path + stations of the story currently hovered in the gallery
  // path (station coordinates sorted by position) + accent color of a story
  function buildStoryPath(id: string | undefined) {
    if (!id || !Array.isArray(stories)) {
      return undefined
    }
    try {
      const story = stories.find(s => s?.id === id)
      if (!story || !Array.isArray(story.steps)) {
        return undefined
      }
      const stations = story.steps
        .filter(Boolean)
        .slice()
        .sort((a, b) => (Number(a.position) || 0) - (Number(b.position) || 0))
        .map((step): PreviewStation | undefined => {
          const c = parseFeature(step.feature)?.geometry?.coordinates
          if (!Array.isArray(c)) {
            return undefined
          }
          const coordinates: [number, number] = [Number(c[0]), Number(c[1])]
          if (!coordinates.every(Number.isFinite)) {
            return undefined
          }
          let title: string | undefined
          try {
            title = getSlideTitle(step.content) || undefined
          } catch {
            title = undefined
          }
          return { coordinates, position: Number(step.position), title }
        })
        .filter((s): s is PreviewStation => !!s)
      return {
        storyId: story.id,
        stations,
        color: getStoryAccent(story),
        lineColor: getRouteColor(story.topic),
      }
    } catch (e) {
      console.warn('Could not build story path preview:', e)
      return undefined
    }
  }

  // open a step from the story overview, same URL scheme as <Markers />
  function openStep(station: PreviewStation) {
    if (!Number.isFinite(station.position)) {
      return
    }
    navigateToStep(station.position as number)
  }

  // markers and route of the opened story follow the site design
  // (BFDW orange or the standard MapStories color), not the story theme
  const storyAccent = useMemo(
    () =>
      getSiteAccent(
        getSiteFromHost(
          typeof window !== 'undefined' ? window.location.hostname : undefined,
        ),
      ),
    [],
  )

  // route of the opened story: color of its topic area, else standard color
  const storyRouteColor = useMemo(
    () => getRouteColor(stories?.find(s => s?.id === storyID)?.topic),
    [stories, storyID],
  )

  // story currently hovered in the gallery
  const hoverPreview = useMemo(
    () => (storyID === '' ? buildStoryPath(hoveredStoryId) : undefined),
    [hoveredStoryId, storyID, stories],
  )

  // overview page of an opened story (.../story/<slug>/start)
  const isStoryOverview = path?.split('/').at(-1) === 'start'
  const overviewPreview = useMemo(
    () =>
      storyID !== '' && isStoryOverview ? buildStoryPath(storyID) : undefined,
    [storyID, isStoryOverview, stories],
  )

  // one gallery card per story, placed on the story's first location
  const galleryAnchors = useMemo(() => {
    if (!mapData || !Array.isArray(stories)) {
      return []
    }
    const seen = new Set<string>()
    const result: {
      id: string
      feature: GeoJSON.Feature<GeoJSON.LineString>
      story: (typeof stories)[number]
      lng: number
      lat: number
      continent: string
      region: string
    }[] = []
    for (const m of mapData) {
      const id = m?.properties?.id
      if (!id || seen.has(id)) {
        continue
      }
      seen.add(id)
      const story = stories.find(s => s?.id === id)
      if (!story) {
        continue
      }
      const geometry = m.geometry as GeoJSON.Point | GeoJSON.LineString
      const [lng, lat] =
        geometry?.type === 'Point'
          ? geometry.coordinates
          : geometry?.coordinates?.[0] ?? []
      if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
        continue
      }
      result.push({
        id,
        feature: m,
        story,
        lng,
        lat,
        continent: getContinent(lng, lat),
        region: getRegion(lng, lat),
      })
    }
    return result
  }, [mapData, stories])

  // used from timers, which would otherwise see a stale list
  const galleryAnchorsRef = useRef(galleryAnchors)
  galleryAnchorsRef.current = galleryAnchors

  const cardSize = getGalleryCardSize(width)

  // group stories whose cards would overlap at the current zoom level
  // (connected components of the "cards overlap" graph, in gallery order)
  const computeClusters = useCallback(() => {
    const map = mapRef.current
    if (!map || galleryAnchors.length === 0) {
      setClusters(undefined)
      return
    }
    try {
      const zoom = map.getZoom()
      const scale = getCardScale(zoom)
      // which stories may share a stack at this zoom level
      const groupKeys = galleryAnchors.map(a =>
        zoom < CONTINENT_ZOOM
          ? a.continent
          : zoom < REGION_ZOOM
            ? a.region
            : '',
      )
      // stories on the far side of the globe are hidden and their projected
      // position is meaningless, never stack them with visible ones
      const behind = galleryAnchors.map(a => isBehindGlobe(map, a.lng, a.lat))
      const points = galleryAnchors.map(a => {
        const p = map.project([a.lng, a.lat])
        return [p.x, p.y] as [number, number]
      })
      const parent = points.map((_, i) => i)
      const find = (i: number): number => {
        while (parent[i] !== i) {
          parent[i] = parent[parent[i]]
          i = parent[i]
        }
        return i
      }
      const maxDx = cardSize.width * scale + CLUSTER_MARGIN
      const maxDy = cardSize.height * scale + CLUSTER_MARGIN
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          if (
            !behind[i] &&
            !behind[j] &&
            groupKeys[i] === groupKeys[j] &&
            Math.abs(points[i][0] - points[j][0]) < maxDx &&
            Math.abs(points[i][1] - points[j][1]) < maxDy
          ) {
            const ri = find(i)
            const rj = find(j)
            // keep the earlier story (gallery order) as root / leader
            parent[Math.max(ri, rj)] = Math.min(ri, rj)
          }
        }
      }
      const groups = new globalThis.Map<number, number[]>()
      points.forEach((_, i) => {
        const root = find(i)
        groups.set(root, [...(groups.get(root) ?? []), i])
      })
      setCardScale(scale)
      setClusters(
        Array.from(groups.entries()).map(([root, indices]) => ({
          leaderId: galleryAnchors[root].id,
          members: indices.map(i => ({
            id: galleryAnchors[i].id,
            offset: [
              points[i][0] - points[root][0],
              points[i][1] - points[root][1],
            ] as [number, number],
          })),
        })),
      )
    } catch (e) {
      console.warn('Could not compute gallery clusters:', e)
      setClusters(undefined)
    }
  }, [galleryAnchors, cardSize.width, cardSize.height])

  // map event handlers are bound once, so always call the latest version
  const computeClustersRef = useRef(computeClusters)
  computeClustersRef.current = computeClusters

  useEffect(() => {
    computeClusters()
  }, [computeClusters])

  const updateBehindGlobe = useCallback(() => {
    const map = mapRef.current
    if (!map) {
      return
    }
    const hidden: string[] = []
    try {
      for (const a of galleryAnchorsRef.current) {
        if (isBehindGlobe(map, a.lng, a.lat)) {
          hidden.push(a.id)
        }
      }
    } catch {
      return
    }
    const key = hidden.sort().join('|')
    setBehindGlobeKey(current => (current === key ? current : key))
  }, [])
  const behindGlobeFrame = useRef(0)
  const scheduleBehindGlobe = useCallback(() => {
    if (behindGlobeFrame.current) {
      return
    }
    behindGlobeFrame.current = requestAnimationFrame(() => {
      behindGlobeFrame.current = 0
      updateBehindGlobe()
    })
  }, [updateBehindGlobe])
  useEffect(() => {
    updateBehindGlobe()
  }, [galleryAnchors, updateBehindGlobe])
  useEffect(() => () => cancelAnimationFrame(behindGlobeFrame.current), [])
  const behindGlobe = useMemo(
    () => new Set(behindGlobeKey ? behindGlobeKey.split('|') : []),
    [behindGlobeKey],
  )

  // fall back to one card per story until the map can project coordinates
  const visibleClusters: GalleryCluster[] =
    clusters ??
    galleryAnchors.map(a => ({
      leaderId: a.id,
      members: [{ id: a.id, offset: [0, 0] }],
    }))

  const onMapLoad = useCallback(() => {
    computeClustersRef.current()
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

        /// calculate the bounds fit the view to the bounds
          const targetZoom = calculateWeightedZoom(distance)
          mapRef.current?.flyTo({
            center: startView.getCenter(),
            zoom: targetZoom,
            offset: getStoryCameraOffset(),
            essential: true,
            duration: getFlyDuration(mapRef.current, targetZoom),
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
      onMove={scheduleBehindGlobe}
      onMoveEnd={() => {
        computeClustersRef.current()
        updateBehindGlobe()
      }}
      onMoveStart={() => setCollapseSignal(c => c + 1)}
      onResize={() => computeClustersRef.current()}
      // onMouseMove={onHover}
      ref={mapRef}
    >
      {hoverPreview && (
        // keyed per story: a broken story only loses its own preview
        <ErrorBoundary key={hoverPreview.storyId} name="GalleryStoryPreview">
          <GalleryStoryPreview
            color={hoverPreview.color}
            idPrefix="gallery-hover"
            lineColor={hoverPreview.lineColor}
            stations={hoverPreview.stations}
            storyId={hoverPreview.storyId}
          />
        </ErrorBoundary>
      )}

      {overviewPreview && (
        // same animated path + numbered stations on the story overview;
        // replaces the default <Markers /> there, clicking opens the step
        <ErrorBoundary
          key={overviewPreview.storyId}
          name="StoryOverviewPreview"
        >
          <GalleryStoryPreview
            color={overviewPreview.color}
            delay={overviewDelay}
            idPrefix="story-overview"
            lineColor={overviewPreview.lineColor}
            onStationClick={openStep}
            stations={overviewPreview.stations}
            stationsFirst
            storyId={overviewPreview.storyId}
          />
        </ErrorBoundary>
      )}

      {pathend2 != 'gallery' && (
        <StorySourceLayer
          color={storyRouteColor}
          geojsons={mapData}
          selectedFeature={selectedFeature}
          selectedStepIndex={selectedStepIndex}
          storyID={storyID}
        />
      )}

      {ripple && (
        <Marker
          anchor="center"
          key={ripple.key}
          latitude={ripple.lat}
          longitude={ripple.lng}
          style={{ zIndex: 40, pointerEvents: 'none' }}
        >
          <div className="relative h-0 w-0">
            {[0, 1, 2].map(i => (
              <span
                className="gallery-ripple"
                key={i}
                style={{
                  borderColor: ripple.color,
                  animationDelay: `${120 + i * 220}ms`,
                }}
              />
            ))}
            <span
              className="gallery-ripple-dot"
              style={{ backgroundColor: ripple.color }}
            />
          </div>
        </Marker>
      )}

      {storyID === '' &&
        galleryEntrance?.phase !== 'hidden' &&
        visibleClusters.map(cluster => {
          const anchor = galleryAnchors.find(a => a.id === cluster.leaderId)
          if (!anchor || behindGlobe.has(anchor.id)) {
            return null
          }
          const members = cluster.members.flatMap(member => {
            const a = galleryAnchors.find(g => g.id === member.id)
            return a
              ? [
                  {
                    story: a.story,
                    // offsets are screen px, the cluster is drawn scaled
                    offset: [
                      member.offset[0] / cardScale,
                      member.offset[1] / cardScale,
                    ] as [number, number],
                    onSelect: () =>
                      startStoryTransition(a.feature, {
                        id: a.id,
                        lng: a.lng,
                        lat: a.lat,
                        color: getStoryAccent(a.story),
                      }),
                  },
                ]
              : []
          })
          const containsHovered = members.some(
            m => m.story.id === hoveredStoryId,
          )
          return (
            <Marker
              anchor="center"
              key={cluster.leaderId}
              latitude={anchor.lat}
              longitude={anchor.lng}
              style={{
                zIndex:
                  expandedClusterId === cluster.leaderId
                    ? 30
                    : containsHovered
                      ? 10
                      : 1,
              }}
            >
              <div
                data-gallery-cluster=""
                style={{
                  // the cluster root is a zero-size box on the location
                  transform: `scale(${cardScale})`,
                  transformOrigin: '0 0',
                  transition: 'transform 300ms ease-out',
                }}
              >
              <ErrorBoundary name="GalleryStoryCluster">
                <GalleryStoryCluster
                  cardHeight={cardSize.height}
                  cardWidth={cardSize.width}
                  collapseSignal={collapseSignal}
                  enteringFromStoryId={
                    galleryEntrance?.phase === 'entering'
                      ? galleryEntrance.fromStoryId
                      : undefined
                  }
                  hoveredStoryId={hoveredStoryId}
                  leavingStoryId={leavingStory?.id}
                  maxColumns={width < 768 ? 2 : 4}
                  members={members}
                  onExpandedChange={expanded =>
                    setExpandedClusterId(current =>
                      expanded
                        ? cluster.leaderId
                        : current === cluster.leaderId
                          ? undefined
                          : current,
                    )
                  }
                  onHoverChange={(id, hovered) =>
                    setHoveredStoryId(current =>
                      hovered ? id : current === id ? undefined : current,
                    )
                  }
                />
              </ErrorBoundary>
              </div>
            </Marker>
          )
        })}

      {mapData &&
        mapData.map((m, index) => {
          // Stories without lines have one Point feature per step; only
          // render the first one so each story gets a single popup/source.
          if (
            mapData.findIndex(f => f.properties?.id === m.properties?.id) !==
            index
          ) {
            return null
          }
          const geometry = m.geometry as GeoJSON.Point | GeoJSON.LineString
          const [lng, lat] =
            geometry.type === 'Point'
              ? geometry.coordinates
              : geometry.coordinates[0] ?? []
          if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
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
                </>
              )}
            </Fragment>
          )
        })}

      {/* rendered once (not per story feature), otherwise markers stack up */}
      {storyID != '' && !overviewPreview && (
        <Markers color={storyAccent} markers={markers} />
      )}
    </Map>
  )
}

// A broken story (e.g. malformed step data) must never crash the whole page,
// so render errors in the map are contained here.
export default function ViewerView(props: ViewerViewProps) {
  return (
    <ErrorBoundary name="ViewerView">
      <ViewerViewInner {...props} />
    </ErrorBoundary>
  )
}

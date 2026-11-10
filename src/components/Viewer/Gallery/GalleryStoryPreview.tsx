'use client'

import { useEffect, useMemo, useState } from 'react'
import { Layer, Marker, Source } from 'react-map-gl'

// Duration of the "drawing" animation of the path in ms.
const DRAW_DURATION = 900

type Position = [number, number]

export type PreviewStation = {
  // [lng, lat]
  coordinates: Position
  // step position, used for the number shown on the dot (position + 1)
  position?: number
  title?: string
}

type Props = {
  storyId: string
  // stations sorted by step position
  stations: PreviewStation[]
  color: string
  // makes the station dots clickable (e.g. to open that step)
  onStationClick?: (station: PreviewStation) => void
  // prefix for map source/layer ids, must be unique per rendered instance
  idPrefix?: string
  // wait this long (ms) before drawing, e.g. until a camera flight ends
  delay?: number
  // show the stations right away (staggered from 0, ignoring `delay`) and
  // bigger, e.g. on the story overview so they are visible during the flight
  stationsFirst?: boolean
}

const clamp01 = (v: number) =>
  Number.isFinite(v) ? Math.min(Math.max(v, 0), 1) : 1

const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp01(t), 3)

const isPosition = (c: unknown): c is Position =>
  Array.isArray(c) &&
  c.length >= 2 &&
  Number.isFinite(c[0]) &&
  Number.isFinite(c[1]) &&
  Math.abs(c[0]) <= 180 &&
  Math.abs(c[1]) <= 90

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

// relative position (0..1) of each station along the path
function computeStationFractions(coords: Position[]): number[] {
  if (coords.length === 0) {
    return []
  }
  const segmentLengths = coords
    .slice(1)
    .map((c, i) => Math.hypot(c[0] - coords[i][0], c[1] - coords[i][1]))
  const total = segmentLengths.reduce((a, b) => a + b, 0)
  if (!Number.isFinite(total) || total <= 0) {
    // all stations on the same spot (or broken data): show them all at once
    return coords.map(() => 0)
  }
  let acc = 0
  return coords.map((_, i) => {
    if (i > 0) {
      acc += segmentLengths[i - 1]
    }
    return clamp01(acc / total)
  })
}

// the part of the path that is already "drawn" at the given progress
function computeDrawnCoordinates(
  coords: Position[],
  fractions: number[],
  progress: number,
): Position[] {
  const p = clamp01(progress)
  const result: Position[] = []
  for (let i = 0; i < coords.length; i++) {
    const fraction = fractions[i] ?? 1
    const prev = coords[i - 1]
    // the first station is always part of the line
    if (i === 0 || fraction <= p || !prev) {
      result.push(coords[i])
      continue
    }
    // interpolate inside the current segment
    const prevFraction = fractions[i - 1] ?? 0
    const segment = fraction - prevFraction
    const local = segment > 0 ? clamp01((p - prevFraction) / segment) : 1
    const next = coords[i]
    result.push([
      prev[0] + (next[0] - prev[0]) * local,
      prev[1] + (next[1] - prev[1]) * local,
    ])
    break
  }
  // a LineString needs at least two positions
  if (result.length === 1) {
    result.push(result[0])
  }
  return result
}

/**
 * Hover preview for a gallery story: draws the story's path with an
 * animated stroke and pops in the numbered stations as the line reaches them.
 */
export function GalleryStoryPreview({
  storyId,
  stations,
  color,
  onStationClick,
  idPrefix = 'gallery-preview',
  delay = 0,
  stationsFirst = false,
}: Props) {
  const startDelay = Number.isFinite(delay) && delay > 0 ? delay : 0
  const [progress, setProgress] = useState(() =>
    prefersReducedMotion() ? 1 : 0,
  )

  // only stations with valid coordinates; coords stays index-aligned with it
  const validStations = useMemo(
    () =>
      Array.isArray(stations)
        ? stations.filter(s => s && isPosition(s.coordinates))
        : [],
    [stations],
  )
  const coords = useMemo(
    () => validStations.map(s => s.coordinates),
    [validStations],
  )

  const stationFractions = useMemo(
    () => computeStationFractions(coords),
    [coords],
  )

  useEffect(() => {
    if (prefersReducedMotion() || typeof requestAnimationFrame === 'undefined') {
      setProgress(1)
      return
    }
    setProgress(0)
    let frame = 0
    let start = 0
    const tick = (now: number) => {
      // the rAF timestamp may be slightly *before* `start`, so clamp
      const t = clamp01((now - start) / DRAW_DURATION)
      setProgress(easeOutCubic(t))
      if (t < 1) {
        frame = requestAnimationFrame(tick)
      }
    }
    const timer = setTimeout(() => {
      start = performance.now()
      frame = requestAnimationFrame(tick)
    }, startDelay)
    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
    // the delay only matters when the preview (re)starts
  }, [storyId])

  const drawnLine = useMemo<GeoJSON.Feature<GeoJSON.LineString>>(
    () => ({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: computeDrawnCoordinates(coords, stationFractions, progress),
      },
    }),
    [coords, stationFractions, progress],
  )

  const fullLine = useMemo<GeoJSON.Feature<GeoJSON.LineString>>(
    () => ({
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates: coords },
    }),
    [coords],
  )

  if (coords.length === 0) {
    return null
  }

  return (
    <>
      {coords.length > 1 && (
        <>
          {/* faint full route as a guide */}
          <Source data={fullLine} id={`${idPrefix}-full`} type="geojson">
            <Layer
              id={`${idPrefix}-full-line`}
              layout={{ 'line-join': 'round', 'line-cap': 'round' }}
              paint={{
                'line-color': color,
                'line-width': 3,
                'line-opacity': 0.25,
                'line-dasharray': [1, 2],
              }}
              type="line"
            />
          </Source>
          <Source data={drawnLine} id={`${idPrefix}-drawn`} type="geojson">
            <Layer
              id={`${idPrefix}-glow`}
              layout={{ 'line-join': 'round', 'line-cap': 'round' }}
              paint={{
                'line-color': color,
                'line-width': 14,
                'line-blur': 8,
                'line-opacity': 0.45,
              }}
              type="line"
            />
            <Layer
              id={`${idPrefix}-casing`}
              layout={{ 'line-join': 'round', 'line-cap': 'round' }}
              paint={{
                'line-color': '#ffffff',
                'line-width': 7,
                'line-opacity': 0.9,
              }}
              type="line"
            />
            <Layer
              id={`${idPrefix}-line`}
              layout={{ 'line-join': 'round', 'line-cap': 'round' }}
              paint={{ 'line-color': color, 'line-width': 4 }}
              type="line"
            />
          </Source>
        </>
      )}

      {validStations.map((station, i) => {
        const [lng, lat] = station.coordinates
        const number =
          (Number.isFinite(station.position)
            ? Number(station.position)
            : i) + 1
        const clickable = !!onStationClick
        return (
          <Marker
            anchor="center"
            key={`${storyId}-station-${i}`}
            latitude={lat}
            longitude={lng}
            onClick={
              clickable
                ? e => {
                    e.originalEvent?.stopPropagation()
                    onStationClick?.(station)
                  }
                : undefined
            }
            style={{
              zIndex: 1,
              pointerEvents: clickable ? 'auto' : 'none',
            }}
          >
            {/* outer element: pop-in animation, inner: hover effects */}
            <div
              className="gallery-station-pop"
              style={{
                animationDelay: `${Math.round(
                  stationsFirst
                    ? i * 60
                    : startDelay +
                        (stationFractions[i] ?? 0) * DRAW_DURATION * 0.8,
                )}ms`,
              }}
            >
              <div
                aria-label={station.title || `${number}`}
                className={`group relative flex items-center justify-center rounded-full bg-white font-bold ${
                  stationsFirst
                    ? 'h-10 w-10 border-[3px] text-base'
                    : 'h-6 w-6 border-2 text-[11px]'
                } shadow-md transition-transform duration-150 ${
                  clickable ? 'cursor-pointer hover:scale-125' : ''
                }`}
                role={clickable ? 'button' : undefined}
                style={{ borderColor: color, color }}
              >
                {number}
                {clickable && station.title && (
                  <span className="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-white px-2 py-0.5 text-xs font-semibold text-slate-800 opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100">
                    {station.title}
                  </span>
                )}
              </div>
            </div>
          </Marker>
        )
      })}
    </>
  )
}

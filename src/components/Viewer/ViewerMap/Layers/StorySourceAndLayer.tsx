import { useEffect, useMemo, useState } from 'react'
import { Layer, Source } from 'react-map-gl'
import { ROUTE_COLOR } from '@/src/lib/theme'

// duration of the "drawing" animation of the segment to the active step
const DRAW_DURATION = 700

type Position = GeoJSON.Position

const ROUTE_COLORS = [
  '#FF5733',
  '#FFC300',
  '#36DBCA',
  '#FF8547',
  '#3D9970',
  '#FF4136',
  '#85144b',
  '#7FDBFF',
  '#B10DC9',
  '#01FF70',
  '#2ECC40',
  '#39CCCC',
  '#F012BE',
  '#605ca8',
]

const ROUND = { 'line-join': 'round', 'line-cap': 'round' } as const

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

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

function toLine(
  coordinates: Position[],
): GeoJSON.Feature<GeoJSON.LineString> | undefined {
  if (coordinates.length < 2) {
    return undefined
  }
  return {
    type: 'Feature',
    properties: {},
    geometry: { type: 'LineString', coordinates },
  }
}

export default function StorySourceLayer({
  geojsons,
  storyID,
  selectedStepIndex,
  color,
}: {
  geojsons: GeoJSON.Feature<GeoJSON.LineString>[] | undefined
  selectedFeature: GeoJSON.Feature | undefined
  storyID: string
  selectedStepIndex: any
  // route color of the opened story, see getRouteColor()
  color?: string
}) {
  const lineColor = color || ROUTE_COLOR
  const stepIndex = Number(selectedStepIndex)
  const hasStep = storyID !== '' && Number.isInteger(stepIndex) && stepIndex >= 0

  // coordinates of the opened story's route
  const coords = useMemo<Position[]>(() => {
    if (storyID === '') {
      return []
    }
    const feature = geojsons?.find(geo => geo?.properties?.id == storyID)
    return feature?.geometry?.type === 'LineString'
      ? feature.geometry.coordinates
      : []
  }, [geojsons, storyID])

  // progress (0..1) of drawing the segment that leads to the active step
  const [progress, setProgress] = useState(1)
  useEffect(() => {
    if (
      !hasStep ||
      prefersReducedMotion() ||
      typeof requestAnimationFrame === 'undefined'
    ) {
      setProgress(1)
      return
    }
    setProgress(0)
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(Math.max((now - start) / DRAW_DURATION, 0), 1)
      setProgress(easeOutCubic(t))
      if (t < 1) {
        frame = requestAnimationFrame(tick)
      }
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [stepIndex, storyID, hasStep])

  const { visitedLine, upcomingLine, activeLine } = useMemo(() => {
    if (!hasStep || coords.length < 2) {
      return {}
    }
    const current = Math.min(stepIndex, coords.length - 1)
    const from = coords[Math.max(current - 1, 0)]
    const to = coords[current]
    const drawnTo: Position = [
      from[0] + (to[0] - from[0]) * progress,
      from[1] + (to[1] - from[1]) * progress,
    ]
    return {
      // route already travelled, up to the step before the active one
      visitedLine: toLine(coords.slice(0, Math.max(current, 1))),
      // route still ahead, from the active step to the end
      upcomingLine: toLine(coords.slice(current)),
      // segment leading into the active step, drawn with an animation
      activeLine: current > 0 ? toLine([from, drawnTo]) : undefined,
    }
  }, [coords, stepIndex, hasStep, progress])

  return (
    <>
      {/* routes of all stories, only while no story is opened */}
      {geojsons?.map((m, i) => {
        if (!m?.properties?.id) {
          return null
        }
        const id = m.properties.id.toString()
        return (
          // key/id must be tied to the story id, not the index: react-map-gl
          // throws "layer id changed" if a mounted <Layer> gets a new id
          <Source
            data={m}
            id={'linesource' + id}
            key={'linesource' + id}
            type="geojson"
          >
            <Layer
              id={id + 'normal'}
              layout={{
                ...ROUND,
                visibility: storyID === '' ? 'visible' : 'none',
              }}
              paint={{
                'line-color': ROUTE_COLORS[i % ROUTE_COLORS.length],
                'line-width': 4,
                'line-opacity': 0.9,
              }}
              type="line"
            />
          </Source>
        )
      })}

      {upcomingLine && (
        <Source data={upcomingLine} id="lineUpcoming" type="geojson">
          <Layer
            id="lineUpcoming"
            layout={ROUND}
            paint={{
              'line-color': lineColor,
              'line-width': 3.5,
              'line-opacity': 0.55,
              // zero-length dashes + round caps = dotted line
              'line-dasharray': [0, 2],
            }}
            type="line"
          />
        </Source>
      )}

      {visitedLine && (
        <Source data={visitedLine} id="lineVisited" type="geojson">
          <Layer
            id="lineVisited-casing"
            layout={ROUND}
            paint={{
              'line-color': '#ffffff',
              'line-width': 6,
              'line-opacity': 0.7,
            }}
            type="line"
          />
          <Layer
            id="lineVisited"
            layout={ROUND}
            paint={{
              'line-color': lineColor,
              'line-width': 3,
              'line-opacity': 0.45,
            }}
            type="line"
          />
        </Source>
      )}

      {activeLine && (
        <Source data={activeLine} id="lineActive" type="geojson">
          <Layer
            id="lineActive-glow"
            layout={ROUND}
            paint={{
              'line-color': lineColor,
              'line-width': 16,
              'line-blur': 8,
              'line-opacity': 0.4,
            }}
            type="line"
          />
          <Layer
            id="lineActive-casing"
            layout={ROUND}
            paint={{
              'line-color': '#ffffff',
              'line-width': 8,
              'line-opacity': 0.95,
            }}
            type="line"
          />
          <Layer
            id="lineActive"
            layout={ROUND}
            paint={{ 'line-color': lineColor, 'line-width': 4.5 }}
            type="line"
          />
        </Source>
      )}
    </>
  )
}

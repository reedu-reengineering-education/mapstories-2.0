import { useEffect, useMemo, useRef, useState } from 'react'
import { Layer, Source } from 'react-map-gl'
import { ROUTE_COLOR } from '@/src/lib/theme'

// default duration of the "drawing" animation of the segment to the active
// step, used when no camera flight duration is passed in
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

// same easing as the step flyTo in ViewerView, so the line tip keeps pace
// with the camera
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

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

// split a polyline at `fraction` (0..1) of its length into the part before
// and the part after that point (both contain the split point)
function splitLine(
  coordinates: Position[],
  fraction: number,
): [Position[], Position[]] {
  if (coordinates.length < 2 || fraction >= 1) {
    return [coordinates, coordinates.slice(-1)]
  }
  const lengths = coordinates
    .slice(1)
    .map((c, i) =>
      Math.hypot(c[0] - coordinates[i][0], c[1] - coordinates[i][1]),
    )
  let remaining = lengths.reduce((a, b) => a + b, 0) * Math.max(fraction, 0)
  const head: Position[] = [coordinates[0]]
  for (let i = 0; i < lengths.length; i++) {
    const [a, b] = [coordinates[i], coordinates[i + 1]]
    if (remaining >= lengths[i]) {
      head.push(b)
      remaining -= lengths[i]
      continue
    }
    const f = lengths[i] > 0 ? remaining / lengths[i] : 0
    const point: Position = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]
    head.push(point)
    return [head, [point, ...coordinates.slice(i + 1)]]
  }
  return [head, coordinates.slice(-1)]
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
  flight,
}: {
  geojsons: GeoJSON.Feature<GeoJSON.LineString>[] | undefined
  selectedFeature: GeoJSON.Feature | undefined
  storyID: string
  selectedStepIndex: any
  // route color of the opened story, see getRouteColor()
  color?: string
  // camera flight to the active step; the segment is drawn over its duration
  flight?: { duration: number }
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

  // when stepping back, the route from the active step to the step we came
  // from is "un-drawn" instead of drawing the segment into the active step
  const lastStepRef = useRef<{ storyID: string; step: number }>()
  const [retractFrom, setRetractFrom] = useState<number>()

  // progress (0..1) of drawing the segment that leads to the active step
  const [progress, setProgress] = useState(1)
  useEffect(() => {
    // only update the direction on a real step change, not when the same
    // step is restarted with a new flight duration
    const last = lastStepRef.current
    if (!last || last.storyID !== storyID || last.step !== stepIndex) {
      setRetractFrom(
        last && last.storyID === storyID && hasStep && last.step > stepIndex
          ? last.step
          : undefined,
      )
      lastStepRef.current = hasStep ? { storyID, step: stepIndex } : undefined
    }

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
    const duration =
      flight && flight.duration > 0 ? flight.duration : DRAW_DURATION
    const tick = (now: number) => {
      const t = Math.min(Math.max((now - start) / duration, 0), 1)
      setProgress(easeInOutCubic(t))
      if (t < 1) {
        frame = requestAnimationFrame(tick)
      }
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [stepIndex, storyID, hasStep, flight])

  const { visitedLine, upcomingLine, activeLine, retractLine } = useMemo(() => {
    if (!hasStep || coords.length < 2) {
      return {}
    }
    const current = Math.min(stepIndex, coords.length - 1)
    const from = coords[Math.max(current - 1, 0)]
    const to = coords[current]
    const backward = retractFrom !== undefined && retractFrom > current
    // stepping back: the segment into the active step is already drawn
    const drawProgress = backward ? 1 : progress
    const drawnTo: Position = [
      from[0] + (to[0] - from[0]) * drawProgress,
      from[1] + (to[1] - from[1]) * drawProgress,
    ]

    // route still ahead, from the active step to the end
    let upcoming = coords.slice(current)
    let retract: Position[] | undefined
    if (backward && progress < 1) {
      // route from the active step back to the step we came from, shrinking
      // towards the active step; the dotted line only starts at its tip so
      // the two lines don't overlap
      const end = Math.min(retractFrom, coords.length - 1)
      const [head, tail] = splitLine(coords.slice(current, end + 1), 1 - progress)
      retract = head
      upcoming = [...tail, ...coords.slice(end + 1)]
    }

    return {
      retractLine: retract ? toLine(retract) : undefined,
      // route already travelled, up to the step before the active one
      visitedLine: toLine(coords.slice(0, Math.max(current, 1))),
      upcomingLine: toLine(upcoming),
      // segment leading into the active step, drawn with an animation
      activeLine: current > 0 ? toLine([from, drawnTo]) : undefined,
    }
  }, [coords, stepIndex, hasStep, progress, retractFrom])

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

      {retractLine && (
        <Source data={retractLine} id="lineRetract" type="geojson">
          <Layer
            id="lineRetract-casing"
            layout={ROUND}
            paint={{
              'line-color': '#ffffff',
              'line-width': 8,
              'line-opacity': 0.95,
            }}
            type="line"
          />
          <Layer
            id="lineRetract"
            layout={ROUND}
            paint={{ 'line-color': lineColor, 'line-width': 4.5 }}
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

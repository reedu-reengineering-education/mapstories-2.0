import { useBoundStore } from '@/src/lib/store/store'
import { StepMarker } from '@/src/types/Stepmarker'
import { Marker } from 'react-map-gl'
import { navigateToStep } from '@/src/lib/viewerNavigation'

// fallback, same as the gallery default accent
const DEFAULT_ACCENT = '#18325b'
const COMMUNITY_COLOR = '#16a34a'

type Props = {
  markers: StepMarker[]
  // accent color of the story (theme / topic), see getStoryAccent()
  color?: string
}

type MarkerState = 'active' | 'visited' | 'upcoming'

function getMarkerState(
  position: number,
  selectedStepIndex: number | undefined,
): MarkerState {
  if (selectedStepIndex === undefined || Number.isNaN(selectedStepIndex)) {
    return 'upcoming'
  }
  if (position === selectedStepIndex) {
    return 'active'
  }
  return position < selectedStepIndex ? 'visited' : 'upcoming'
}

/**
 * Numbered station markers of the opened story. Same look as the stations of
 * the gallery / overview preview: the active step is filled with the story
 * accent and pulses, visited steps are muted, upcoming ones are outlined.
 */
export default function Markers({ markers, color }: Props) {
  const selectedStepIndex = useBoundStore(state => state.selectedStepIndex)
  const accent = color || DEFAULT_ACCENT

  function openStep(position: number) {
    navigateToStep(position)
  }

  return (
    <>
      {markers.map(m => {
        if (!m) {
          return null
        }
        const state = getMarkerState(m.position, selectedStepIndex)
        const isActive = state === 'active'
        const isCommunity = !!m.tags?.includes('community')
        const markerColor = isCommunity ? COMMUNITY_COLOR : accent
        const number = m.position + 1

        return (
          <Marker
            anchor="center"
            key={m.stepId ?? m.position}
            latitude={m.latitude}
            longitude={m.longitude}
            onClick={e => {
              e.originalEvent?.stopPropagation()
              openStep(m.position)
            }}
            style={{ zIndex: isActive ? 10 : state === 'upcoming' ? 2 : 1 }}
          >
            <div
              aria-current={isActive ? 'step' : undefined}
              aria-label={m.title ? `${number}. ${m.title}` : `${number}`}
              className="group relative flex cursor-pointer items-center justify-center"
              role="button"
            >
              {isActive && (
                <span
                  className="viewer-station-pulse pointer-events-none absolute inset-0 rounded-full"
                  style={{ backgroundColor: markerColor }}
                />
              )}
              <div
                className={`relative flex h-10 w-10 items-center justify-center rounded-full border-[3px] text-base font-bold shadow-md transition-all duration-300 ease-out group-hover:scale-110 ${
                  isActive ? 'border-white text-white shadow-lg' : 'bg-white'
                }`}
                style={
                  isActive
                    ? { backgroundColor: markerColor }
                    : state === 'visited'
                      ? {
                          borderColor: '#cbd5e1',
                          color: '#94a3b8',
                        }
                      : { borderColor: markerColor, color: markerColor }
                }
              >
                {number}
              </div>

              {m.title && (
                // card-style label in the site design (border + offset
                // shadow), so it can't be mistaken for map place labels
                <div
                  className={`pointer-events-none absolute left-1/2 top-full mt-3 -translate-x-1/2 transition-all duration-200 ${
                    isActive
                      ? 'translate-y-0 opacity-100'
                      : '-translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
                  }`}
                >
                  {/* little pointer connecting label and marker */}
                  <span
                    className="absolute -top-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l-2 border-t-2 bg-white"
                    style={{ borderColor: markerColor }}
                  />
                  <span
                    className="relative flex max-w-[240px] items-center gap-2 whitespace-nowrap rounded-lg border-2 bg-white py-1 pl-1 pr-3 text-sm font-bold text-slate-900"
                    style={{
                      borderColor: markerColor,
                      boxShadow: `3px 3px 0 ${markerColor}`,
                    }}
                  >
                    <span
                      className="flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded px-1 text-[11px] text-white"
                      style={{ backgroundColor: markerColor }}
                    >
                      {number}
                    </span>
                    <span className="truncate">{m.title}</span>
                  </span>
                </div>
              )}
            </div>
          </Marker>
        )
      })}
    </>
  )
}

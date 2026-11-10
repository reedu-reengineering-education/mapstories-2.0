'use client'

import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { ErrorBoundary } from '@/src/components/ErrorBoundary'
import { GalleryStoryMarker, getStoryAccent } from './GalleryStoryMarker'

type MarkerStory = Parameters<typeof GalleryStoryMarker>[0]['story']

export type ClusterMember = {
  story: MarkerStory
  // pixel offset of this story's location relative to the cluster anchor
  // (the location of the first member)
  offset: [number, number]
  onSelect: () => void
}

type Props = {
  members: ClusterMember[]
  cardWidth: number
  cardHeight: number
  // max cards per row when fanned out
  maxColumns: number
  hoveredStoryId?: string
  onHoverChange: (storyId: string, hovered: boolean) => void
  onExpandedChange?: (expanded: boolean) => void
  // changes whenever the map starts moving -> collapse
  collapseSignal?: number
  // a story card was clicked: that card shrinks into its location, all
  // other cards fade out
  leavingStoryId?: string
  // back from a story: all cards pop in, the one of this story grows out
  // of its location first
  enteringFromStoryId?: string
}

const GAP = 12
// distance between the location and the bottom row of a fanned-out stack
const FAN_LIFT = 36
const OPEN_DELAY = 80
const CLOSE_DELAY = 250

type Point = { x: number; y: number }

// bottom-center position of each card (relative to the anchor) when fanned
function fanPositions(count: number, props: Props): Point[] {
  const cols = Math.max(1, Math.min(count, props.maxColumns))
  return Array.from({ length: count }, (_, i) => {
    const row = Math.floor(i / cols)
    const col = i % cols
    const inRow = Math.min(cols, count - row * cols)
    return {
      x: (col - (inRow - 1) / 2) * (props.cardWidth + GAP),
      y: -(FAN_LIFT + row * (props.cardHeight + GAP)),
    }
  })
}

// stable pseudo-random stagger (0..1) per story so cards pop in scattered
function staggerOf(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0
  }
  return (Math.abs(hash) % 1000) / 1000
}

// bottom-center position of each card when collapsed into a stack
function stackPosition(i: number): Point & { rotate: number } {
  if (i === 0) {
    return { x: 0, y: 0, rotate: 0 }
  }
  const side = i % 2 === 1 ? 1 : -1
  const depth = Math.min(i, 2)
  return { x: side * 7 * depth, y: -5 * depth, rotate: side * 3 * depth }
}

/**
 * One or more gallery stories whose cards would overlap on the map. A single
 * story renders as a plain card; several render as a stack with a counter
 * that fans out on hover / tap, with leader lines to each story's location.
 */
export function GalleryStoryCluster(props: Props) {
  const {
    members,
    cardWidth,
    hoveredStoryId,
    onHoverChange,
    onExpandedChange,
    collapseSignal,
    leavingStoryId,
    enteringFromStoryId,
  } = props
  const [expanded, setExpanded] = useState(false)
  const openTimer = useRef<ReturnType<typeof setTimeout>>()
  const closeTimer = useRef<ReturnType<typeof setTimeout>>()

  const isStack = members.length > 1

  const clearTimers = () => {
    clearTimeout(openTimer.current)
    clearTimeout(closeTimer.current)
  }

  const setExpandedState = (value: boolean) => {
    clearTimers()
    setExpanded(value)
  }

  useEffect(() => {
    onExpandedChange?.(expanded)
  }, [expanded])

  // collapse when the map moves (offsets are only valid for the current view),
  // but keep the layout while the exit animation is running
  useEffect(() => {
    if (!leavingStoryId) {
      setExpandedState(false)
    }
  }, [collapseSignal])

  useEffect(() => clearTimers, [])

  if (members.length === 0) {
    return null
  }

  const fan = fanPositions(members.length, props)

  // exit (story selected) / entrance (back from a story) animation classes
  const cardAnimation = (storyId: string, index: number) => {
    if (leavingStoryId) {
      return leavingStoryId === storyId
        ? { className: 'gallery-card-select' }
        : {
            className: 'gallery-card-exit',
            style: { animationDelay: `${(index % 4) * 40}ms` },
          }
    }
    if (enteringFromStoryId !== undefined) {
      return enteringFromStoryId === storyId
        ? { className: 'gallery-card-return' }
        : {
            className: 'gallery-card-enter',
            style: {
              animationDelay: `${Math.round(200 + staggerOf(storyId) * 350)}ms`,
            },
          }
    }
    return {}
  }
  const anyHoveredInside = members.some(m => m.story.id === hoveredStoryId)

  const onMouseEnter = () => {
    if (!isStack) {
      return
    }
    clearTimeout(closeTimer.current)
    if (!expanded) {
      openTimer.current = setTimeout(() => setExpanded(true), OPEN_DELAY)
    }
  }

  const onMouseLeave = () => {
    clearTimeout(openTimer.current)
    if (expanded) {
      closeTimer.current = setTimeout(() => setExpanded(false), CLOSE_DELAY)
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && expanded) {
      e.stopPropagation()
      setExpandedState(false)
    }
  }

  // invisible hit area covering the fanned cards + locations, so moving the
  // mouse through the gaps between cards does not collapse the stack
  const hitArea = (() => {
    if (!expanded) {
      return undefined
    }
    const xs = [
      ...fan.flatMap(p => [p.x - cardWidth / 2, p.x + cardWidth / 2]),
      ...members.map(m => m.offset[0]),
    ]
    const ys = [
      ...fan.map(p => p.y - props.cardHeight),
      ...members.map(m => m.offset[1]),
      0,
    ]
    const pad = 16
    return {
      left: Math.min(...xs) - pad,
      top: Math.min(...ys) - pad,
      width: Math.max(...xs) - Math.min(...xs) + 2 * pad,
      height: Math.max(...ys) - Math.min(...ys) + 2 * pad,
    }
  })()

  return (
    // zero-size root sitting exactly on the anchor location
    <div
      className={`relative h-0 w-0 ${
        leavingStoryId ? 'pointer-events-none' : ''
      }`}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {hitArea && <div className="absolute" style={hitArea} />}

      {/* leader lines from the fanned cards to their locations */}
      {isStack && (
        <svg
          className="pointer-events-none absolute left-0 top-0 overflow-visible transition-opacity duration-200"
          height="1"
          style={{ opacity: expanded ? 1 : 0 }}
          width="1"
        >
          {members.map((m, i) => {
            const color = getStoryAccent(m.story)
            const [dx, dy] = m.offset
            const active = hoveredStoryId === m.story.id
            return (
              <g key={m.story.id}>
                <line
                  stroke={color}
                  strokeDasharray={active ? undefined : '4 4'}
                  strokeLinecap="round"
                  strokeOpacity={active ? 0.95 : 0.6}
                  strokeWidth={active ? 2.5 : 1.5}
                  x1={fan[i].x}
                  x2={dx}
                  y1={fan[i].y}
                  y2={dy}
                />
                <circle
                  cx={dx}
                  cy={dy}
                  fill="white"
                  r={active ? 6 : 4.5}
                  stroke={color}
                  strokeWidth={2.5}
                />
              </g>
            )
          })}
        </svg>
      )}

      {members.map((m, i) => {
        const target = expanded ? { ...fan[i], rotate: 0 } : stackPosition(i)
        const hiddenInStack = !expanded && i > 2
        const isTop = expanded || i === 0
        const dimmed =
          !!hoveredStoryId &&
          hoveredStoryId !== m.story.id &&
          // in a collapsed stack only the top card reacts to hover
          (expanded || !anyHoveredInside)
        return (
          <div
            className="absolute bottom-0 left-0 transition-[transform,opacity] duration-300 ease-out"
            key={m.story.id}
            style={{
              transform: `translate(${target.x - cardWidth / 2}px, ${
                target.y
              }px) rotate(${target.rotate}deg)`,
              transformOrigin: 'bottom center',
              transitionDelay: expanded ? `${i * 30}ms` : '0ms',
              zIndex: expanded
                ? hoveredStoryId === m.story.id
                  ? members.length + 1
                  : members.length - i
                : members.length - i,
              opacity: hiddenInStack ? 0 : 1,
            }}
          >
            <div {...cardAnimation(m.story.id, i)}>
            <ErrorBoundary name="GalleryStoryMarker">
              <GalleryStoryMarker
                dimmed={dimmed}
                interactive={isTop}
                onHoverChange={hovered => onHoverChange(m.story.id, hovered)}
                onSelect={() => {
                  // first tap on a collapsed stack fans it out (touch devices)
                  if (isStack && !expanded) {
                    setExpandedState(true)
                    return
                  }
                  m.onSelect()
                }}
                showArrow={isTop}
                story={m.story}
                width={cardWidth}
              />
            </ErrorBoundary>
            </div>
          </div>
        )
      })}

      {isStack && (
        <div
          className="pointer-events-none absolute flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-slate-900 px-1.5 text-xs font-bold text-white shadow-md ring-2 ring-white transition-[opacity,transform] duration-200"
          style={{
            ...(leavingStoryId ? { visibility: 'hidden' } : {}),
            // top-right corner of the top card
            left: cardWidth / 2 - 14,
            top: -props.cardHeight - 8,
            opacity: expanded ? 0 : 1,
            transform: expanded ? 'scale(0.5)' : 'scale(1)',
            zIndex: members.length + 2,
          }}
        >
          +{members.length - 1}
        </div>
      )}
    </div>
  )
}

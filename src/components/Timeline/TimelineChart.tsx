'use client'

import { useEffect, useRef, useState } from 'react'
import { Timeline, TimelineOptions } from 'vis-timeline/standalone'
import { DataSet } from 'vis-data/standalone'
import { SlideContent, StoryStep } from '@prisma/client'
import { Button } from '../Elements/Button'
import {
  MinusIcon,
  PlusIcon,
  ViewfinderCircleIcon,
} from '@heroicons/react/24/outline'
import { Tooltip } from '../Tooltip'
import './TimelineChart.css'

interface TimelineChartProps {
  data: (StoryStep & {
    content: SlideContent[]
  })[]
  onEventClick?: (_event: StoryStep) => void
  onEventAdd?: (_date: Date) => void
  onEventDelete?: (_event: StoryStep) => void
  onEventMove?: (_event: StoryStep, _date: Date) => void
  activeEvent?: string
  editable?: boolean
  fitButton?: boolean
  zoomButtons?: boolean
}

const ZOOM_PERCENTAGE = 0.25

export default function TimelineChart({
  data,
  onEventClick,
  onEventAdd,
  onEventDelete,
  onEventMove,
  activeEvent,
  editable = false,
  fitButton = false,
  zoomButtons = false,
}: TimelineChartProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [timeline, setTimeline] = useState<Timeline | null>(null)
  const [items, setItems] = useState<DataSet<any> | null>(null)

  useEffect(() => {
    const items = new DataSet(
      data.map(e => ({
        id: e.id,
        content: e.content.find(e => e.type === 'TITLE')?.content,
        start: e.timestamp,
        position: e.position,
      })),
    )
    setItems(items)
  }, [data])

  useEffect(() => {
    if (!ref.current) {
      return
    }

    // Configuration for the Timeline
    var options: TimelineOptions = {
      editable,
      stack: true,
      minHeight: '10rem',
      maxHeight: '16rem',
      // @ts-ignore
      // template: (item, element, data) =>
      //   ReactDOM.createPortal(
      //     // @ts-ignore
      //     ReactDOM.render(
      //       <SidebarSlide position={item.position} stepId={item.id} />,
      //       element,
      //     ),
      //     element,
      //   ),
      onAdd: item => {
        onEventAdd && onEventAdd(new Date(item.start))
      },
      onRemove: item => {
        onEventDelete && onEventDelete(data.find(e => e.id === item.id)!)
      },
      onMove: item => {
        onEventMove &&
          onEventMove(data.find(e => e.id === item.id)!, new Date(item.start))
      },
    }

    // Create a Timeline
    const timeline = new Timeline(ref.current, items ?? [], options)
    timeline.on(
      'select',
      ({ items }) =>
        items.length > 0 &&
        onEventClick &&
        onEventClick(data.find(e => e.id === items[0])!),
    )

    setTimeline(timeline)

    return () => {
      timeline.destroy()
    }
  }, [ref, items])

  useEffect(() => {
    if (!timeline) {
      return
    }
    timeline.setSelection(activeEvent ?? [])
  }, [activeEvent, timeline])

  return (
    <div className="flex items-end">
      <div className="flex-1 p-2" ref={ref} />
      <div className="m-2 flex flex-col gap-1 rounded bg-zinc-100 p-1">
        {fitButton && (
          <Tooltip
            content="Fit timeline to content"
            delayDuration={0}
            side="right"
          >
            <Button
              className="!px-0"
              onClick={() => timeline?.fit()}
              size={'sm'}
              variant={'inverse'}
            >
              <ViewfinderCircleIcon className="h-4 w-4" />
            </Button>
          </Tooltip>
        )}
        {zoomButtons && (
          <>
            <Tooltip content="Zoom in" delayDuration={0} side="right">
              <Button
                className="!px-0"
                onClick={() => timeline?.zoomIn(ZOOM_PERCENTAGE)}
                size={'sm'}
                variant={'inverse'}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Zoom out" delayDuration={0} side="right">
              <Button
                className="!px-0"
                onClick={() => timeline?.zoomOut(ZOOM_PERCENTAGE)}
                size={'sm'}
                variant={'inverse'}
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
            </Tooltip>
          </>
        )}
      </div>
    </div>
  )
}

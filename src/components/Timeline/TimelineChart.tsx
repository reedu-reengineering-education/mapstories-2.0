'use client'

import { useEffect, useRef, useState } from 'react'
import { Timeline, TimelineOptions } from 'vis-timeline/standalone'
import { DataSet } from 'vis-data/standalone'
import { SlideContent, StoryStep } from '@prisma/client'
import ReactDOM from 'react-dom'
import SidebarSlide from '../Studio/Mapstories/Sidebar/SidebarSlide'

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
}

export default function TimelineChart({
  data,
  onEventClick,
  onEventAdd,
  onEventDelete,
  onEventMove,
  activeEvent,
  editable = false,
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
      maxHeight: '12rem',
      // @ts-ignore
      template: (item, element) =>
        ReactDOM.createPortal(
          // @ts-ignore
          ReactDOM.render(
            <div className="-p-1">
              <SidebarSlide position={item.position} stepId={item.id} />
            </div>,
            element,
          ),
          element,
        ),
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

  return <div className="p-2" ref={ref} />
}

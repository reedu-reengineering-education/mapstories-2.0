'use client'

import { useEffect, useRef, useState } from 'react'
import { Timeline, TimelineOptions } from 'vis-timeline/standalone'
import { DataSet } from 'vis-data/standalone'

interface TimelineEvent {
  timestamp: Date | null
  title: string | undefined
}

interface TimelineChartProps {
  data: TimelineEvent[]
  onEventClick?: (_event: TimelineEvent) => void
  onEventAdd?: (_date: Date) => void
  activeIndex?: number
  editable?: boolean
}

export default function TimelineChart({
  data,
  onEventClick,
  onEventAdd,
  activeIndex,
  editable = false,
}: TimelineChartProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [timeline, setTimeline] = useState<Timeline | null>(null)
  const [items, setItems] = useState<DataSet<any> | null>(null)

  useEffect(() => {
    const items = new DataSet(
      data.map((e, i) => ({
        id: i,
        content: e.title ?? '',
        start: e.timestamp?.toISOString() ?? '',
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
      stack: false,
      onAdd: (item, callback) => {
        onEventAdd && onEventAdd(new Date(item.start))
      },
    }

    // Create a Timeline
    const timeline = new Timeline(ref.current, items ?? [], options)
    timeline.on(
      'select',
      ({ items }) =>
        items.length > 0 && onEventClick && onEventClick(data[items[0]]),
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
    timeline.setSelection(activeIndex ?? [])
  }, [activeIndex, timeline])

  return <div className="p-2" ref={ref} />
}

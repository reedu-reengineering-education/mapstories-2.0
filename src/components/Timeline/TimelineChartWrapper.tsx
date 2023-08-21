'use client'

import { SlideContent, Story, StoryStep } from '@prisma/client'
import TimelineChart from './TimelineChart'
import { useRouter } from 'next/navigation'

type TimelineStory = Story & {
  steps: (StoryStep & {
    content: SlideContent[]
  })[]
  firstStep:
    | (StoryStep & {
        content: SlideContent[]
      })
    | null
}

export default function TimelineChartWrapper({
  filter,
  activeIndex,
  story,
}: {
  filter: string
  activeIndex: number
  story: TimelineStory
}) {
  const router = useRouter()

  const events = story.steps
    .filter(e => e.timestamp != null)
    .map(s => ({
      timestamp: s.timestamp,
      title: s.content.find(e => e.type === 'TITLE')?.content,
    }))

  return (
    <TimelineChart
      activeIndex={activeIndex}
      data={events}
      onEventClick={event => {
        const idx = story.steps.findIndex(s => s.timestamp === event.timestamp)
        router.replace(`/mystories/${filter}/story/${story.slug}/${idx}`)
      }}
    ></TimelineChart>
  )
}

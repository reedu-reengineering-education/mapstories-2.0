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
  activeIndex,
  story,
}: {
  activeIndex: number
  story: TimelineStory
}) {
  const router = useRouter()

  return (
    <TimelineChart
      activeEvent={story.steps[activeIndex]?.id}
      data={story.steps.sort((a, b) => a.position - b.position)}
      fitButton
      onEventClick={event => {
        const idx = story.steps.findIndex(s => s.id === event.id)
        router.replace(`/mystories/story/${story.slug}/${idx}`)
      }}
      zoomButtons
    ></TimelineChart>
  )
}

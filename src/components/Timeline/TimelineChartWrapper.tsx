'use client'

import { SlideContent, Story, StoryStep } from '@prisma/client'
import TimelineChart from './TimelineChart'
import { usePathname, useRouter } from 'next/navigation'

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
  const path = usePathname()
  return (
    <TimelineChart
      activeEvent={story.steps[activeIndex]?.id}
      data={story.steps.sort((a, b) => a.position - b.position)}
      fitButton
      onEventClick={event => {
        const idx = story.steps.findIndex(s => s.timestamp === event.timestamp)
        const pathLocal =
          path?.split('/').splice(2, 3).join('/') ?? 'gallery/all/story/'
        router.push(`/${pathLocal}/${story.id}/${idx}`)
      }}
      stepButtons
      story={story}
      zoomButtons
    ></TimelineChart>
  )
}

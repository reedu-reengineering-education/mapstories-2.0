'use client'

import TimelineChart from '@/src/components/Timeline/TimelineChart'
import { updateStoryStep } from '@/src/lib/api/step/updateStep'
import useStep from '@/src/lib/api/step/useStep'
import useStory from '@/src/lib/api/story/useStory'
import { useRouter } from 'next/navigation'

interface EditTimelineWrapperProps {
  storyId: string
  stepId: string
}

export default function EditTimelineWrapper({
  storyId,
  stepId,
}: EditTimelineWrapperProps) {
  const router = useRouter()

  const { story, createStoryStep, deleteStoryStep } = useStory(storyId)

  const { mutate } = useStep(stepId)

  if (!story || !story.steps || !story.steps.length) {
    return null
  }

  return (
    <TimelineChart
      activeEvent={story.steps.find(s => s.id === stepId)?.id}
      data={story.steps}
      editable
      fitButton
      onEventAdd={date =>
        createStoryStep({
          timestamp: date,
        })
      }
      onEventClick={event =>
        router.replace(`/storylab/${story.slug}/${event?.id}`)
      }
      onEventDelete={async event => {
        const stepDeleteIndex =
          story.steps?.findIndex(s => s.id === event.id) ?? -1
        if (!story.steps || stepDeleteIndex === -1) {
          return
        }
        const nextStep = story.steps[stepDeleteIndex + 1]
        const prevStep = story.steps[stepDeleteIndex - 1]

        await deleteStoryStep(story.steps[stepDeleteIndex].id)

        const redirectStepId = nextStep?.id ?? prevStep?.id ?? ''
        router.replace(`/storylab/${story.slug}/${redirectStepId}`)
      }}
      onEventMove={async (event, date) => {
        const { data } = await updateStoryStep(storyId, event.id, {
          timestamp: date,
        })
        mutate(data)
      }}
      zoomButtons
    />
  )
}

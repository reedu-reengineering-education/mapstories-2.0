import { db } from '@/src/lib/db'

export const reorderTimeline = async (storyId: string) => {
  const story = await db.story.findFirst({
    where: {
      id: storyId,
    },
    include: {
      steps: {
        include: {
          content: true,
        },
      },
    },
  })

  if (!story || story.mode !== 'TIMELINE') {
    return
  }

  const steps = story.steps.sort(
    (a, b) =>
      (a.timestamp ?? new Date()).getTime() -
      (b.timestamp ?? new Date()).getTime(),
  )

  const reorderedSteps = steps.map((step, index) => ({
    ...step,
    position: index,
  }))

  reorderedSteps.forEach(async step => {
    await db.storyStep.update({
      where: {
        id: step.id,
      },
      data: {
        position: step.position,
      },
    })
  })
}

// TODO: redirect to the first story step

import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

export default async function EditorPage({
  params: { storyId },
}: {
  params: { storyId: string }
}) {
  const story = await db.story.findFirst({
    where: {
      id: storyId,
    },
    include: {
      steps: true,
    },
  })

  if (!story) {
    redirect('/studio')
  }

  // redirect to first storystep
  if (story.steps.length > 0) {
    const { id } = story.steps[0]
    redirect(`/studio/${storyId}/${id}`)
  }

  // create initial step if not exists
  const initStep = await db.storyStep.create({
    data: {
      storyId: story.id,
      viewport: {},
    },
  })
  redirect(`/studio/${storyId}/${initStep.id}`)
}

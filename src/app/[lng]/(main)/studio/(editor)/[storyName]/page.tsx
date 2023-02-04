// TODO: redirect to the first story step

import { db } from '@/src/lib/db'
import { redirect } from 'next/navigation'

export default async function EditorPage({
  params: { storyName, storyId },
}: {
  params: { storyName: string; storyId: string }
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
    redirect(`/studio/${storyName}/${id}`)
  }

  // create initial step if not exists
  const initStep = await db.storyStep.create({
    data: {
      storyId: story.id,
      viewport: {},
      position: 0,
    },
  })
  redirect(`/studio/${storyName}/${initStep.id}`)

  return <p>Redirecting...</p>
}

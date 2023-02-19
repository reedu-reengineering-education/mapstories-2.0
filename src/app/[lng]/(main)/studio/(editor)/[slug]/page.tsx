// TODO: redirect to the first story step

import { db } from '@/src/lib/db'
import { redirect } from 'next/navigation'

export default async function EditorPage({
  params: { slug, storyId },
}: {
  params: { slug: string; storyId: string }
}) {
  const story = await db.story.findFirst({
    where: {
      slug: slug,
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
    redirect(`/studio/${slug}/${id}`)
  }

  // create initial step if not exists
  const initStep = await db.storyStep.create({
    data: {
      storyId: story.id,
      viewport: {},
      position: 0,
    },
  })
  redirect(`/studio/${slug}/${initStep.id}`)

  return <p>Redirecting...</p>
}

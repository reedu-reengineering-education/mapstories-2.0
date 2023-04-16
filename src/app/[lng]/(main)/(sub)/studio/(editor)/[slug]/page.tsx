import { db } from '@/src/lib/db'
import { redirect } from 'next/navigation'

export default async function EditorPage({
  params: { slug },
}: {
  params: { slug: string }
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
  if (story.firstStepId) {
    redirect(`/studio/${story.slug}/${story.firstStepId}`)
  }

  //this should never happen since firstStep gets created on story create. But app throws error if you dont do this
  redirect('/studio')

  return
}

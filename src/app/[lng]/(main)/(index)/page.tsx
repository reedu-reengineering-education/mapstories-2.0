import { fallbackLng, languages } from '@/src/app/i18n/settings'

import ViewerView from '@/src/components/Viewer/ViewerView'
import { db } from '@/src/lib/db'
import PageContent from './PageContent'

const getPublicMapstories = async () => {
  return await db.story.findMany({
    where: {
      visibility: 'PUBLIC',
    },
    include: {
      firstStep: {
        include: {
          content: true,
        },
      },
      steps: {
        include: {
          content: true,
        },
      },
    },
  })
}

export default async function Page({
  params: { lng },
}: {
  params: {
    lng: string
  }
}) {
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }

  const stories = await getPublicMapstories()

  return (
    <>
      <div className="relative h-[75vh] w-full">
        <div className="absolute bottom-0 z-20 h-1/2 w-full bg-gradient-to-b from-transparent to-white" />
        <ViewerView stories={stories} />
      </div>
      <div className="container relative z-50 mx-auto my-6 flex-1 -translate-y-[20vh]">
        <PageContent />
      </div>
    </>
  )
}

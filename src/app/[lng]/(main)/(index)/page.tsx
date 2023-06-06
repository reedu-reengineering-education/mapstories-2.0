import { fallbackLng, languages } from '@/src/app/i18n/settings'

import { db } from '@/src/lib/db'
import AnimatedMap from './AnimatedMap'
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

  // const stories = await getPublicMapstories()

  return (
    <>
      <div className="relative h-[100vh] w-full ">
        <div className="absolute bottom-0 z-20 h-1/4 w-full bg-gradient-to-b " />
        <AnimatedMap />
      </div>
      <div className="container relative z-50 mx-auto my-6 flex-1 -translate-y-[50vh] ">
        <PageContent />
      </div>
    </>
  )
}

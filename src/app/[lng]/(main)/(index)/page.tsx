import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { CharityBanner } from '@/src/components/Index/CharityBanner'

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
      <div className="relative h-[100vh] w-full">
        <AnimatedMap />
      </div>

      <div className="container relative z-50 mx-auto my-6 flex w-7/12 basis-1/2 -translate-y-[85vh] flex-col lg:-translate-y-[80vh]">
        <PageContent />
      </div>
      <div className="absolute bottom-5 z-50 mx-auto hidden w-full p-2 lg:block">
        <CharityBanner />
      </div>
    </>
  )
}

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
      <div className="relative h-[100vh] w-full ">
        <AnimatedMap />
      </div>
      <div className="z-60 relative mx-auto hidden w-9/12 -translate-y-[80vh] md:block  ">
        <CharityBanner />
      </div>
      <div className="z-60 container relative flex -translate-y-[75vh] flex-col">
        <div className="mx-auto my-6 w-7/12 basis-1/2  ">
          <PageContent />
        </div>
      </div>
    </>
  )
}

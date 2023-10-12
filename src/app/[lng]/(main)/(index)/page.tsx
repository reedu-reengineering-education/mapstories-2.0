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

      <div className="z-60 container relative flex  -translate-y-[90vh] flex-col lg:-translate-y-[80vh]">
        <div className="mx-auto my-6 w-7/12 basis-1/2  ">
          <PageContent />
        </div>
      </div>
      <div className="z-60 absolute bottom-5 mx-auto hidden w-full p-2 md:block  ">
        <CharityBanner />
      </div>
    </>
  )
}

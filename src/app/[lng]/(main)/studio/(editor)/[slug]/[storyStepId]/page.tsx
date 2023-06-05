import { Button } from '@/src/components/Elements/Button'
import { SlideContentListEdit } from '@/src/components/Studio/Mapstories/SlideContentListEdit'
import { db } from '@/src/lib/db'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import { Story } from '@prisma/client'
import SlideContentModal from './SlideContentModal'
import { Metadata } from 'next/types'
import { getStoryName } from '@/src/lib/getStoryName'
import { useTranslation } from '@/src/app/i18n'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const name = (await getStoryName(params.slug))?.name
  return {
    title: name ?? params.slug.toString().split('-')[0],
    openGraph: {
      title: name ?? params.slug.toString().split('-')[0],
    },
  }
}

interface EditorPageProps {
  params: { slug: string; storyStepId: string; lng: string }
}

async function getStory(slug: Story['slug']) {
  return await db.story.findFirst({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      steps: true,
    },
  })
}

async function getStoryStep(storyStepId: string) {
  return await db.storyStep.findFirst({
    where: {
      id: storyStepId,
    },
    include: {
      content: true,
    },
  })
}

export default async function StepPage({
  params: { slug, storyStepId, lng },
}: EditorPageProps) {
  const story = await getStory(slug)
  const { t } = await useTranslation(lng, 'step')

  if (!story?.id) {
    return <p>Loading...</p>
  }

  const storyStep = await getStoryStep(storyStepId)

  return (
    <div>
      {/* {storyStep && <PreviewSlide stepId={storyStep.id} />} */}
      <div className="re-basic-box absolute bottom-14 right-5 z-20 min-w-[18rem] bg-white p-4">
        {/* {storyStep?.content && storyStep.content.length > 0 && (
          <PreviewSlideButton />
        )} */}
        <h3 className="pb-4"></h3>
        <div>
          <SlideContentListEdit
            stepId={storyStepId}
            storyId={story.id}
          ></SlideContentListEdit>
        </div>

        <SlideContentModal
          storyStepId={storyStepId}
          trigger={
            <Button
              className="w-full"
              startIcon={<PlusIcon className="h-10"></PlusIcon>}
              variant={'primary'}
            >
              {t('addMedia')}
            </Button>
          }
        />
      </div>
    </div>
  )
}

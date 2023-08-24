import { Button } from '@/src/components/Elements/Button'
import { SlideContentListEdit } from '@/src/components/Studio/Mapstories/SlideContentListEdit'
import { db } from '@/src/lib/db'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import { Story, StoryMode } from '@prisma/client'
import SlideContentModal from './SlideContentModal'
import { Metadata } from 'next/types'
import { getStoryName } from '@/src/lib/getStoryName'
import { useTranslation } from '@/src/app/i18n'
import { Spacer } from '@/src/components/Elements/Spacer'
import { TagIcon } from '@heroicons/react/24/outline'
import StepCalendarModal from './StepCalendarModal'
import StepTagModal from './StepTagModal'
import EditTimelineWrapper from './EditTimelineWrapper'
import MapstorySidebar from '@/src/components/Studio/Mapstories/Sidebar/MapstorySidebar'

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
    include: {
      steps: {
        include: {
          content: true,
        },
      },
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
    <div className="flex h-full w-full items-end justify-between gap-4 px-5 pb-14">
      <div className="h-full w-[185px]">
        <MapstorySidebar storyID={story.id} />
      </div>
      <div className="flex h-full w-full flex-1 flex-col-reverse items-end gap-4 md:flex-row md:justify-end">
        {story?.mode === 'TIMELINE' && (
          <div className="re-basic-box z-20 w-full bg-white md:h-fit md:flex-1">
            <EditTimelineWrapper stepId={storyStepId} storyId={story.id} />
          </div>
        )}
        {/* {storyStep && <PreviewSlide stepId={storyStep.id} />} */}
        <div className="re-basic-box z-20 min-w-[18rem] bg-white p-4">
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
          {story.mode === StoryMode.TIMELINE && (
            <>
              <Spacer />
              <StepTagModal
                storyStepId={storyStepId}
                tags={storyStep?.tags}
                trigger={
                  <Button
                    className="w-full"
                    startIcon={<TagIcon className="h-6" />}
                    variant={'inverse'}
                  >
                    Add tag
                  </Button>
                }
              />
              <Spacer />
              <Spacer />
              {/* hide the calendar modal for title slide */}
              {story.firstStepId !== storyStep?.id && (
                <StepCalendarModal storyStepId={storyStepId} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

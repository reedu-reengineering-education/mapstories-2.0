import { Button } from '@/src/components/Elements/Button'
import { SlideContentListEdit } from '@/src/components/Studio/Mapstories/SlideContentListEdit'
import { db } from '@/src/lib/db'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import { Story } from '@prisma/client'
import SlideContentModal from './SlideContentModal'
import SlidePreviewModal from '@/src/components/Studio/Mapstories/SlidePreviewModal'
import { EyeIcon } from '@heroicons/react/24/outline'

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

  if (!story?.id) {
    return <p>Loading...</p>
  }

  const storyStep = await getStoryStep(storyStepId)

  return (
    <div>
      <div className="re-basic-box absolute bottom-10 right-5 z-20 bg-white p-4">
        {storyStep && (
          <SlidePreviewModal
            step={storyStep}
            trigger={
              // <Button
              //   className="absolute top-0 right-0 m-2"
              //   startIcon={<EyeIcon className="w-5" />}
              //   variant={'inverse'}
              // />
              <EyeIcon className="absolute top-0 right-0 m-2 w-5 hover:cursor-pointer" />
            }
          />
        )}
        <h3 className="pb-4">Media / Text</h3>
        <div>
          <SlideContentListEdit
            lng={''}
            stepId={storyStepId}
            storyId={story.id}
          ></SlideContentListEdit>
        </div>

        <SlideContentModal
          lng={lng}
          storyStepId={storyStepId}
          trigger={
            <Button
              className="re-basic-button-noShadow"
              startIcon={<PlusIcon className="w-4" />}
              variant={'inverse'}
            >
              Medien, Texte, Bilder <br />
              oder Videos Hinzufügen
            </Button>
          }
        />
      </div>
    </div>
  )
}

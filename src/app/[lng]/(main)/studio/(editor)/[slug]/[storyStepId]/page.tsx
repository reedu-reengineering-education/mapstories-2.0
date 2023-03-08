import { Button } from '@/src/components/Elements/Button'
import { SlideContentListEdit } from '@/src/components/Studio/Mapstories/SlideContentListEdit'
import { db } from '@/src/lib/db'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import { Story } from '@prisma/client'
import SlideContentModal from './SlideContentModal'

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

  return (
    <div>
      <div className="re-basic-box absolute bottom-10 right-5 z-20 bg-white p-4">
        <h3 className="pb-4">Media / Text</h3>
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

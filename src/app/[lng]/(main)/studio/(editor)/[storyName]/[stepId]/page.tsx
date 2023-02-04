import { Button } from '@/src/components/Elements/Button'
import { SlideContentListEdit } from '@/src/components/Studio/Mapstories/SlideContentListEdit'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import SlideContentModal from './SlideContentModal'

interface EditorPageProps {
  params: { stepId: string }
}

export default function StepPage({ params: { stepId } }: EditorPageProps) {

  return (
    <div>
      <div className="bg-white bottom-10 right-5 absolute p-4 re-basic-box">
        <h3 className="pb-4">Media / Text</h3>
        <div>
          <SlideContentListEdit stepId={stepId}></SlideContentListEdit>
        </div>

        <SlideContentModal
          storyStepId={stepId}
          trigger={
            <Button
              className="re-basic-button-noShadow"
              startIcon={<PlusIcon className="w-4" />}
              variant={'inverse'}
            >
              Medien, Texte, Bilder <br />oder Videos Hinzufügen
            </Button>
          }
        />
      </div>
    </div>
  )
}

import useStory from '@/src/lib/api/story/useStory'
import React, { useEffect, useState } from 'react'
import { SlideContent } from '@prisma/client'
import DraggableList from '../../DraggableList'
import { SlideContentListEditItem } from '../../Studio/Mapstories/SlideContentListEditItem'
import { Button } from '../../Elements/Button'
import { PlusIcon } from '@radix-ui/react-icons'
import useStepSuggestion from '@/src/lib/api/stepSuggestion/useStepSuggestion'
type Props = {
  storyId: string
  stepId: string
  setContentType: any
  setIsOpen: any
  stepSuggestion: any
  setStepSuggestion?: any
}

export default function ShowStepWithContents({
  storyId,
  setContentType,
  stepSuggestion,
}: Props) {
  const { story } = useStory(storyId)
  const [content, setContent] = useState<SlideContent[]>()
  const { reorderSlideContent } = useStepSuggestion(stepSuggestion.id)

  useEffect(() => {
    if (!stepSuggestion?.content) {
      return
    }
    // @ts-ignore
    setContent(stepSuggestion.content.sort((a, b) => a.position - b.position))
  }, [story])

  useEffect(() => {
    setContent(stepSuggestion?.content)
  }, [stepSuggestion])

  const onReorder = async (update: SlideContent[]) => {
    try {
      await reorderSlideContent(update)
    } catch (e) {}
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        {content && content.length > 0 && (
          <DraggableList
            items={content?.map((stepItem, index) => ({
              id: index,
              s: stepItem,
              component: (
                <SlideContentListEditItem
                  stepItem={stepItem}
                ></SlideContentListEditItem>
              ),
            }))}
            onChange={e => onReorder(e.map(({ s }) => s))}
          />
        )}
        <div className="flex flex-col gap-4">
          <Button
            className="w-full"
            onClick={() => setContentType('addContent')}
            startIcon={<PlusIcon className="h-5"></PlusIcon>}
            variant={'inverse'}
          >
            Add Content
          </Button>
        </div>
      </div>
      <div className="flex flex-row justify-between gap-4">
        <Button onClick={() => setContentType('')} variant={'inverse'}>
          Zurück
        </Button>
        <Button onClick={() => setContentType('addLocation')}>Weiter</Button>
      </div>
    </div>
  )
}

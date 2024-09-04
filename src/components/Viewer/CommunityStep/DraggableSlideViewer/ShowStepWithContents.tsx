import React, { useEffect, useState } from 'react'
import { SlideContent } from '@prisma/client'
import DraggableList from '../../../DraggableList'
import { SlideContentListEditItem } from '../../../Studio/Mapstories/SlideContentListEditItem'
import { Button } from '../../../Elements/Button'
import { PlusIcon } from '@radix-ui/react-icons'
type Props = {
  setContentType: (type: string) => void
  stepSuggestion: any
  setStepSuggestion: any
}

export default function ShowStepWithContents({
  stepSuggestion,
  setStepSuggestion,
  setContentType,
}: Props) {
  const [content, setContent] = useState<SlideContent[]>()

  useEffect(() => {
    setContent(stepSuggestion?.content)
  }, [stepSuggestion])

  const onReorder = async (update: SlideContent[]) => {
    try {
      for (let i = 0; i < update.length; i++) {
        update[i].position = i
      }
      setStepSuggestion({
        ...stepSuggestion,
        content: update,
      })
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
    </div>
  )
}

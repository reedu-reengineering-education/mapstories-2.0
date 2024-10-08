'use client'

import { SlideContent } from '@prisma/client'

import * as React from 'react'
import DraggableList from '../../DraggableList'
import useStory from '@/src/lib/api/story/useStory'
import { toast } from '@/src/lib/toast'
import { useEffect, useState } from 'react'
import useStep from '@/src/lib/api/step/useStep'
import { SlideContentListEditItem } from './SlideContentListEditItem'
import { useBoundStore } from '@/src/lib/store/store'

type Props = {
  storyId: string
  stepId: string
}

export function SlideContentListEdit({ storyId, stepId }: Props) {
  const { story } = useStory(storyId)
  const { step, reorderSlideContent } = useStep(stepId)
  const [disabled, setDisabled] = React.useState(false)
  const { showSlidePreview } = useBoundStore()

  const [content, setContent] = useState<SlideContent[]>()

  useEffect(() => {
    if (!step?.content) {
      return
    }
    setContent(step.content.sort((a, b) => a.position - b.position))
  }, [story])

  async function onReorder(update: SlideContent[]) {
    try {
      await reorderSlideContent(update)
      toast({
        message: 'Your content was updated successfully',
        type: 'success',
      })
    } catch (e) {
      return toast({
        title: 'Something went wrong.',
        message: 'Your content has not been updated. Please try again',
        type: 'error',
      })
    }
  }

  return (
    <>
      {!showSlidePreview && (
        <div className="py-4">
          {content && content.length > 0 && (
            <DraggableList
              disabled={disabled}
              items={
                content?.map(stepItem => ({
                  id: stepItem.id,
                  s: stepItem,
                  component: (
                    <SlideContentListEditItem
                      setDisabled={setDisabled}
                      stepItem={stepItem}
                    ></SlideContentListEditItem>
                  ),
                }))!
              }
              onChange={e => onReorder(e.map(({ s }) => s))}
            ></DraggableList>
          )}
        </div>
      )}
    </>
  )
}

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
import { useTranslation } from '@/src/app/i18n/client'

type Props = {
  storyId: string
  stepId: string
}

export function SlideContentListEdit({ storyId, stepId }: Props) {
  const { story } = useStory(storyId)
  const { step, reorderSlideContent } = useStep(stepId)
  const [disabled, setDisabled] = React.useState(false)
  const { showSlidePreview } = useBoundStore()
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'editModal')

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
        message: t('contentUpdated'),
        type: 'success',
      })
    } catch (e) {
      return toast({
        title: t('somethingWrong'),
        message: t('contentNotUpdated'),
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
              disabled={disabled || !!story?.isTranslation}
              items={
                content?.map(stepItem => ({
                  id: stepItem.id,
                  s: stepItem,
                  component: (
                    <SlideContentListEditItem
                      isTranslation={!!story?.isTranslation}
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

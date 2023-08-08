'use client'

import { SlideContent } from '@prisma/client'

import * as React from 'react'
import DraggableList from '../../DraggableList'
import { Modal } from '../../Modal'
import DeleteContentButton from '../ContentTypes/DeleteContentButton'
import { ContentEditFactory } from '../ContentTypes/ContentEditFactory'
import useStory from '@/src/lib/api/story/useStory'
import { toast } from '@/src/lib/toast'
import { useEffect, useState } from 'react'
import useStep from '@/src/lib/api/step/useStep'
import SlideContentPreviewButton from './SlideContentPreviewButton'
import { Button } from '../../Elements/Button'

type Props = {
  storyId: string
  stepId: string
}

export function SlideContentListEdit({ storyId, stepId }: Props) {
  const { story } = useStory(storyId)
  const { step, reorderSlideContent } = useStep(stepId)

  const [disabled, setDisabled] = React.useState(false)

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
    <div className="py-4">
      {content && content.length > 0 && (
        <DraggableList
          disabled={disabled}
          items={
            content?.map(stepItem => ({
              id: stepItem.id,
              s: stepItem,
              component: (
                <div
                  className="re-basic-box-no-shadow group relative my-2 flex cursor-pointer"
                  key={stepItem.id}
                >
                  <Modal
                    setDisabled={setDisabled}
                    title={'Editieren'}
                    trigger={
                      <Button
                        className="flex-1 hover:bg-hover"
                        variant={'noStyle'}
                      >
                        <SlideContentPreviewButton {...stepItem} />
                      </Button>
                    }
                  >
                    <Modal.Content>
                      <ContentEditFactory
                        stepItem={stepItem}
                        storyStepId={stepItem.storyStepId}
                      ></ContentEditFactory>
                    </Modal.Content>
                  </Modal>
                  {stepItem.type !== 'TITLE' && (
                    <DeleteContentButton
                      stepContentId={stepItem.id}
                      storyStepId={stepItem.storyStepId}
                    />
                  )}
                </div>
              ),
            }))!
          }
          onChange={e => onReorder(e.map(({ s }) => s))}
        ></DraggableList>
      )}
    </div>
  )
}

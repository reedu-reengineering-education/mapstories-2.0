'use client'

import { SlideContent } from '@prisma/client'
import {
  ClipboardIcon,
  ClockIcon,
  FaceIcon,
  HeadingIcon,
  InstagramLogoIcon,
  MagnifyingGlassIcon,
  PersonIcon,
  PlayIcon,
  TextIcon,
  TwitterLogoIcon,
} from '@radix-ui/react-icons'
import * as React from 'react'
import DraggableList from '../../DraggableList'
import { Button } from '../../Elements/Button'
import { Modal } from '../../Modal'
import DeleteContentButton from '../ContentTypes/DeleteContentButton'
import dynamic from 'next/dynamic'
import { ContentEditFactory } from '../ContentTypes/ContentEditFactory'
import useStory from '@/src/lib/api/story/useStory'
import { toast } from '@/src/lib/toast'
import { useEffect, useState } from 'react'
import useStep from '@/src/lib/api/step/useStep'

type Props = {
  storyId: string
  stepId: string
}

const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
})

const renderSwitch = function renderSwitch(content: SlideContent) {
  //@ts-ignore
  const markdownPreviewStyles = {
    background: 'white',
    fontFamily: 'inherit',
  }

  if (content.content != null) {
    if (content.type == 'TEXT') {
      return (
        <div className="flex">
          <TextIcon className="h-14 w-14"></TextIcon>
          <MarkdownPreview
            className="hover:bg-hover"
            source={content.content}
            style={markdownPreviewStyles}
          />
        </div>
      )
    } else if (content.type == 'TITLE') {
      return (
        <div className="relativ z-750 flex">
          <HeadingIcon className="h-14 w-14"></HeadingIcon>
          {content.content.substring(0, 12)}...
        </div>
      )
    }
    const media = content.content
    return (
      <div className="relativ z-750 flex">
        {content.type == 'TWITTER' ? (
          <TwitterLogoIcon className="h-14 w-14" />
        ) : content.type == 'YOUTUBE' ? (
          <PlayIcon className="h-14 w-14" />
        ) : content.type == 'INSTAGRAM' ? (
          <InstagramLogoIcon className="h-14 w-14" />
        ) : content.type == 'TIKTOK' ? (
          <ClockIcon className="h-14 w-14" />
        ) : content.type == 'PADLET' ? (
          <ClipboardIcon className="h-14 w-14" />
        ) : content.type == 'FACEBOOK' ? (
          <FaceIcon className="h-14 w-14" />
        ) : content.type == 'WIKIPEDIA' ? (
          <MagnifyingGlassIcon className="h-14 w-14" />
        ) : (
          <PersonIcon className="h-14 w-14"></PersonIcon>
        )}
        ...
        {content.content.substring(content.content.length - 12)}
      </div>
    )
  }
  return 'content undefined...'
}

export function SlideContentListEdit({ storyId, stepId }: Props) {
  const { story } = useStory(storyId)
  const { step, reorderSlideContent } = useStep(stepId)
  // const step: (StoryStep & { content?: SlideContent[] }) | undefined =
  //   story?.steps?.filter(step => step.id === stepId)[0]

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
                        {renderSwitch(stepItem)}
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
                  <DeleteContentButton
                    stepContentId={stepItem.id}
                    storyStepId={stepItem.storyStepId}
                  />
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

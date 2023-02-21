'use client'

import { useStoryStore } from '@/src/lib/store/story'
import { SlideContent, StoryStep } from '@prisma/client'
import { HeadingIcon, TextIcon, TwitterLogoIcon } from '@radix-ui/react-icons'
import * as React from 'react'
import DraggableList from '../../DraggableList'
import { Button } from '../../Elements/Button'
import { Modal } from '../../Modal'
import DeleteContentButton from '../ContentTypes/DeleteContentButton'
import dynamic from 'next/dynamic'
import { EditContentType } from '../ContentTypes/EditContentType'

type Props = {
  stepId: string
  lng: string
}

const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
})

const renderSwitch = function renderSwitch(content: any) {
  //@ts-ignore
  const markdownPreviewStyles = {
    background: 'white',
    fontFamily: 'inherit',
  }

  if (content.text != null) {
    return (
      <div className="flex">
        <TextIcon className="h-14 w-14"></TextIcon>
        <MarkdownPreview
          className="hover:bg-hover"
          source={content.text}
          style={markdownPreviewStyles}
        />
      </div>
    )
  }
  if (content.title != null) {
    return (
      <div className="relativ z-750 flex">
        <HeadingIcon className="h-14 w-14"></HeadingIcon>
        {content.title.substring(0, 12)}...
      </div>
    )
  }
  if (content.media != null) {
    return (
      <div className="relativ z-750 flex">
        <TwitterLogoIcon className="h-14 w-14"></TwitterLogoIcon>
        {content.media.substring(0, 12)}...
      </div>
    )
  }
  return 'foo'
}

export function SlideContentListEdit({ stepId, lng }: Props) {
  const story = useStoryStore(state => state.story)
  const step: (StoryStep & { content?: SlideContent[] }) | undefined =
    story?.steps?.filter(step => step.id === stepId)[0]
  const [disabled, setDisabled] = React.useState(false)

  return (
    <div className="py-4">
      {step && step.content && step.content.length > 0 && (
        <DraggableList
          disabled={disabled}
          items={
            step?.content?.map(stepItem => ({
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
                      <EditContentType
                        lng={lng}
                        stepItem={stepItem}
                        storyStepId={stepItem.storyStepId}
                      ></EditContentType>
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
          onChange={e => console.log(e)}
        ></DraggableList>
      )}
    </div>
  )
}

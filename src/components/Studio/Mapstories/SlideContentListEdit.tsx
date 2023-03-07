'use client'

import { SlideContent, StoryStep } from '@prisma/client'
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
import { EditContentType } from '../ContentTypes/EditContentType'
import useStory from '@/src/lib/api/story/useStory'
import { urlToMedia } from '../../HelperFunctions'
import Image from 'next/image'

type Props = {
  storyId: string
  stepId: string
  lng: string
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
    const media = urlToMedia(content.media)
    return (
      <div className="relativ z-750 flex">
        {media.type == 'twitter' ? (
          <TwitterLogoIcon className="h-14 w-14" />
        ) : media.type == 'youtube' ? (
          <PlayIcon className="h-14 w-14" />
        ) : media.type == 'instagram' ? (
          <InstagramLogoIcon className="h-14 w-14" />
        ) : media.type == 'tiktok' ? (
          <ClockIcon className="h-14 w-14" />
        ) : media.type == 'padlet' ? (
          <ClipboardIcon className="h-14 w-14" />
        ) : media.type == 'facebook' ? (
          <FaceIcon className="h-14 w-14" />
        ) : media.type == 'wikipedia' ? (
          <MagnifyingGlassIcon className="h-14 w-14" />
        ) : (
          <PersonIcon className="h-14 w-14"></PersonIcon>
        )}
        ...
        {content.media.substring(content.media.length - 12)}
      </div>
    )
  }
  if (content.image != null) {
    // query image from the s3 service and display it in the component
    return (
      <div className="relativ z-750 max-w-2 flex justify-center">
        <Image
          alt={content.image}
          className="m-2"
          height={content.imageHeight}
          src={content.image}
          width={content.imageWidth}
        />
      </div>
    )
  }
  return 'content undefined...'
}

export function SlideContentListEdit({ storyId, stepId, lng }: Props) {
  const { story } = useStory(storyId)
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
              key: stepItem.id,
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

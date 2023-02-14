'use client'

import { useStoryStore } from '@/src/lib/store/story'
import { SlideContent, StoryStep } from '@prisma/client'
import { HeadingIcon, TextIcon } from '@radix-ui/react-icons'
import * as React from 'react'
import DraggableList from '../../DraggableList'
import { Button } from '../../Elements/Button'
import { Modal } from '../../Modal'
import DeleteContentButton from '../ContentTypes/DeleteContentButton'
import dynamic from 'next/dynamic';
import { EditContentType } from '../ContentTypes/EditContentType'
type Props = {
  stepId: string
  lng: string
}


const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});



const renderSwitch = function renderSwitch(param: string, content: any) {

  //@ts-ignore
  const markdownPreviewStyles = {
    'background': 'white',
    'fontFamily': 'inherit'
  }

  if (content.title) {
    return (
      <div className="flex">
        <HeadingIcon className='w-14 h-14'></HeadingIcon>
        {content.title}
      </div>
    )
  }
  if (content.text) {
    return (
      <div className="flex">
        <TextIcon className='w-14 h-14'></TextIcon>
        <MarkdownPreview className="hover:bg-hover" source={content.text} style={markdownPreviewStyles} />
      </div>
    )
  }
}



export function SlideContentListEdit({ stepId, lng }: Props) {



  const story = useStoryStore(state => state.story)
  const step: StoryStep & { content?: SlideContent[] } | undefined = story?.steps?.filter(step => step.id === stepId)[0]
  const [isHovered, setIsHovered] = React.useState(false)

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div className="py-4">
      {step &&
        step.content &&
        step.content.length > 0 &&
        <DraggableList
          items={
            step?.content?.map(stepItem => ({
              id: stepItem.id,
              s: stepItem,
              component: (
                <div className="re-basic-box-no-shadow my-2 relative cursor-pointer flex group" key={stepItem.id}>
                  <Modal title={'Editieren'} trigger={<Button className="hover:bg-hover flex-1"
                    // startIcon={<PlusIcon className="w-4" />}
                    variant={'noStyle'}
                  >
                    {renderSwitch('title', stepItem)}

                  </Button>}>
                    <Modal.Content>
                      <EditContentType lng={lng} stepItem={stepItem} storyStepId={stepItem.storyStepId} ></EditContentType>
                    </Modal.Content>
                  </Modal>
                  <DeleteContentButton stepContentId={stepItem.id} storyStepId={stepItem.storyStepId} />
                </div>
              ),
            }))!
          }
          onChange={e => console.log(e)}
        ></DraggableList >
        // step.content?.map(stepItem => (

        // ))
      }

    </div >
  )
}

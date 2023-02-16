'use client'

import { useStoryStore } from '@/src/lib/store/story'
import { SlideContent, StoryStep } from '@prisma/client'
import { HeadingIcon, TwitterLogoIcon } from '@radix-ui/react-icons'
import * as React from 'react'
import DraggableList from '../../DraggableList'
import { Button } from '../../Elements/Button'
import { Modal } from '../../Modal'
import DeleteContentButton from '../ContentTypes/DeleteContentButton'
import { EmbedContentEdit } from '../ContentTypes/EmbedContentEdit'
import { TitleContentEdit } from '../ContentTypes/TitleContentEdit'

type Props = {
  stepId: string
  lng: string
}

const renderSwitch = function renderSwitch(content: any) {

  if (content.title != null) {
    return (
      <div className="flex relativ z-750">
        <HeadingIcon className='w-14 h-14'></HeadingIcon>
        {content.title.substring(0, 12)}...
      </div>
    );
  } if (content.media != null) {
    return (
      <div className="flex relativ z-750">
        <TwitterLogoIcon className='w-14 h-14'></TwitterLogoIcon>
        {content.media.substring(0, 12)}...
      </div>
    );
  }
  return 'foo';
}



export function SlideContentListEdit({ stepId, lng }: Props) {

  const story = useStoryStore(state => state.story)
  const step: StoryStep & { content?: SlideContent[] } | undefined = story?.steps?.filter(step => step.id === stepId)[0]

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
                    {renderSwitch(stepItem)}

                  </Button>}>
                    <Modal.Content>
                      {stepItem.title != null ?
                        <TitleContentEdit lng={lng} slideContent={stepItem} storyStepId={stepItem.id} ></TitleContentEdit>
                        : stepItem.media != null ?
                          <EmbedContentEdit lng={lng} slideContent={stepItem} storyStepId={stepItem.id}></EmbedContentEdit>
                          : <div>unknown embed</div>
                      }
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

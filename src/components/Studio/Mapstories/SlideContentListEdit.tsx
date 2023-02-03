'use client'

import { useStoryStore } from '@/src/lib/store/story'
import { StoryStep } from '@prisma/client'
import { HeadingIcon, PlusIcon } from '@radix-ui/react-icons'
import * as React from 'react'
import DraggableList from '../../DraggableList'
import { Button } from '../../Elements/Button'
import { Modal } from '../../Modal'
import DeleteContentButton from '../ContentTypes/DeleteContentButton'
import { TitleContentEdit } from '../ContentTypes/TitleContentEdit'

type Props = {
  stepId: String
}

const renderSwitch = function renderSwitch(param: string, content: any) {


  switch (param) {
    case 'title':
      return (
        <div className="flex relativ z-750">
          <HeadingIcon className='w-14 h-14'></HeadingIcon>
          {content.title}
        </div>
      );
    default:
      return 'foo';
  }
}



export function SlideContentListEdit({ stepId }: Props) {

  const story = useStoryStore(state => state.story)
  const step: StoryStep | undefined = story?.steps?.filter(step => step.id === stepId)[0]

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
                <div className="re-basic-box-no-shadow my-2 relative  cursor-pointer flex" key={stepItem.id}>
                <Modal title={'Editieren'} trigger={<Button className="hover:bg-hover flex-1 justify-start"
                  startIcon={<PlusIcon className="w-4" />}
                  variant={'noBorder'}
                >
                  {renderSwitch('title', stepItem)}
    
                </Button>}>
                  <Modal.Content>
                    <TitleContentEdit slideContent={stepItem} storyStepId={stepItem.id} ></TitleContentEdit>
                  </Modal.Content>
                </Modal>
                <DeleteContentButton stepContentId = {stepItem.id} storyStepId={stepItem.storyStepId}  />
              </div>
              ),
            }))!
          }
          onChange={e => console.log(e)}
        ></DraggableList>
        // step.content?.map(stepItem => (

        // ))
      }

    </div >
  )
}

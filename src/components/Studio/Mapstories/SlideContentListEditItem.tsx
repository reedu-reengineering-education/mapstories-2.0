'use client'

import { SlideContent } from '@prisma/client'

import * as React from 'react'
import { Modal } from '../../Modal'
import DeleteContentButton from '../ContentTypes/DeleteContentButton'
import { ContentEditFactory } from '../ContentTypes/ContentEditFactory'
import SlideContentPreviewButton from './SlideContentPreviewButton'
import { Button } from '../../Elements/Button'

type Props = {
  stepItem: SlideContent
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>
}

export function SlideContentListEditItem({ stepItem, setDisabled }: Props) {
  const [open, setOpen] = React.useState(false)
  return (
    <div
      className="re-basic-box-no-shadow group relative my-2 flex cursor-pointer"
      key={stepItem.id}
    >
      <Modal
        onOpenChange={() => {
          setOpen(!open)
          setDisabled(!open)
        }}
        open={open}
        setDisabled={setDisabled}
        title={'Editieren'}
        trigger={
          <Button className="flex-1 hover:bg-hover" variant={'noStyle'}>
            <SlideContentPreviewButton {...stepItem} />
          </Button>
        }
      >
        <Modal.Content>
          <ContentEditFactory
            setShowModal={setOpen}
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
  )
}

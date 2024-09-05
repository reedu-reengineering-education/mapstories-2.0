'use client'

import { Button } from '@/src/components/Elements/Button'
import { Modal } from '@/src/components/Modal'
import SlideContentPreviewButton from '@/src/components/Studio/Mapstories/SlideContentPreviewButton'
import { SlideContent } from '@prisma/client'

import * as React from 'react'
import DeleteContentButton from './DeleteContentButton'
import { ContentEditFactory } from '@/src/components/Viewer/CommunityStep/ContentEdits/ContentEditFactory'

type Props = {
  stepItem: SlideContent
  setDisabled?: React.Dispatch<React.SetStateAction<boolean>>
  handleDeleteContent: any
  setStepSuggestion: any
  setContentType: any
}

export function SlideContentListEditItem({
  stepItem,
  setDisabled,
  handleDeleteContent,
  setStepSuggestion,
  setContentType,
}: Props) {
  const [open, setOpen] = React.useState(false)

  return (
    <div
      className="re-basic-box-no-shadow group relative my-2 flex cursor-pointer"
      key={stepItem.id}
    >
      <Modal
        onOpenChange={() => {
          setOpen(!open)
          if (setDisabled) {
            setDisabled(!open)
          }
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
            setContentType={setContentType}
            setItem={setStepSuggestion}
            setShowModal={setOpen}
            stepItem={stepItem}
          ></ContentEditFactory>
        </Modal.Content>
      </Modal>
      {stepItem.type !== 'TITLE' && (
        <DeleteContentButton
          handleDeleteContent={handleDeleteContent}
          stepSuggestion={stepItem}
        />
      )}
    </div>
  )
}

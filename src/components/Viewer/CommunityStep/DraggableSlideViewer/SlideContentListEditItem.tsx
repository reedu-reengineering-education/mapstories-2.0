'use client'

import { Button } from '@/src/components/Elements/Button'
import { Modal } from '@/src/components/Modal'
import SlideContentPreviewButton from '@/src/components/Studio/Mapstories/SlideContentPreviewButton'
import { SlideContent } from '@prisma/client'

import * as React from 'react'
import DeleteContentButton from './DeleteContentButton'
import { ContentEditFactory } from '@/src/components/Viewer/CommunityStep/ContentEdits/ContentEditFactory'

import { useTranslation } from '@/src/app/i18n/client'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { useBoundStore } from '@/src/lib/store/store'

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

    let lng = useBoundStore(state => state.language)
    if (languages.indexOf(lng) < 0) {
      lng = fallbackLng
    }
    const { t } = useTranslation(lng, 'step')
  
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
        title={t('edit')}
        trigger={
          <Button
            className="flex-1 hover:bg-hover"
            disabled={
              stepItem.type === 'IMAGE' ||
              stepItem.type === 'VIDEO' ||
              stepItem.type === 'AUDIO' ||
              stepItem.type === 'EXTERNALIMAGE'
            }
            variant={'noStyle'}
          >
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

'use client'

import { SlideContent } from '@prisma/client'

import * as React from 'react'
import { Modal } from '../../Modal'
import DeleteContentButton from '../ContentTypes/DeleteContentButton'
import { ContentEditFactory } from '../ContentTypes/ContentEditFactory'
import SlideContentPreviewButton from './SlideContentPreviewButton'
import { Button } from '../../Elements/Button'
import { Tooltip } from '../../Tooltip'
import { LockClosedIcon } from '@heroicons/react/24/outline'
import { useTranslation } from '@/src/app/i18n/client'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { useBoundStore } from '@/src/lib/store/store'

type Props = {
  stepItem: SlideContent
  setDisabled?: React.Dispatch<React.SetStateAction<boolean>>
  isTranslation?: boolean
}

export function SlideContentListEditItem({
  stepItem,
  setDisabled,
  isTranslation = false,
}: Props) {
  const [open, setOpen] = React.useState(false)
  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  const { t } = useTranslation(lng, 'translationRequests')

  // In translations only texts can be edited; media and embeds come from the original.
  const isText = stepItem.type === 'TITLE' || stepItem.type === 'TEXT'
  if (isTranslation && !isText) {
    return (
      <div
        className="re-basic-box-no-shadow relative my-2 flex cursor-not-allowed opacity-70"
        key={stepItem.id}
      >
        <div className="flex-1">
          <SlideContentPreviewButton {...stepItem} />
        </div>
        <Tooltip content={t('mediaOnlyInOriginal') as string} maxwidth="200px">
          <div className="flex items-center p-2">
            <LockClosedIcon className="w-5 text-slate-500" />
          </div>
        </Tooltip>
      </div>
    )
  }

  return (
    <div
      className="re-basic-box-no-shadow group relative my-2 flex cursor-pointer"
      key={stepItem.id}
    >
      {isTranslation && stepItem.needsTranslation && (
        <span className="absolute -top-2 right-2 z-10 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800">
          {t('needsTranslation')}
        </span>
      )}
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
            setShowModal={setOpen}
            stepItem={stepItem}
            // @ts-expect-error
            storyStepId={stepItem.storyStepId}
          ></ContentEditFactory>
        </Modal.Content>
      </Modal>
      {stepItem.type !== 'TITLE' && !isTranslation && (
        <DeleteContentButton
          stepContentId={stepItem.id}
          storyStepId={stepItem.storyStepId}
        />
      )}
    </div>
  )
}

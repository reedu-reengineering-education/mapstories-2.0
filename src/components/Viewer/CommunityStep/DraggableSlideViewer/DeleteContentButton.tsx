'use client'

import { Button } from '@/src/components/Elements/Button'
import { Modal } from '@/src/components/Modal'
import { TrashIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useTranslation } from '@/src/app/i18n/client'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { useBoundStore } from '@/src/lib/store/store'

export default function DeleteContentButton({
  stepSuggestion,
  handleDeleteContent,
}: {
  stepSuggestion: any
  handleDeleteContent: any
}) {
  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  const { t } = useTranslation(lng, 'communityStep')
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const [open, setOpen] = useState(false)

  return (
    <div className="absolute right-1 top-1 z-10 overflow-hidden rounded-md group-hover:visible">
      <Modal
        onOpenChange={setOpen}
        open={open}
        title={<span>{t('confirmDelete')}</span>}
        trigger={
          <div className="flex cursor-pointer p-2 transition-colors hover:bg-red-200">
            <TrashIcon className="w-5 text-black" />
          </div>
        }
      >
        <Modal.Footer
          close={
            <div className="flex flex-row justify-between">
              <Button disabled={isSaving} isLoading={isSaving}>
                {t('cancel')}
              </Button>
              <Button
                disabled={isSaving}
                isLoading={isSaving}
                onClick={() => handleDeleteContent(stepSuggestion.position)}
                variant={'danger'}
              >
                {t('delete')}
              </Button>
            </div>
          }
        />
      </Modal>
    </div>
  )
}

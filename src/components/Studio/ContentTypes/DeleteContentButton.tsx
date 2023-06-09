'use client'

import { Button } from '@/src/components/Elements/Button'
import { Modal } from '@/src/components/Modal'
import { TrashIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from '@/src/lib/toast'
import useStep from '@/src/lib/api/step/useStep'
import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'

export default function DeleteContentButton({
  storyStepId,
  stepContentId,
}: {
  storyStepId: any
  stepContentId: any
}) {
  const router = useRouter()

  const [isSaving, setIsSaving] = useState<boolean>(false)

  const { deleteContent } = useStep(storyStepId)
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'editModal')

  async function handleClick() {
    try {
      setIsSaving(true)
      const deletedContent = await deleteContent(stepContentId)
      toast({
        message: t('contentDeleted'),
        type: 'success',
      })
    } catch (e) {
      return toast({
        title: t('somethingWrong'),
        message: t('contentNotCreated'),
        type: 'error',
      })
    } finally {
      setIsSaving(false)
    }

    router.refresh()
  }

  return (
    <div className="absolute right-1 top-1 z-10 overflow-hidden rounded-md group-hover:visible">
      <Modal
        title={
          <span>
            {' '}
            {t('confirmDeleteContent')}
            {/* <span className="rounded bg-slate-100 px-2 py-1">
              {stepContentId}
            </span> */}
          </span>
        }
        trigger={
          <div className="flex cursor-pointer  p-2 transition-colors hover:bg-red-200">
            <TrashIcon className="w-5 text-black" />
          </div>
        }
      >
        <Modal.Footer
          close={
            <div className="flex flex-row justify-between">
              <Button
                disabled={isSaving}
                isLoading={isSaving}
                onClick={handleClick}
                variant={'danger'}
              >
                {t('delete')}
              </Button>
              <Button disabled={isSaving} isLoading={isSaving}>
                {/* @ts-ignore */}
                {t('abort')}
              </Button>
            </div>
          }
        />
      </Modal>
    </div>
  )
}

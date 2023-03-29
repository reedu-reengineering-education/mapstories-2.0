'use client'

import { Button } from '@/src/components/Elements/Button'
import { Modal } from '@/src/components/Modal'
import { TrashIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from '@/src/lib/toast'
import useStep from '@/src/lib/api/step/useStep'

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

  async function handleClick() {
    try {
      setIsSaving(true)
      await deleteContent(stepContentId)
      toast({
        message: 'Der Inhalt wurde gelöscht.',
        type: 'success',
      })
    } catch (e) {
      return toast({
        title: 'Something went wrong.',
        message: 'Your content was not created. Please try again',
        type: 'error',
      })
    } finally {
      setIsSaving(false)
    }

    router.refresh()
  }

  return (
    <div className="absolute top-1 right-1 z-10 overflow-hidden rounded-md group-hover:visible">
      <Modal
        title={
          <span>
            Willst du den Inhalt
            <span className="rounded bg-slate-100 py-1 px-2">
              {stepContentId}
            </span>
            wirklich löschen?
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
            <Button
              disabled={isSaving}
              isLoading={isSaving}
              onClick={handleClick}
              variant={'danger'}
            >
              Löschen
            </Button>
          }
        />
      </Modal>
    </div>
  )
}

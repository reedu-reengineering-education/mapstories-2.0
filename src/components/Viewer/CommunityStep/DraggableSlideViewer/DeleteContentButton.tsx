'use client'

import { Button } from '@/src/components/Elements/Button'
import { Modal } from '@/src/components/Modal'
import { TrashIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function DeleteContentButton({
  stepSuggestion,
  handleDeleteContent,
}: {
  stepSuggestion: any
  handleDeleteContent: any
}) {
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const [open, setOpen] = useState(false)

  return (
    <div className="absolute right-1 top-1 z-10 overflow-hidden rounded-md group-hover:visible">
      <Modal
        onOpenChange={setOpen}
        open={open}
        title={<span> Wirklich löschen? </span>}
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
                {/* @ts-expect-error */}
                Abort
              </Button>
              <Button
                disabled={isSaving}
                isLoading={isSaving}
                onClick={() => handleDeleteContent(stepSuggestion.position)}
                variant={'danger'}
              >
                Löschen
              </Button>
            </div>
          }
        />
      </Modal>
    </div>
  )
}

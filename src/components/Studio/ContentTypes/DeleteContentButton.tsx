'use client'

import { Button } from '@/src/components/Elements/Button'
import { Modal } from '@/src/components/Modal'
import { TrashIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { toast } from '@/src/lib/toast'

export default function DeleteContentButton({
  storyStepId,
  stepContentId,
}: {
  storyStepId: any
  stepContentId: any
}) {
  const router = useRouter()

  //const { story, deleteContent } = useStory(id)

  async function handleClick() {
    const response = await fetch(
      `/api/mapstory/step/${storyStepId}/content/${stepContentId}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      },
    )

    if (!response?.ok) {
      return toast({
        title: 'Something went wrong.',
        message: 'Your content was not created. Please try again',
        type: 'error',
      })
    }

    toast({
      message: 'Der Inhalt wurde gelöscht.',
      type: 'success',
    })

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
            <TrashIcon className="w-5 text-red-500" />
          </div>
        }
      >
        <Modal.Footer>
          <Button
            disabled={loading}
            isLoading={loading}
            onClick={handleClick}
            variant={'danger'}
          >
            Löschen
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

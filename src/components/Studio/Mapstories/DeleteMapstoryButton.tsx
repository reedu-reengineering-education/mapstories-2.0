'use client'

import { Button } from '@/src/components/Elements/Button'
import { Modal } from '@/src/components/Modal'
import useStory from '@/src/lib/api/story/useStory'
import { toast } from '@/src/lib/toast'
import { TrashIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteMapstoryButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const { story, deleteStory } = useStory(id)

  async function handleClick() {
    if (loading) {
      return
    }

    setLoading(true)

    try {
      await deleteStory()
      toast({
        message: 'Your mapstory has been deleted.',
        type: 'success',
      })

      router.refresh()
    } catch (e) {
      return toast({
        title: 'Something went wrong.',
        message: 'Your mapstory was not deleted. Please try again',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={
        <span>
          Willst du die Mapstory{' '}
          <span className="rounded bg-slate-100 py-1 px-2">{story?.name}</span>{' '}
          wirklich löschen?
        </span>
      }
      trigger={
        <div className="cursor-pointer rounded-full bg-red-100 p-2 transition-colors hover:bg-red-200">
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
  )
}

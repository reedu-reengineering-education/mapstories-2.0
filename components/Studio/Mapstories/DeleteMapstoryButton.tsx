'use client'

import { Spinner } from '@/components/Elements/Spinner'
import { toast } from '@/lib/toast'
import { TrashIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteMapstoryButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleClick() {
    if (loading) {
      return
    }

    setLoading(true)

    const response = await fetch(`/api/mapstory/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    setLoading(false)

    if (!response?.ok) {
      return toast({
        title: 'Something went wrong.',
        message: 'Your mapstory was not deleted. Please try again',
        type: 'error',
      })
    }

    toast({
      message: 'Your mapstory has been deleted.',
      type: 'success',
    })

    router.refresh()
  }

  return (
    <div
      className="cursor-pointer rounded-full bg-red-100 p-2 transition-colors hover:bg-red-200"
      onClick={handleClick}
    >
      {!loading && <TrashIcon className="w-5 text-red-500" />}
      {loading && <Spinner size={'sm'} variant="danger" />}
    </div>
  )
}

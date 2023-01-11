'use client'

import { Button } from '@/components/Elements/Button'
import { toast } from '@/lib/toast'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteMapstoryButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleClick() {
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
    <Button isLoading={loading} onClick={handleClick} variant={'danger'}>
      Löschen
    </Button>
  )
}

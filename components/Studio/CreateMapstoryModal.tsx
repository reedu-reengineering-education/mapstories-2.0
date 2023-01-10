'use client'

import { createMapstoryeSchema } from '@/lib/validations/mapstory'
import { useState } from 'react'
import { Button } from '../Elements/Button'
import { Modal } from '../Modal'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/lib/toast'
import { Input, InputLabel } from '../Elements/Input'

type FormData = z.infer<typeof createMapstoryeSchema>

type Props = {
  trigger: React.ReactElement
}

export default function CreateMapstoryModal({ trigger }: Props) {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createMapstoryeSchema),
  })
  const [isSaving, setIsSaving] = useState<boolean>(false)

  async function onSubmit(data: FormData) {
    setIsSaving(true)

    const response = await fetch('/api/mapstory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
      }),
    })

    setIsSaving(false)

    if (!response?.ok) {
      return toast({
        title: 'Something went wrong.',
        message: 'Your mapstory was not created. Please try again',
        type: 'error',
      })
    }

    toast({
      message: 'Your mapstory has been created.',
      type: 'success',
    })

    router.refresh()
  }

  return (
    <Modal title={'Neue Mapstory'} trigger={trigger}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Content>
          <InputLabel>Name</InputLabel>
          <Input
            errors={errors.name}
            label="Name"
            size={32}
            {...register('name')}
          />
        </Modal.Content>
        <Modal.Footer>
          <Button disabled={isSaving} isLoading={isSaving} type="submit">
            Erstellen
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

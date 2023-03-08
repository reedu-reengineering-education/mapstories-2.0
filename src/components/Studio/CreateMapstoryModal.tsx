'use client'

import { createMapstorySchema } from '@/src/lib/validations/mapstory'
import { useState } from 'react'
import { Button } from '../Elements/Button'
import { Modal } from '../Modal'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/src/lib/toast'
import { Input, InputLabel } from '../Elements/Input'
import { createStory } from '@/src/lib/api/story/createStory'
import { useTranslation } from '@/src/app/i18n/client'

type FormData = z.infer<typeof createMapstorySchema>

type Props = {
  trigger: React.ReactElement
  lng: string
}

export default function CreateMapstoryModal({ trigger, lng }: Props) {
  const router = useRouter()
  const { t } = useTranslation(lng, 'editModal')

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createMapstorySchema),
  })
  const [isSaving, setIsSaving] = useState<boolean>(false)

  async function onSubmit(data: FormData) {
    setIsSaving(true)

    try {
      const response = await createStory(data)
      toast({
        message: 'Your mapstory has been created.',
        type: 'success',
      })
      const newStory = await response.data
      router.push(`/studio/${newStory.slug}`)
    } catch (e) {
      return toast({
        title: 'Something went wrong.',
        message: 'Your mapstory was not created. Please try again',
        type: 'error',
      })
    } finally {
      setIsSaving(false)
    }
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
        <Modal.Footer
          trigger={
            <Button disabled={isSaving} isLoading={isSaving} type="submit">
              {t('save')}
            </Button>
          }
        ></Modal.Footer>
      </form>
    </Modal>
  )
}

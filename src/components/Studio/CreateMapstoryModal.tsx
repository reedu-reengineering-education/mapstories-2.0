'use client'

import { createMapstorySchema } from '@/src/lib/validations/mapstory'
import { useState } from 'react'
import { Button } from '../Elements/Button'
import { Modal } from '../Modal'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/src/lib/toast'
import { Input, InputLabel } from '../Elements/Input'
import { createStory } from '@/src/lib/api/story/createStory'
import { useTranslation } from '@/src/app/i18n/client'
// import { useUIStore } from '@/src/lib/store/ui'
import { useBoundStore } from '@/src/lib/store/store'
import { Spacer } from '../Elements/Spacer'
import { StoryMode } from '@prisma/client'
import Switch from '../Elements/Switch'

type FormData = z.infer<typeof createMapstorySchema>

type Props = {
  trigger: React.ReactElement
}

export default function CreateMapstoryModal({ trigger }: Props) {
  const router = useRouter()
  const language = useBoundStore(state => state.language)
  const { t } = useTranslation(language, ['editModal', 'timeline'])

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(createMapstorySchema),
  })
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [open, setOpen] = useState(false)

  async function onSubmit(data: FormData) {
    setIsSaving(true)

    try {
      const response = await createStory(data)
      toast({
        message: 'Your mapstory has been created.',
        type: 'success',
      })
      const newStory = await response.data
      router.push(`/storylab/${newStory.slug}`)
      setOpen(false)
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
    <Modal
      onOpenChange={setOpen}
      open={open}
      title={'Neue Mapstory'}
      trigger={trigger}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Content>
          <InputLabel>Name</InputLabel>
          <Input
            errors={errors.name}
            label="Name"
            size={100}
            {...register('name')}
          />
          <Spacer />
          <InputLabel>Modus</InputLabel>
          <p className="rounded bg-zinc-100 p-2 text-xs text-zinc-700">
            {t('timeline:modeDescription')}
          </p>
          <Spacer size={'sm'} />
          {errors.mode && (
            <p className="px-1 text-xs text-red-600">{errors.mode.message}</p>
          )}
          <Controller
            control={control}
            defaultValue={StoryMode.NORMAL}
            name="mode"
            render={({ field: { onChange, ref } }) => {
              return (
                <div className="jusify-center flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">
                    NORMAL
                  </span>
                  <Switch
                    onCheckedChange={checked =>
                      onChange(checked ? StoryMode.TIMELINE : StoryMode.NORMAL)
                    }
                    ref={ref}
                  ></Switch>
                  <span className="text-sm font-medium text-gray-700">
                    TIMELINE
                  </span>
                </div>
              )
            }}
          />
        </Modal.Content>
        <Modal.Footer>
          <Button disabled={isSaving} isLoading={isSaving} type="submit">
            {t('editModal:save')}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

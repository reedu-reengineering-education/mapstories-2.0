'use client'

import { Button } from '@/src/components/Elements/Button'
import { Modal } from '@/src/components/Modal'
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import { Input, InputLabel } from '../../Elements/Input'
import { toast } from '@/src/lib/toast'

import { useState } from 'react'
import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import * as z from 'zod'
import { duplicateMapstorySchema } from '@/src/lib/validations/mapstory' 
import { zodResolver } from '@hookform/resolvers/zod'

type FormData = z.infer<typeof duplicateMapstorySchema>
type Props = {
  storyId: string,
  storyName: string | null 
}

export default function CopyModal({ storyId, storyName }: Props) {
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, ['settingsModal'])
  const name = `${t('settingsModal:duplicateSotryPrefix')} ${storyName}`
  const {
      handleSubmit,
      register,
      formState: { errors }
    } = useForm<FormData>({
      resolver: zodResolver(duplicateMapstorySchema),
      defaultValues: { name }
    })

  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function duplicateStory(data: FormData) {
    setLoading(true)

    try {
      await fetch(`/api/mapstory/${storyId}/duplicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: data.name }),
      })
      
      toast({
        title: t('settingsModal:copied'),
        message: t('settingsModal:copiedMessage'),
        type: 'success',
      })
      router.refresh()
    } catch (e) {
      toast({
        title: t('settingsModal:somethingWrong'),
        message: t('settingsModal:somethingWrong'),
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setModalOpen(true)}
        startIcon={<DocumentDuplicateIcon className="w-5" />}
        variant={'inverse'}
      >
        {t('settingsModal:copy')}
      </Button>
      <Modal
        onClose={() => setModalOpen(false)}
        open={modalOpen}
        title={t('settingsModal:copy')}
      >
        <form onSubmit={handleSubmit(duplicateStory)}>
          <Modal.Content>
            <p className="pb-4 pt-2">{t('settingsModal:youWantCopy')}</p>
            <InputLabel>Name</InputLabel>
            <Input
              errors={errors.name}
              size={100}
              {...register('name')}
            />
          </Modal.Content>
          <Modal.Footer>
            <div className="flex flex-row justify-between">
              <Button onClick={() => setModalOpen(false)} variant={'inverse'}>
                {t('settingsModal:cancel')}
              </Button>
              <Button disabled={loading} type="submit">
                {loading ? t('settingsModal:copying') : t('settingsModal:copy')}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

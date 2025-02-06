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
import useStory from '@/src/lib/api/story/useStory'

import * as z from 'zod'
import { copyMapstorySchema } from '@/src/lib/validations/mapstory' 
import { zodResolver } from '@hookform/resolvers/zod'

type FormData = z.infer<typeof copyMapstorySchema>
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
    resolver: zodResolver(copyMapstorySchema),
    defaultValues: { name }
  })
  const { story, copyStory } = useStory(storyId)
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onCopyStory(data: FormData) {
    setLoading(true)

    try {
      await copyStory({ ...story, name: data.name})

      toast({
        title: t('settingsModal:copied'),
        message: t('settingsModal:copiedMessage'),
        type: 'success',
      })

      setModalOpen(false)
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
        onOpenChange={setModalOpen}
        open={modalOpen}
        title={t('settingsModal:copy')}
      >
        <form onSubmit={handleSubmit(onCopyStory)}>
          <Modal.Content>
            <InputLabel>Name</InputLabel>
            <Input
              errors={errors.name}
              size={100}
              {...register('name')}
            />
            <p className="pb-4 pt-2">{t('settingsModal:youWantCopy')}</p>
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

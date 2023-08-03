'use client'

import { useTranslation } from '@/src/app/i18n/client'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { Button } from '@/src/components/Elements/Button'
import { Modal } from '@/src/components/Modal'
import useStory from '@/src/lib/api/story/useStory'
import { useBoundStore } from '@/src/lib/store/store'
import { toast } from '@/src/lib/toast'
import { TrashIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteMapstoryButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const { story, deleteStory } = useStory(id)
  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }

  const { t } = useTranslation(lng, 'studio')

  const [open, setOpen] = useState(false)

  async function handleClick() {
    if (loading) {
      return
    }

    setLoading(true)

    try {
      await deleteStory()
      toast({
        message: t('contentDeleted'),
        type: 'success',
      })

      router.refresh()
    } catch (e) {
      return toast({
        title: t('somethingWrong'),
        message: t('contentNotDeleted'),
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      onOpenChange={setOpen}
      open={open}
      title={
        <span>
          {t('confirmDeleteMapstory')}
          <span className="rounded bg-slate-100 px-2 py-1">
            {story?.name}
          </span>{' '}
        </span>
      }
      trigger={
        <div className="cursor-pointer rounded-full bg-red-100 p-2 transition-colors hover:bg-red-200">
          <TrashIcon className="w-5 text-red-500" />
        </div>
      }
    >
      <Modal.Footer
        close={
          <div className="flex flex-row justify-between">
            <Button onClick={handleClick} variant={'danger'}>
              {t('delete')}
            </Button>
            <Button>{t('abort')}</Button>
          </div>
        }
      />
    </Modal>
  )
}

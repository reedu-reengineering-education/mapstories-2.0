'use client'

import { Button } from '@/src/components/Elements/Button'
import { Modal } from '@/src/components/Modal'
import { TrashIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from '@/src/lib/toast'
import useStory from '@/src/lib/api/story/useStory'
import { useTranslation } from '@/src/app/i18n/client'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { useBoundStore } from '@/src/lib/store/store'
export default function DeleteStepButton({
  storyId,
  storyStepId,
}: {
  storyId: string
  storyStepId: string
}) {
  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  const { t } = useTranslation(lng, 'studio')

  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { story, deleteStoryStep } = useStory(storyId)

  async function handleClick() {
    setLoading(true)

    if (!story || !story.steps) {
      return
    }

    try {
      const stepDeleteIndex = story.steps.findIndex(s => s.id === storyStepId)
      const nextStep = story.steps[stepDeleteIndex + 1]
      const prevStep = story.steps[stepDeleteIndex - 1]
      await deleteStoryStep(storyStepId)

      const redirectStepId = nextStep?.id ?? prevStep?.id ?? ''
      router.replace(`/storylab/${story.slug}/${redirectStepId}`)
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
      title={
        <span>
          {t('confirmDeleteStep')}
          {/* <span className="rounded bg-slate-100 px-2 py-1">{storyStepId}</span> */}
        </span>
      }
      trigger={
        <div className="flex cursor-pointer p-2 transition-colors hover:bg-red-200">
          <TrashIcon className="w-5 text-black" />
        </div>
      }
    >
      <Modal.Footer
        close={
          <div className="flex flex-row justify-between">
            <Button>{t('abort')}</Button>
            <Button onClick={handleClick} variant={'danger'}>
              {t('delete')}
            </Button>
          </div>
        }
      />
    </Modal>
  )
}

'use client'

import { Button } from '@/src/components/Elements/Button'
import useStory from '@/src/lib/api/story/useStory'
import { toast } from '@/src/lib/toast'
import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import { PlusIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AddStoryStepButton({ storyID }: { storyID: string }) {
  const router = useRouter()
  const [loading, setIsLoading] = useState(false)
  const { story, createStoryStep } = useStory(storyID)
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'mapstorySidebar')

  async function onSubmit() {
    setIsLoading(true)

    try {
      const newStoryStep = await createStoryStep()
      router.replace(`/storylab/${story?.slug}/${newStoryStep.id}`)
    } catch (e) {
      return toast({
        title: t('somethingWrong'),
        message: t('stepNotCreated'),
        type: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      className="w-full"
      disabled={loading}
      isLoading={loading}
      onClick={onSubmit}
    >
      <PlusIcon className="w-5" />
    </Button>
  )
}

'use client'

import { Button } from '@/src/components/Elements/Button'
import useStory from '@/src/lib/api/story/useStory'
import { useStoryStore } from '@/src/lib/store/story'
import { toast } from '@/src/lib/toast'
import { PlusIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AddStoryStepButton({ storyID }: { storyID: string }) {
  const router = useRouter()
  const [loading, setIsLoading] = useState(false)
  const addStoryStep = useStoryStore(state => state.addStoryStep)
  const { story, createStoryStep } = useStory(storyID)

  async function onSubmit() {
    setIsLoading(true)

    try {
      const newStoryStep = await createStoryStep()
      addStoryStep(newStoryStep)
      router.replace(`/studio/${story?.slug}/${newStoryStep.id}`)
    } catch (e) {
      return toast({
        title: 'Something went wrong.',
        message: 'Your step was not created. Please try again',
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

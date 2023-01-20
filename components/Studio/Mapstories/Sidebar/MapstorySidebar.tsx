'use client'

import DraggableList from '@/components/DraggableList'
import { Button } from '@/components/Elements/Button'
import { Spacer } from '@/components/Elements/Spacer'
import { useStoryStore } from '@/lib/store/story'
import { toast } from '@/lib/toast'
import { GlobeAltIcon, PlusIcon } from '@heroicons/react/24/outline'
import { StoryStep } from '@prisma/client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import SidebarSlide from './SidebarSlide'

export default function MapstorySidebar() {
  const [loading, setIsLoading] = useState(false)
  const story = useStoryStore(state => state.story)
  const addStoryStep = useStoryStore(state => state.addStoryStep)
  const router = useRouter()

  const path = usePathname()

  const stepId = path?.split('/').at(-1)

  async function onSubmit() {
    setIsLoading(true)

    const response = await fetch(`/api/mapstory/${story?.id}/step`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    setIsLoading(false)

    if (!response?.ok) {
      return toast({
        title: 'Something went wrong.',
        message: 'Your step was not created. Please try again',
        type: 'error',
      })
    }

    toast({
      message: 'Your step has been created.',
      type: 'success',
    })

    const newStep = (await response.json()) as StoryStep
    addStoryStep(newStep)
    router.replace(`/studio/${story?.id}/${newStep.id}`)
  }

  return (
    <aside className="flex h-24 w-full overflow-scroll p-4 md:h-full md:flex-col">
      {story?.steps && story?.steps.length > 0 && (
        <DraggableList
          items={
            story?.steps?.map((s, i) => ({
              id: s.id,
              component: (
                <Link href={`/studio/${story.id}/${s.id}`}>
                  {/* {i !== 0 && <SidebarConnection />} */}
                  <SidebarSlide active={stepId === s.id}>
                    <>
                      <GlobeAltIcon className="w-10" />
                      <p>{s.position}</p>
                    </>
                  </SidebarSlide>
                </Link>
              ),
            }))!
          }
          onChange={e => console.log(e)}
        ></DraggableList>
      )}
      <Spacer size={'sm'} />
      <Button disabled={loading} isLoading={loading} onClick={onSubmit}>
        <PlusIcon className="w-5" />
      </Button>
    </aside>
  )
}

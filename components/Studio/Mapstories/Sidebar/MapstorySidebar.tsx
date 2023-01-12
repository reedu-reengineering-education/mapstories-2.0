'use client'

import { Button } from '@/components/Elements/Button'
import { useStoryStore } from '@/lib/store/story'
import { toast } from '@/lib/toast'
import { GlobeAltIcon, PlusIcon } from '@heroicons/react/24/outline'
import { StoryStep } from '@prisma/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import SidebarSlide from './SidebarSlide'

export default function MapstorySidebar() {
  const [loading, setIsLoading] = useState(false)
  const story = useStoryStore(state => state.story)
  const addStoryStep = useStoryStore(state => state.addStoryStep)
  const router = useRouter()

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
    <aside className="flex h-24 w-full gap-2 overflow-scroll p-4 md:h-full md:flex-col">
      {story &&
        story.steps &&
        story.steps?.length > 0 &&
        // <DraggableList
        //   items={
        //     story?.steps?.map(s => ({
        //       id: s.id,
        //       component: (
        //         <Link href={`/studio/${story.id}/${s.id}`}>
        //           <SidebarSlide>
        //             <GlobeAltIcon className="w-10" />
        //           </SidebarSlide>
        //         </Link>
        //       ),
        //     }))!
        //   }
        //   onChange={e => console.log(e)}
        // ></DraggableList>
        story?.steps?.map(s => (
          <Link href={`/studio/${story.id}/${s.id}`} key={s.id}>
            <SidebarSlide>
              <GlobeAltIcon className="w-10" />
            </SidebarSlide>
          </Link>
        ))}
      <Button disabled={loading} isLoading={loading} onClick={onSubmit}>
        <PlusIcon className="w-5" />
      </Button>
    </aside>
  )
}

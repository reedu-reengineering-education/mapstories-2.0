'use client'

import DraggableList from '@/src/components/DraggableList'
import { Button } from '@/src/components/Elements/Button'
import { Spacer } from '@/src/components/Elements/Spacer'
import useStory from '@/src/lib/api/story/useStory'
import { useStoryStore } from '@/src/lib/store/story'
import { toast } from '@/src/lib/toast'
import { PlusIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { StoryStep } from '@prisma/client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import DeleteStepButton from '../DeleteStepButton'
import SidebarSlide from './SidebarSlide'
import { useHoverMarkerStore } from '@/src/lib/store/hoverMarker'

export default function MapstorySidebar({ storyID }: { storyID: string }) {
  const [loading, setIsLoading] = useState(false)
  const [hoverQuestionMark, setHoverQuestionMark] = useState(false);
  const addStoryStep = useStoryStore(state => state.addStoryStep)
  const updateStory = useStoryStore(state => state.updateStory)
  const router = useRouter()

  const markerId = useHoverMarkerStore(state => state.markerId)
  const path = usePathname()
  const stepId = path?.split('/').at(-1)
  const { story, reorderStorySteps, createStoryStep } = useStory(storyID)

  function handleMouseEnter() {
    setHoverQuestionMark(true);
  }

  function handleMouseLeave() {
    setHoverQuestionMark(false)
  }

  async function onSubmit() {
    setIsLoading(true)

    try {
      const newStoryStep = await createStoryStep()

      toast({
        message: 'Your step has been created.',
        type: 'success',
      })

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

  async function onReorder(update: StoryStep[]) {
    try {
      const res = await reorderStorySteps(update)

      // update Zustand
      updateStory(res)

      toast({
        message: 'Your steps have been reordered.',
        type: 'success',
      })
    } catch (e) {
      return toast({
        title: 'Something went wrong.',
        message: 'Your steps have not been updated. Please try again',
        type: 'error',
      })
    }
  }

  return (
    <aside className="flex h-24 w-full overflow-y-auto overflow-x-hidden p-4 md:h-full md:flex-col">
      {story?.steps && story?.steps.length > 0 && (
        <DraggableList
          items={
            story?.steps?.map(s => ({
              id: s.id,
              s: s,
              slug: story.slug,
              component: (
                <div className="group relative">
                  <Link href={`/studio/${story.slug}/${s.id}`}>
                    {/* {i !== 0 && <SidebarConnection />} */}
                    <SidebarSlide
                      active={stepId === s.id}
                      markerHover={s.id === markerId}
                    >
                      <div className="relative flex justify-around">
                        <div className="flex flex-col ">
                          {/* <GlobeAltIcon className="w-10" /> */}
                          <p>ID: {s.id.slice(-4)}</p>
                          <p>Pos: {s.position}</p>
                        </div>
                      </div>
                    </SidebarSlide>
                  </Link>
                  <div>
                    <DeleteStepButton storyId={s.storyId} storyStepId={s.id} />
                  </div>
                  {!s.feature && (
                    <div className='flex cursor-pointer p-2 absolute top-12 right-1 z-10 rounded-md group-hover:visible' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                      <QuestionMarkCircleIcon className="w-5" />
                      {hoverQuestionMark && (
                        <div className='relative w-full h-full'>
                        <div className='absolute w-36 right-4 bottom-1 bg-white rounded z-20 p-2'>
                          Bitte setzen Sie einen Marker für diese Slide
                        </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ),
            }))!
          }
          onChange={e => onReorder(e.map(({ s }) => s))}
        ></DraggableList>
      )}
      <Spacer size={'sm'} />
      <Button disabled={loading} isLoading={loading} onClick={onSubmit}>
        <PlusIcon className="w-5" />
      </Button>
    </aside>
  )
}

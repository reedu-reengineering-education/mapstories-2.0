'use client'

import DraggableList from '@/src/components/DraggableList'
import useStory from '@/src/lib/api/story/useStory'
import { useStoryStore } from '@/src/lib/store/story'
import { toast } from '@/src/lib/toast'
import { MapPinIcon } from '@heroicons/react/24/outline'
import { StoryStep } from '@prisma/client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import DeleteStepButton from '../DeleteStepButton'
import SidebarSlide from './SidebarSlide'
import { useTranslation } from '@/src/app/i18n/client'
import AddStoryStepButton from './AddStoryStepButton'

export default function MapstorySidebar({
  storyID,
  lng,
}: {
  storyID: string
  lng: string
}) {
  const { t } = useTranslation(lng, 'mapstorySidebar')

  const setStoryID = useStoryStore(state => state.setStoryID)

  useEffect(() => {
    setStoryID(storyID)
  }, [storyID])

  const markerId = useStoryStore(state => state.hoverMarkerId)
  const path = usePathname()
  const stepId = path?.split('/').at(-1)
  const { story, reorderStorySteps } = useStory(storyID)

  const [hoverMarkerIcon, setHoverMarkerIcon] = useState<boolean[]>([])

  const handleMouseEnter = (index: number) => {
    // Create a new array with the updated hover state for the current div
    const newHoverStates = [...hoverMarkerIcon]
    newHoverStates[index] = true
    // Set the hover state for the current div to true
    setHoverMarkerIcon(newHoverStates)
  }

  const handleMouseLeave = (index: number) => {
    const newHoverStates = [...hoverMarkerIcon]
    newHoverStates[index] = false
    setHoverMarkerIcon(newHoverStates)
  }

  const [steps, setSteps] = useState<StoryStep[]>()
  useEffect(() => {
    if (!story?.steps) {
      return
    }
    setHoverMarkerIcon(new Array(story.steps.length).fill(false))
    setSteps(story.steps.sort((a, b) => a.position - b.position))
  }, [story])

  async function onReorder(update: StoryStep[]) {
    try {
      await reorderStorySteps(update)
    } catch (e) {
      return toast({
        title: 'Something went wrong.',
        message: 'Your steps have not been updated. Please try again',
        type: 'error',
      })
    }
  }

  if (!story || !steps) {
    return (
      <aside className="flex h-full w-full gap-6 overflow-y-auto overflow-x-hidden px-4 md:h-full md:flex-col">
        <div className=" flex aspect-video w-full animate-pulse items-center justify-center rounded-lg bg-slate-100"></div>
        <div className=" flex aspect-video w-full animate-pulse items-center justify-center rounded-lg bg-slate-100"></div>
        <div className=" flex aspect-video w-full animate-pulse items-center justify-center rounded-lg bg-slate-100"></div>
        <div className=" flex aspect-video w-full animate-pulse items-center justify-center rounded-lg bg-slate-100"></div>
        <div className=" flex aspect-video w-full animate-pulse items-center justify-center rounded-lg bg-slate-100"></div>
      </aside>
    )
  }

  return (
    <>
      <aside className="flex h-full w-full overflow-y-auto overflow-x-hidden px-4 md:h-full md:flex-col">
        <Link href={`/studio/${story.slug}/${story.firstStepId}`}>
          <SidebarSlide active={stepId === story.firstStepId} variant={'title'}>
            <div className="flex justify-around">
              <div className="flex flex-col">
                <p>ID: {story.firstStepId?.slice(-4)}</p>
                <p>
                  Pos:
                  {story.steps?.find(s => s.id === story.firstStepId)?.position}
                </p>
              </div>
            </div>
          </SidebarSlide>
        </Link>
        <hr className="my-4 border-gray-400" />
        <DraggableList
          items={steps.map((s, i) => ({
            id: s.id,
            s: s,
            slug: story.slug,
            component: (
              <div className="group relative">
                <Link href={`/studio/${story.slug}/${s.id}`}>
                  <SidebarSlide
                    active={stepId === s.id}
                    markerHover={s.id === markerId}
                  >
                    <div className="flex justify-around">
                      <div className="flex flex-col">
                        <p>ID: {s.id.slice(-4)}</p>
                        <p>Pos: {s.position}</p>
                      </div>
                    </div>
                  </SidebarSlide>
                </Link>
                <div className="absolute top-1 right-1 z-10 overflow-hidden rounded-md group-hover:visible">
                  {s.storyId && (
                    <DeleteStepButton storyId={s.storyId} storyStepId={s.id} />
                  )}
                </div>
                {!s.feature && (
                  <div
                    className="absolute top-12 right-1 z-10 flex cursor-pointer rounded-md p-2 group-hover:visible"
                    key={s.id}
                    onMouseEnter={() => handleMouseEnter(i)}
                    onMouseLeave={() => handleMouseLeave(i)}
                  >
                    <span className="relative">
                      <MapPinIcon className="h-5 w-5" />
                      <span className="absolute inset-y-1/2 left-0 right-0 h-0.5 bg-black"></span>
                    </span>
                    {hoverMarkerIcon[i] && (
                      <div className="relative h-full w-full">
                        <div className="absolute right-4 bottom-1 z-20 w-36 rounded bg-white p-2">
                          {t('please set a marker for this slide')}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ),
          }))}
          onChange={e => onReorder(e.map(({ s }) => s))}
        ></DraggableList>

        <div className="sticky bottom-0 z-20 w-full bg-white py-2">
          <AddStoryStepButton storyID={storyID} />
        </div>
      </aside>
    </>
  )
}

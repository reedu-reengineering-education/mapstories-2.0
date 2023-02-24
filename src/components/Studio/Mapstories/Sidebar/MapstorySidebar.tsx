'use client'

import DraggableList from '@/src/components/DraggableList'
import useStory from '@/src/lib/api/story/useStory'
import { useStoryStore } from '@/src/lib/store/story'
import { toast } from '@/src/lib/toast'
import { PlusIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { StoryStep } from '@prisma/client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment, useEffect, useState } from 'react'
import DeleteStepButton from '../DeleteStepButton'
import SidebarSlide from './SidebarSlide'
import { useHoverMarkerStore } from '@/src/lib/store/hoverMarker'
import { useTranslation } from '@/src/app/i18n/client'

export default function MapstorySidebar({
  storyID,
  lng,
}: {
  storyID: string
  lng: string
}) {
  const [loading, setIsLoading] = useState(false)
  const addStoryStep = useStoryStore(state => state.addStoryStep)
  const updateStory = useStoryStore(state => state.updateStory)
  const story = useStoryStore(state => state.story)
  const router = useRouter()
  const { t } = useTranslation(lng, 'mapstorySidebar')

  const markerId = useHoverMarkerStore(state => state.markerId)
  const path = usePathname()
  const stepId = path?.split('/').at(-1)
  const { reorderStorySteps, createStoryStep } = useStory(storyID)
  const [hoverQuestionMark, setHoverQuestionMark] = useState(
    new Array(story?.steps ? story.steps.length : 0).fill(false),
  )

  const handleMouseEnter = (index: number) => {
    // Create a new array with the updated hover state for the current div
    const newHoverStates = [...hoverQuestionMark]
    newHoverStates[index] = true
    // Set the hover state for the current div to true
    setHoverQuestionMark(newHoverStates)
  }

  const handleMouseLeave = (index: number) => {
    const newHoverStates = [...hoverQuestionMark]
    newHoverStates[index] = false
    setHoverQuestionMark(newHoverStates)
  }

  const [steps, setSteps] = useState<StoryStep[]>()
  useEffect(() => {
    setSteps(story?.steps?.sort((a, b) => a.position - b.position))
  }, [story])

  async function onReorder(update: StoryStep[]) {
    try {
      const res = await reorderStorySteps(update)
      // update Zustand
      updateStory(res)
    } catch (e) {
      return toast({
        title: 'Something went wrong.',
        message: 'Your steps have not been updated. Please try again',
        type: 'error',
      })
    }
  }

  if (!story || !steps) {
    return <p>...Loading</p>
  }

  return (
    <>
      <aside className="flex h-full w-full overflow-y-auto overflow-x-hidden px-4 md:h-full md:flex-col">
        <DraggableList
          items={
            story?.steps?.map((s, i) => ({
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
                    <div
                      className="absolute top-12 right-1 z-10 flex cursor-pointer rounded-md p-2 group-hover:visible"
                      key={i}
                      onMouseEnter={() => handleMouseEnter(i)}
                      onMouseLeave={() => handleMouseLeave(i)}
                    >
                      <QuestionMarkCircleIcon className="w-5" />
                      {hoverQuestionMark[i] && (
                        <div className="relative h-full w-full">
                          <div className="absolute right-4 bottom-1 z-20 w-36 rounded bg-white p-2">
                            {t('please set a marker for this slide')}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
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

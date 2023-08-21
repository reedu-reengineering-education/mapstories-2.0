'use client'

import DraggableList from '@/src/components/DraggableList'
import useStory from '@/src/lib/api/story/useStory'
import { toast } from '@/src/lib/toast'
import { MapPinIcon, TagIcon } from '@heroicons/react/24/outline'
import { SlideContent, StoryMode, StoryStep } from '@prisma/client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import DeleteStepButton from '../DeleteStepButton'
import SidebarSlide from './SidebarSlide'
import { useTranslation } from '@/src/app/i18n/client'
import AddStoryStepButton from './AddStoryStepButton'
// import { useUIStore } from '@/src/lib/store/ui'
import { useBoundStore } from '@/src/lib/store/store'
import { getSlideTitle } from '@/src/lib/getSlideTitle'
import { Tooltip } from '@/src/components/Tooltip'
import { useRouter } from 'next/navigation'
import AddStoryStepTimelineButton from './AddStoryStepTimelineButton'

export default function MapstorySidebar({ storyID }: { storyID: string }) {
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'mapstorySidebar')

  const router = useRouter()

  const setStoryID = useBoundStore(state => state.setStoryID)

  useEffect(() => {
    setStoryID(storyID)
  }, [storyID])

  const markerId = useBoundStore(state => state.hoverMarkerId)
  const path = usePathname()
  const stepId = path?.split('/').at(-1)
  const { story, reorderStorySteps } = useStory(storyID)

  const [hoverMarkerIcon, setHoverMarkerIcon] = useState<boolean[]>([])
  const [filteredSteps, setFilteredSteps] = useState<
    (StoryStep & { content: SlideContent[] })[]
  >([])

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

  const [steps, setSteps] =
    useState<(StoryStep & { content: SlideContent[] })[]>()

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
      <aside className="re-basic-box relative left-5 z-40 flex h-full w-full overflow-y-auto overflow-x-hidden bg-white px-4 md:h-full md:flex-col">
        <Link href={`/storylab/${story.slug}/${story.firstStepId}`}>
          <div className="pt-5">
            <SidebarSlide
              active={stepId === story.firstStepId}
              stepId={story.firstStepId!}
              variant={'title'}
            />
            {story.name ? (
              <p className="max-w-[80%] truncate pt-1 text-xs">{story.name}</p>
            ) : (
              <p>No title</p>
            )}
          </div>
        </Link>
        <hr className="my-4 border-gray-400" />
        <DraggableList
          items={steps.map((s, i) => ({
            id: s.id,
            s: s,
            slug: story.slug,
            component: (
              <div className="group relative">
                <div
                  onClick={() => router.push(`/storylab/${story.slug}/${s.id}`)}
                >
                  <SidebarSlide
                    active={stepId === s.id}
                    markerHover={s.id === markerId}
                    position={s.position}
                    stepId={s.id}
                  />
                  <p className="ml-2 max-w-[80%] truncate text-xs">
                    {getSlideTitle(s.content)}
                  </p>
                </div>
                <div className="absolute right-1 top-1 z-10 overflow-hidden rounded-md group-hover:visible">
                  {s.storyId && (
                    <DeleteStepButton storyId={s.storyId} storyStepId={s.id} />
                  )}
                </div>
                {!s.feature && (
                  <div
                    className="absolute right-1 top-12 z-10 flex cursor-pointer rounded-md p-2 group-hover:visible"
                    key={s.id}
                    onMouseEnter={() => handleMouseEnter(i)}
                    onMouseLeave={() => handleMouseLeave(i)}
                  >
                    <Tooltip
                      content={
                        t('please set a marker for this slide') as string
                      }
                      maxwidth={'200px'}
                    >
                      <span className="relative">
                        <MapPinIcon className="h-5 w-5" />
                        <span className="absolute inset-y-1/2 left-0 right-0 h-0.5 rotate-[35deg] bg-black"></span>
                      </span>
                    </Tooltip>
                    {/* {hoverMarkerIcon[i] && (

                    )} */}
                  </div>
                )}
                {s.tags.length > 0 && (
                  <div className="absolute left-1 top-12 z-10 flex cursor-pointer rounded-md group-hover:visible">
                    <Tooltip
                      content={t('slideHasTags') as string}
                      maxwidth={'200px'}
                    >
                      <span className="relative">
                        <TagIcon className="h-5 w-5" />
                      </span>
                    </Tooltip>
                    {/* {hoverMarkerIcon[i] && (

                    )} */}
                  </div>
                )}
              </div>
            ),
          }))}
          onChange={e => onReorder(e.map(({ s }) => s))}
        ></DraggableList>

        <div className="sticky bottom-0 z-20 w-full bg-white py-2">
          {story.mode === StoryMode.NORMAL ? (
            <AddStoryStepButton storyID={storyID} />
          ) : (
            <AddStoryStepTimelineButton storyID={storyID} />
          )}
        </div>
      </aside>
    </>
  )
}

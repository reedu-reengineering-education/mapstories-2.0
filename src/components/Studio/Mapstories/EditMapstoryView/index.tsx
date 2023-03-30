'use client'

import { SlideContent, Story, StoryStep } from '@prisma/client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import useStory from '@/src/lib/api/story/useStory'
import { Spinner } from '@/src/components/Elements/Spinner'
import { StudioShell } from '../../Shell'
import EditMapstoryMap from './EditMapstoryMap'
import { useBoundStore } from '@/src/lib/store/store'
import { XMarkIcon } from '@heroicons/react/24/outline'

type EditMapstoryViewProps = {
  story: Story & {
    steps?: StoryStep[]
    firstStep?: (StoryStep & { content?: SlideContent[] | null }) | null
  }
}

export default function EditMapstoryView({ story }: EditMapstoryViewProps) {
  const [currentStep, setCurrentStep] = useState<StoryStep>()

  const path = usePathname()

  const { story: currentStory } = useStory(story.id)
  const titleSlide = useBoundStore(state => state.titleslide)
  const setTitleSlide = useBoundStore(state => state.setTitleSlide)
  const noMarkerOnSlide = useBoundStore(state => state.noMarkerOnSlide)
  const setNoMarkerOnSlide = useBoundStore(state => state.setNoMarkerOnSlide)
  const dragMarker = useBoundStore(state => state.dragMarker)
  const setDragMarker = useBoundStore(state => state.setDragMarker)
  useEffect(() => {
    const stepId = path?.split('/').at(-1)
    const currentStep = currentStory?.steps?.find(s => s.id === stepId)
    if (currentStep) {
      setCurrentStep(currentStep)
    } else {
      setCurrentStep(currentStory?.firstStep)
    }
  }, [path, currentStory])

  if (!currentStory || !currentStep) {
    return (
      <StudioShell>
        <div className="re-studio-height-full-screen absolute top-0 z-10 flex w-full animate-pulse items-center justify-center overflow-hidden rounded-lg bg-zinc-100 shadow">
          <Spinner />
        </div>
      </StudioShell>
    )
  }

  return (
    <StudioShell>
      <div className="re-studio-height-full-screen absolute top-0 z-10 w-full overflow-hidden rounded-lg shadow">
        <div className="absolute top-0 z-20  w-full ">
          <div className=" mapboxgl-ctrl-group mx-auto mt-2 w-max px-3 py-1 text-center text-sm text-black">
            {titleSlide && currentStep.id === story.firstStepId ? (
              <span className="flex">
                Dies ist deine Titelfolie.{' '}
                <XMarkIcon
                  className="ml-2 h-4 w-5 hover:cursor-pointer"
                  onClick={() => setTitleSlide(false)}
                />{' '}
              </span>
            ) : noMarkerOnSlide && !currentStep?.feature ? (
              <span className="flex">
                Klicke auf die Karte um deinen Marker hinzuzufügen{' '}
                <XMarkIcon
                  className="ml-2 h-4 w-5 hover:cursor-pointer"
                  onClick={() => setNoMarkerOnSlide(false)}
                />{' '}
              </span>
            ) : dragMarker &&
              currentStep?.feature &&
              currentStep.id != story.firstStepId ? (
              <span className="flex">
                Verschiebe den roten Marker um dessen Position zu ändern
                <XMarkIcon
                  className="ml-2 h-4 w-5 hover:cursor-pointer"
                  onClick={() => setDragMarker(false)}
                />
              </span>
            ) : null}
          </div>
        </div>

        <EditMapstoryMap
          currentStepId={currentStep.id}
          steps={currentStory.steps}
        />
      </div>
    </StudioShell>
  )
}

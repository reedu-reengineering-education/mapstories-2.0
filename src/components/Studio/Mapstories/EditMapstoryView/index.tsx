'use client'

import { SlideContent, Story, StoryStep } from '@prisma/client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import useStory from '@/src/lib/api/story/useStory'
import { Spinner } from '@/src/components/Elements/Spinner'
import { StudioShell } from '../../Shell'
import EditMapstoryMap from './EditMapstoryMap'

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
        <div className="absolute left-1/3 top-0 z-20 w-fit">
          <div className=" mapboxgl-ctrl-group mx-auto mt-2 w-fit px-3 py-1 text-center text-sm text-black">
            {currentStep.id === story.firstStepId ? (
              <span>Dies ist deine Titelfolie. </span>
            ) : !currentStep?.feature ? (
              <span>Klicke auf die Karte um deinen Marker hinzuzufügen</span>
            ) : (
              <span>
                Verschiebe den roten Marker um dessen Position zu ändern
              </span>
            )}
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

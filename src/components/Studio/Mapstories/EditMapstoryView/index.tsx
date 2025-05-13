'use client'

import { SlideContent, Story, StoryStep, Theme } from '@prisma/client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import useStory from '@/src/lib/api/story/useStory'
import { Spinner } from '@/src/components/Elements/Spinner'
import { StudioShell } from '../../Shell'
import EditMapstoryMap from './EditMapstoryMap'
import { useBoundStore } from '@/src/lib/store/store'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { useTranslation } from '@/src/app/i18n/client'
import { Trans } from 'react-i18next'
import { applyTheme } from '@/src/helper/applyTheme'
import { Modal } from '@/src/components/Modal'
import { Button } from '@/src/components/Elements/Button'

type EditMapstoryViewProps = {
  story: Story & {
    theme?: Theme | null
    steps?: StoryStep[]
    firstStep?: (StoryStep & { content?: SlideContent[] | null }) | null
  }
}

export default function EditMapstoryView({ story }: EditMapstoryViewProps) {
  const [currentStep, setCurrentStep] = useState<StoryStep>()

  const path = usePathname()
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth)
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight)
  const [showSizeModal, setShowSizeModal] = useState<boolean>(false)
  const { story: currentStory } = useStory(story.id)

  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  const { t } = useTranslation(lng, 'editMapstory')

  //apply theme on first load
  useEffect(() => {
    applyTheme(story.theme)
  }, [])

  useEffect(() => {
    const stepId = path?.split('/').at(-1)
    const currentStep = currentStory?.steps?.find(s => s.id === stepId)
    if (currentStep) {
      setCurrentStep(currentStep)
    } else {
      setCurrentStep(currentStory?.firstStep)
    }
  }, [path, currentStory])

  useEffect(() => {
    // if window size is below 800px display a message saying that the editor is not available on mobile
    if (windowWidth < 800 || windowHeight < 400) {
      setShowSizeModal(true)
    }
  }, [windowWidth, windowHeight])

  if (!currentStory || !currentStep) {
    return (
      <StudioShell>
        <div className="absolute top-0 z-10 flex h-full w-full animate-pulse items-center justify-center overflow-hidden rounded-lg bg-zinc-100 shadow">
          <Spinner />
        </div>
      </StudioShell>
    )
  }

  return (
    // <StudioShell>
    <div className="absolute top-0 z-10 h-full w-full overflow-hidden rounded-lg shadow">
      {showSizeModal && (
        <Modal
          onClose={() => setShowSizeModal(false)}
          open={showSizeModal}
          title={t('noMobile')}
        >
          <Modal.Content>
            <p>{t('noMobileText')}</p>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex justify-end">
              <Button onClick={() => setShowSizeModal(false)}>Ok</Button>
            </div>
          </Modal.Footer>
        </Modal>
      )}

      <div className="absolute left-1/2 top-20 z-20 w-fit -translate-x-2/4">
        <div className="mapboxgl-ctrl-group mx-auto mt-2 w-fit px-3 py-1 text-center text-sm text-black">
          {currentStep.id === story.firstStepId ? (
            <span>
              <Trans components={{ 1: <br /> }}>{t('your_titlepage')}</Trans>
            </span>
          ) : !currentStep?.feature ? (
            <span>
              <Trans>{t('click_on_map_to_set_marker')}</Trans>
            </span>
          ) : (
            <span>{t('move_the_red_marker')}</span>
          )}
        </div>
      </div>

      <EditMapstoryMap currentStep={currentStep} steps={currentStory.steps} />
    </div>
    // </StudioShell>
  )
}

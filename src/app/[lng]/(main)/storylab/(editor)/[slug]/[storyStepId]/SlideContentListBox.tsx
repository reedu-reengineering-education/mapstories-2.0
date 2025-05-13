'use client'

import React from 'react'
import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import useStory from '@/src/lib/api/story/useStory'
import useStep from '@/src/lib/api/step/useStep'
import PreviewSlideButton from '@/src/components/Studio/Mapstories/PreviewSlideButton'
import { SlideContentListEdit } from '@/src/components/Studio/Mapstories/SlideContentListEdit'
import SlideContentModal from './SlideContentModal'
import { Button } from '@/src/components/Elements/Button'
import { PlusIcon, TagIcon } from 'lucide-react'
import { Spacer } from '@/src/components/Elements/Spacer'
import StepTagModal from './StepTagModal'
import StepCalendarModal from './StepCalendarModal'
import { StoryMode } from '@prisma/client'
import { fallbackLng, languages } from '@/src/app/i18n/settings'

type Props = {
  storyStepId: string
  storyId: string
}

export default function SlideContentListBox({ storyStepId, storyId }: Props) {
  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  const { t } = useTranslation(lng, 'step')
  const { story } = useStory(storyId)
  const { step: storyStep } = useStep(storyStepId)
  const { showSlidePreview } = useBoundStore()

  return (
    <>
      {story && !showSlidePreview && (
        <div className="re-basic-box relative z-20 max-h-[70lvh] min-w-[18rem] overflow-scroll bg-white p-4">
          {storyStep?.content && storyStep.content.length > 0 && (
            <PreviewSlideButton />
          )}
          <h3 className="pb-4"></h3>
          <div>
            <SlideContentListEdit
              stepId={storyStepId}
              storyId={story.id}
            ></SlideContentListEdit>
          </div>

          <SlideContentModal
            storyStepId={storyStepId}
            trigger={
              <Button
                className="w-full"
                startIcon={<PlusIcon className="h-10"></PlusIcon>}
                variant={'primary'}
              >
                {t('addMedia')}
              </Button>
            }
          />
          {story.mode === StoryMode.TIMELINE && (
            <>
              {
                /* hide the calendar modal for title slide */
                story.firstStepId !== storyStep?.id && (
                  <div>
                    <Spacer />
                    <StepTagModal
                      storyStepId={storyStepId}
                      tags={storyStep?.tags}
                      trigger={
                        <Button
                          className="w-full"
                          startIcon={<TagIcon className="h-6" />}
                          variant={'inverse'}
                        >
                          Add tag
                        </Button>
                      }
                    />
                    <Spacer />
                  </div>
                )
              }

              {/* hide the calendar modal for title slide */}
              {story.firstStepId !== storyStep?.id && (
                <StepCalendarModal storyStepId={storyStepId} />
              )}
            </>
          )}
        </div>
      )}
    </>
  )
}

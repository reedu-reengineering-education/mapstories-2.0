'use client'

import { useBoundStore } from '@/src/lib/store/store'
import * as React from 'react'
import { useEffect } from 'react'
import { Slide } from './Slide'
import { SlideContent, StoryMode, StoryStep } from '@prisma/client'
import { format } from 'date-fns'
import { getDateFnsLocale } from '@/src/app/i18n/date-fns-locale'
import { CalendarDaysIcon } from '@heroicons/react/24/outline'
import { cx } from 'class-variance-authority'

type Props = {
  slug: string
  page: string
  className?: string
  story: any
  //  Story & {
  //   steps?: (StoryStep & { content: SlideContent[] })[]
  //   firstStep?: StoryStep & { content: SlideContent[] }
  // }
}

export function Slides({ className, slug, page, story }: Props) {
  const setStoryID = useBoundStore(state => state.setStoryID)
  const lng = useBoundStore(state => state.language)

  const step: StoryStep & {
    content?: SlideContent[] | undefined
  } =
    page == 'start'
      ? story?.firstStep
      : story?.steps.find((s: any) => s.position == page)

  const updateSelectedStepIndex = useBoundStore(
    state => state.updateSelectedStepIndex,
  )
  useEffect(() => {
    if (story) {
      setStoryID(story.id)
    } else {
      setStoryID('')
    }
  }, [story])

  useEffect(() => {
    updateSelectedStepIndex(parseInt(page))
  }, [page])

  useEffect(() => {
    updateSelectedStepIndex(parseInt(page))
  }, [])

  return (
    <div className="flex w-full flex-col">
      {story.mode === StoryMode.TIMELINE && step?.timestamp && (
        <div className={cx('', className)}>
          <div className="my-2 flex min-h-12 w-fit items-center gap-2 rounded bg-zinc-100 px-2">
            <CalendarDaysIcon className="w-4" />
            <p className="text-sm">
              {format(step.timestamp, 'PPP p', {
                locale: getDateFnsLocale(lng),
              })}
            </p>
          </div>
        </div>
      )}
      <div className="w-full">
        {story?.steps.sort(
          (a: StoryStep, b: StoryStep) => a.position - b.position,
        ) &&
          page && <Slide step={step}></Slide>}
        {/* {page != 'start' && parseInt(page) + 1 < (story?.steps?.length ?? 0) && (
        <Button onClick={() => nextStep()}>Weiter</Button>
      )} */}
      </div>
    </div>
  )
}

// @ts-nocheck
'use client'

import TimelineChartWrapper from '@/src/components/Timeline/TimelineChartWrapper'
import { StoryMode } from '@prisma/client'
import useSwipe from '@/src/lib/useSwipe'
import { useBoundStore } from '@/src/lib/store/store'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { useViewerNavigation } from '@/src/lib/hooks/useViewerNavigation'
import { ViewerNavigationButtons } from './ViewerNavigationButtons'
import { ViewerStartView } from './ViewerStartView'
import { ViewerStepView } from './ViewerStepView'

type Props = {
  filter: string
  slug: string[]
  story: any
  tags: string[]
}

export function ViewerWrapper({ filter, slug, story, tags }: Props) {
  // Get language from store
  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }

  // Navigation logic
  const { prevStep, nextStep } = useViewerNavigation({
    slug,
    totalSteps: story?.steps?.length ?? 0,
  })

  // Swipe handlers for mobile
  const _swipeHandlers = useSwipe({
    onSwipedLeft: () => nextStep(),
    onSwipedRight: () => prevStep(),
  })

  const isStartView = slug[1] === 'start'

  return (
    <div className="flex h-full w-full flex-col px-20 pt-4 lg:gap-5 lg:pb-10 lg:pt-20">
      {/* Main Content Area */}
      <div className="hidden overflow md:flex flex-1 justify-end overflow-auto align-baseline">
        {/* Side Navigation Buttons */}
        <ViewerNavigationButtons
          page={slug[1]}
          position="sides"
          slug={slug[0]}
          story={story}
          variant="navbar"
        />

        {/* Conditional View: Start or Step */}
        {isStartView ? (
          <ViewerStartView slug={slug} story={story} tags={tags} />
        ) : (
          <ViewerStepView lng={lng} slug={slug} story={story} />
        )}
      </div>

      {/* Timeline Section */}
      {story?.mode === StoryMode.TIMELINE && (
        <div className="flex items-center justify-center gap-5 pb-6 lg:p-0">
          <ViewerNavigationButtons
            page={slug[1]}
            position="inline"
            slug={slug[0]}
            story={story}
            variant="primary"
          />
          <div className="re-basic-box z-10 flex-1 bg-white px-2">
            <TimelineChartWrapper
              activeIndex={Number(slug[1])}
              filter={filter}
              story={story as any}
            />
          </div>
        </div>
      )}
    </div>
  )
}

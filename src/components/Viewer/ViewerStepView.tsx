'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { cx } from 'class-variance-authority'
import { ListBulletIcon } from '@radix-ui/react-icons'
import { Slides } from '@/src/components/Viewer/Slides'
import { StorySlideListViewer } from '@/src/components/Viewer/StorySlideListViewer'
import SlidesOverview from './SlidesOverview'
import RestartStoryButton from './RestartStoryButton'
import QuitStoryButton from './QuitStoryButton'
import AddCommunityStep from './CommunityStep/AddCommunityStep'
import { ViewerBoxFooter } from './ViewerBoxFooter'
import { ViewerStepNavigation } from './ViewerStepNavigation'

interface ViewerStepViewProps {
  slug: string[]
  story: any
  lng: string
}

const slideVariants = {
  enter: (direction: number) => ({ x: direction * 40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction * -40, opacity: 0 }),
}

export function ViewerStepView({ slug, story, lng }: ViewerStepViewProps) {
  const [showSlides, setShowSlides] = useState<boolean>(true)
  const path = usePathname()
  const isEmbed = path?.includes('/embed/')
  const reduceMotion = useReducedMotion()

  // slide direction: +1 when moving forward, -1 when moving back
  const page = parseInt(slug[1])
  const prevPage = useRef(page)
  const direction = page >= prevPage.current ? 1 : -1
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    prevPage.current = page
    // start each step at the top of its content
    contentRef.current?.scrollTo({ top: 0 })
  }, [page])

  return (
    <div className="re-basic-box z-[60] hidden max-h-full w-[55%] flex-col self-start overflow-hidden bg-white md:flex lg:w-[50%]">
      {/* Toolbar */}
      <div className="relative flex shrink-0 items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 py-2">
        <button
          aria-label="Toggle slide overview"
          aria-pressed={!showSlides}
          className={cx(
            'flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-slate-100',
            !showSlides ? 'bg-slate-100' : '',
          )}
          onClick={() => setShowSlides(!showSlides)}
          title="Overview"
        >
          <ListBulletIcon className="h-5 w-5" />
        </button>
        <div className="absolute top-0 px-16">
          <StorySlideListViewer
            filter={'all'}
            page={slug[1]}
            slidesOpen={false}
            slug={slug[0]}
            story={story}
          />
        </div>

        <div className="flex items-center gap-1">
          {story.community && (
            <AddCommunityStep size="xs" slug={slug[1]} story={story} />
          )}
          <RestartStoryButton slug={slug[0]} />
          {!isEmbed && <QuitStoryButton slug={slug[0]} />}
        </div>
      </div>

      {/* Content Area */}
      <div
        className="min-h-0 max-w-full flex-1 overflow-y-auto overflow-x-hidden px-4"
        ref={contentRef}
      >
        <div className={cx(showSlides ? 'flex' : 'hidden')}>
          <AnimatePresence custom={direction} initial={false} mode="wait">
            <motion.div
              animate="center"
              className="w-full"
              custom={direction}
              exit="exit"
              initial="enter"
              key={slug[1]}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.25, ease: 'easeOut' }
              }
              variants={slideVariants}
            >
              <Slides page={slug[1]} slug={slug[0]} story={story} />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className={cx(showSlides ? 'hidden' : 'flex')}>
          <SlidesOverview
            lng={lng}
            page={slug[1]}
            slug={slug[0]}
            story={story}
          />
        </div>
      </div>

      <ViewerBoxFooter>
        <ViewerStepNavigation slug={slug} story={story} />
      </ViewerBoxFooter>
    </div>
  )
}

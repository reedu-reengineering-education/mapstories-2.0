'use client'

import useStory from '@/src/lib/api/story/useStory'
import { useBoundStore } from '@/src/lib/store/store'
import { usePathname, useRouter } from 'next/navigation'
import * as React from 'react'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { getSlideTitle } from '@/src/lib/getSlideTitle'
import { cx } from 'class-variance-authority'

type Props = {
  filter: string
  slug: string
  page: string
  slidesOpen: boolean
}

export function StorySlideListViewer({
  filter,
  slug,
  page,
  slidesOpen,
}: Props) {
  const router = useRouter()
  const path = usePathname()
  const onMyStoriesRoute = path?.includes('mystories')
  const setStoryID = useBoundStore(state => state.setStoryID)
  const { story } = useStory(slug)

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

  function goToStep(position: number) {
    onMyStoriesRoute
      ? router.push(`/mystories/${filter}/story/${slug}/${position}`)
      : router.push(`/gallery/story/${slug}/${position}`)
  }

  const variantsList = {
    open: {
      transition: { staggerChildren: 0.57, delayChildren: 0.2 },
      // 'max-height': '50VH',
    },
    closed: {
      transition: {
        staggerChildren: 0.55,
        staggerDirection: -1,
        delay: (story?.steps?.length ?? 0) * 0.05,
      },
      display: 'none',
    },
  }

  const variantsItem = {
    open: (i: number) => ({
      opacity: 0.85,
      y: 0,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
        delay: i * 0.05,
      },
    }),
    closed: (i: number) => ({
      y: 60,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
        delay: i * 0.05,
      },
    }),
  }

  return (
    <div className="py-4">
      {/* {story?.steps && story?.steps?.length > 0 && ( */}
      <motion.ul
        animate={slidesOpen ? 'open' : 'closed'}
        className="re-viewer-slides absolute px-2"
        exit={'closed'}
        initial={slidesOpen ? 'open' : 'closed'}
        variants={variantsList}
      >
        {story?.steps
          ?.sort((a, b) => a.position - b.position)
          .map((step, i) => {
            //   return <div key={step.position}>Side {step.position}</div>
            return (
              <motion.li
                animate={slidesOpen ? 'open' : 'closed'}
                className={cx(
                  'my-2 h-12 w-20  cursor-pointer px-1 py-3',
                  step.position == parseInt(page)
                    ? 'border-2 bg-active'
                    : 'bg-slate-100',
                )}
                custom={i}
                exit={'closed'}
                initial={slidesOpen ? 'open' : 'closed'}
                key={step.position}
                onClick={() => goToStep(step.position)}
                variants={variantsItem}
                whileHover={{ opacity: 1, scale: 1.1 }}
                whileTap={{ opacity: 1, scale: 0.95 }}
              >
                <div className="overflow-hidden">
                  <span className="whitespace-nowrap">
                    {step.position + 1}. {getSlideTitle(step.content)}
                  </span>
                </div>
              </motion.li>
            )
          })}
      </motion.ul>
      {/* )} */}
    </div>
  )
}

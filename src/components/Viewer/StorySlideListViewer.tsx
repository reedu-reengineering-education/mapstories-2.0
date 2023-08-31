'use client'

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
  story: any
}

export function StorySlideListViewer({
  filter,
  slug,
  page,
  slidesOpen,
  story,
}: Props) {
  const router = useRouter()
  const path = usePathname()
  const setStoryID = useBoundStore(state => state.setStoryID)

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
    const pathLocal =
      path?.split('/').splice(2, 3).join('/') ?? 'gallery/all/story/'

    router.push(`${pathLocal}/${slug}/${position}`)
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
    <div className={slidesOpen ? 'block ' : 'hidden '}>
      <motion.ul
        animate={slidesOpen ? 'open' : 'closed'}
        className="re-viewer-slides absolute px-2 py-4"
        exit={'closed'}
        variants={variantsList}
      >
        {story?.steps
          ?.sort((a: any, b: any) => a.position - b.position)
          .map((step: any, i: number) => {
            //   return <div key={step.position}>Side {step.position}</div>
            return (
              <motion.li
                animate={slidesOpen ? 'open' : 'closed'}
                className={cx(
                  'my-2 h-12  cursor-pointer px-1 py-3',
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
                    {step.position + 1}.{' '}
                    {getSlideTitle(step.content).substring(0, 20)}
                  </span>
                </div>
              </motion.li>
            )
          })}
      </motion.ul>
    </div>
  )
}

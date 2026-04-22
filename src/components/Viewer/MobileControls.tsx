'use client'

import { useEffect, useState } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/src/components/Elements/drawer'
import { Slide } from './Slide'
import { usePathname, useRouter } from 'next/navigation'
import * as Toolbar from '@radix-ui/react-toolbar'
import { PlayIcon } from '@radix-ui/react-icons'
import { ArrowLeft, ArrowRight, ListChecksIcon } from 'lucide-react'
import { useBoundStore } from '@/src/lib/store/store'
import { AnimatePresence, motion } from 'framer-motion'
import useSwipe from '@/src/lib/useSwipe'

interface MobileControlsProps {
  slug: string
  page: string
  story: any
  tags: string[]
}

export function MobileControls({ slug, page, story, tags: _tags }: MobileControlsProps) {
  const [open, setOpen] = useState(true)
  const [snap, setSnap] = useState<number | string | null>(0.6)
  const [currentStep, setCurrentStep] = useState<any>(null)
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0)
  const router = useRouter()
  const path = usePathname()
  const updateSelectedStepIndex = useBoundStore(
    state => state.updateSelectedStepIndex,
  )

  const snapPoints = [0.4, 0.6, 1.0]

  const handleHeaderClick = () => {
    const currentIndex = snapPoints.indexOf(snap as number)
    const nextIndex = (currentIndex + 1) % snapPoints.length
    setSnap(snapPoints[nextIndex])
  }


  useEffect(() => {
    if (story) {
      const pageIndex = page === 'start' ? 0 : parseInt(page)
      setCurrentPageIndex(pageIndex)
      const stepTmp = page === 'start' ? story.firstStep : story.steps?.[pageIndex]
      setCurrentStep(stepTmp)
    }
  }, [story, page])

  function startStory() {
    const pathLocal =
      path?.split('/').splice(2, 3).join('/') ?? 'gallery/all/story/'
    router.push(`/${pathLocal}/${slug}/0`)
  }

  function backToStart() {
    const pathLocal =
      path?.split('/').splice(2, 3).join('/') ?? 'gallery/all/story/'
    router.push(`/${pathLocal}/${slug}/start`)
  }

  const nextStep = () => {
    const nextIndex = currentPageIndex + 1
    if (story.steps && nextIndex < story.steps.length) {
      setCurrentPageIndex(nextIndex)
      setCurrentStep(story.steps[nextIndex])
      updateSelectedStepIndex(nextIndex)
    }
  }

  const prevStep = () => {
    const prevIndex = currentPageIndex - 1
    if (prevIndex >= 0 && story.steps && prevIndex < story.steps.length) {
      setCurrentPageIndex(prevIndex)
      setCurrentStep(story.steps[prevIndex])
      updateSelectedStepIndex(prevIndex)
    }
  }

  // Swipe handlers for mobile navigation
  const swipeHandlers = useSwipe({
    onSwipedLeft: () => nextStep(),
    onSwipedRight: () => prevStep(),
  })

  return (
    <>
      <Drawer
        activeSnapPoint={snap}
        dismissible={false}
        modal={false}
        onOpenChange={setOpen}
        open={open}
        setActiveSnapPoint={setSnap}
        snapPoints={snapPoints}
      >
        <DrawerContent className="absolute z-[60] md:hidden border-t-8 border-black  pointer-events-auto bg-white !rounded-b-none flex flex-col after:hidden pb-20 max-h-full h-full">
          <DrawerHeader className="shrink-0 cursor-pointer" onClick={handleHeaderClick}>
            <hr style={{
              borderTop: '10px solid #D9D9D9',
              borderRadius: '5px',
              width: '50px',
              margin: '0 auto 10px auto',
            }}>
            </hr>
            <DrawerTitle  className="enable-theme-font text-4xl">{story?.name}</DrawerTitle>

          </DrawerHeader>

          <div 
            className="flex-1 overflow-y-auto px-4 h-96 relative"
            onTouchEnd={swipeHandlers.onTouchEnd}
            onTouchMove={swipeHandlers.onTouchMove}
            onTouchStart={swipeHandlers.onTouchStart}
          >
            <AnimatePresence mode="wait">
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                initial={{ opacity: 0, x: 20 }}
                key={currentStep?.id || page}
                transition={{
                  duration: 0.3,
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                <Slide step={currentStep} />
              </motion.div>
            </AnimatePresence>
          </div>
        </DrawerContent>
      </Drawer>
          
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[95%] z-[70] md:hidden  rounded-none p-4 pointer-events-auto bg-white">
       <hr className='p-2 border-t-4'></hr>
        {page !== 'start' && story.steps && (
          <div className="text-center mb-3">
            <span className="text-sm font-medium text-gray-600">
              Schritt {currentPageIndex + 1} von {story.steps.length}
            </span>
          </div>
        )}
        <Toolbar.Root
          aria-label="Story Controls"
          className="flex justify-center gap-2"
        >
          <Toolbar.ToggleGroup
            aria-label="Viewer Controls"
            className="flex gap-2"
            type="single"
          >
            {page !== 'start' && currentPageIndex === 0 && (
              <>
              <Toolbar.Button
                aria-label="Restart story"
                className="re-basic-box flex items-center gap-2 px-4 py-2 hover:bg-slate-100"
                onClick={backToStart}
                title="Restart Story"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm">Neustart</span>
              </Toolbar.Button>                
              <Toolbar.Button
                aria-label="Next step"
                className="re-basic-box flex items-center gap-2 px-4 py-2 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!story.steps || currentPageIndex >= story.steps.length - 1}
                onClick={nextStep}
                title="Next Step"
              >
                <ArrowRight className="h-5 w-5" />
                <span className="text-sm">Weiter</span>
              </Toolbar.Button>
              </>
            )}
            {page !== 'start' && currentPageIndex > 0 && (
              <>
              
              <Toolbar.Button
                aria-label="Previous step"
                className="re-basic-box flex items-center gap-2 px-4 py-2 hover:bg-slate-100"
                onClick={prevStep}
                title="Previous Step"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm">Zurück</span>
              </Toolbar.Button>                
              <Toolbar.Button
                aria-label="Next step"
                className="re-basic-box flex items-center gap-2 px-4 py-2 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!story.steps || currentPageIndex >= story.steps.length - 1}
                onClick={nextStep}
                title="Next Step"
              >
                <ArrowRight className="h-5 w-5" />
                <span className="text-sm">Weiter</span>
              </Toolbar.Button>
              </>

            )}
            {page === 'start' && (
              <>
              <Toolbar.Button
                aria-label="Start story"
                className="re-basic-box flex items-center gap-2 px-4 py-2 hover:bg-slate-100"
                onClick={startStory}
                title="Start Story"
              >
                <PlayIcon className="h-5 w-5" />
                <span className="text-sm">Start</span>
              </Toolbar.Button>
                            <Toolbar.Button
              aria-label="Show steps"
              className="re-basic-box flex items-center gap-2 px-4 py-2 hover:bg-slate-100"
              title="Steps"
            >
              <ListChecksIcon className="h-5 w-5" />
              <span className="text-sm">Schritte</span>
            </Toolbar.Button>
            </>
            )}

          </Toolbar.ToggleGroup>
        </Toolbar.Root>
      </div>
    </>
  )
}
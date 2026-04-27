'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/src/components/Elements/drawer'
import { Slide } from './Slide'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronUp } from 'lucide-react'
import { useBoundStore } from '@/src/lib/store/store'
import { AnimatePresence, motion } from 'framer-motion'
import useSwipe from '@/src/lib/useSwipe'
import { MobileToolbar } from './MobileToolbar'

interface MobileControlsProps {
  slug: string
  page: string
  story: any
  tags: string[]
}

export function MobileControls({ slug, page, story, tags: _tags }: MobileControlsProps) {
  const [open, setOpen] = useState(true)
  const [snap, setSnap] = useState<number | string | null>(0.55)
  const [currentStep, setCurrentStep] = useState<any>(null)
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0)
  const [showSteps, setShowSteps] = useState<boolean>(false)
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const path = usePathname()
  const updateSelectedStepIndex = useBoundStore(
    state => state.updateSelectedStepIndex,
  )
  const lng = useBoundStore(state => state.language) || 'de'

  // Hardcodierte Texte für Story-Info
  const labels = {
    de: { author: 'Autor:', createdAt: 'Erstellt:', updatedAt: 'Aktualisiert:' },
    en: { author: 'Author:', createdAt: 'Created:', updatedAt: 'Updated:' },
    es: { author: 'Autor:', createdAt: 'Creado:', updatedAt: 'Actualizado:' },
    fr: { author: 'Auteur:', createdAt: 'Créé:', updatedAt: 'Mis à jour:' },
  }
  const currentLabels = labels[lng as keyof typeof labels] || labels.de

  const snapPoints = [0.15, 0.55, 0.98]

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

  const toggleSteps = () => {
    setShowSteps(prev => !prev)
  }

  // Scroll handler to detect when user scrolled to bottom
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget
    const scrolledToBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 50
    setShowScrollToTop(scrolledToBottom && element.scrollTop > 200)
  }

  // Scroll to top function
  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Reset scroll position when step changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0
      setShowScrollToTop(false)
    }
  }, [currentPageIndex])

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
        snapToSequentialPoint={true}
      >
        <DrawerContent className="absolute z-[60] md:hidden border-t-8 border-black  pointer-events-auto bg-white !rounded-b-none flex flex-col after:hidden max-h-full h-full">
          <DrawerHeader className="shrink-0 cursor-pointer" >
            {snap === 0.15 ? (
              <div className="flex items-center justify-center gap-2 py-2" onClick={handleHeaderClick}>
                <ChevronUp className="h-4 w-4 text-gray-600" />
                <p className="text-gray-600 text-sm">
                  Tippen, um die Mapstory anzuzeigen
                </p>
              </div>
            ) : (
              <>
                <hr 
                onClick={handleHeaderClick} style={{
                  borderTop: '10px solid #D9D9D9',
                  borderRadius: '5px',
                  width: '50px',
                  margin: '0 auto 10px auto',
                }}> 
                </hr>
                <div className="flex items-center gap-2 mb-2">
                  <DrawerTitle className="enable-theme-font text-lg flex-1 truncate">{story?.name}</DrawerTitle>
                </div>
                <MobileToolbar
                  currentPageIndex={currentPageIndex}
                  onBackToStart={backToStart}
                  onNextStep={nextStep}
                  onPrevStep={prevStep}
                  onStartStory={startStory}
                  page={page}
                  story={story}
                  toggleSteps={toggleSteps}
                />
              </>
            )}
          </DrawerHeader>

          {snap !== 0.15 && (
            showSteps ? (
              <div className="flex-1 overflow-y-auto px-4 h-96 relative">
                <AnimatePresence mode="wait">
                  <motion.div

                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    initial={{ opacity: 0, x: 20 }}
                    key="steps-list"
                    transition={{
                      duration: 0.3,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                  >
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <p className="text-sm text-gray-600">
                        <b>{currentLabels.author}</b> {story.author?.name || 'Unbekannt'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <b>{currentLabels.createdAt}</b> {new Date(story.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        <b>{currentLabels.updatedAt}</b> {new Date(story.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 w-16">#</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Schritt</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {story.steps?.map((step: any, index: number) => (
                            <tr
                              className={`cursor-pointer transition-colors min-h-[48px] ${
                                index === currentPageIndex 
                                  ? 'bg-blue-50 hover:bg-blue-100' 
                                  : 'hover:bg-gray-50 active:bg-gray-100'
                              }`}
                              key={step.id}
                              onClick={() => {
                                setCurrentPageIndex(index)
                                setCurrentStep(step)
                                updateSelectedStepIndex(index)
                                setShowSteps(false)
                              }}
                            >
                              <td className="px-4 py-4 text-base font-semibold text-gray-600 align-top">
                                {index + 1}
                              </td>
                              <td className="px-4 py-4 align-top">
                                <div className="font-medium text-base text-gray-900">
                                  {step.title || `Schritt ${index + 1}`}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
            <div
              className="flex-1 overflow-y-auto px-4 h-96 relative [&]:touch-pan-y"
              data-vaul-no-drag
              onScroll={handleScroll}
              onTouchEnd={swipeHandlers.onTouchEnd}
              onTouchMove={swipeHandlers.onTouchMove}
              onTouchStart={swipeHandlers.onTouchStart}
              ref={scrollContainerRef}
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
              
              {/* Scroll to top button */}
              {showScrollToTop && (
                <button
                  aria-label="Scroll to top"
                  className="fixed bottom-6 right-4 z-50 bg-white border-2 border-gray-300 rounded-full p-3 shadow-lg hover:bg-gray-50 active:bg-gray-100 transition-all"
                  onClick={scrollToTop}
                >
                  <ChevronUp className="h-6 w-6 text-gray-700" />
                </button>
              )}
            </div>

        ))}

        </DrawerContent>
      </Drawer>


    </>
  )
}
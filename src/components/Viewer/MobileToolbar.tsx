import { PlayIcon } from '@radix-ui/react-icons'
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'

interface MobileToolbarProps {
  page: string
  story: any
  currentPageIndex: number
  onBackToStart: () => void
  onNextStep: () => void
  onPrevStep: () => void
  onStartStory: () => void
  onToggleSteps?: () => void
  /** 'portrait' = larger icons for drawer, 'landscape' = compact for side panel */
  variant?: 'portrait' | 'landscape'
}

export function MobileToolbar({
  page,
  story,
  currentPageIndex,
  onBackToStart,
  onNextStep,
  onPrevStep,
  onStartStory,
  onToggleSteps,
  variant = 'portrait',
}: MobileToolbarProps) {
  const isLandscape = variant === 'landscape'
  const iconSize = isLandscape ? 'h-8 w-8' : 'h-10 w-10'
  const textSize = isLandscape ? 'text-[12px]' : 'text-[14px]'
  const canGoNext = story?.steps && currentPageIndex < story.steps.length - 1
  const canGoPrev = currentPageIndex > 0

  return (
    <div className="w-full pointer-events-auto">
      {page === 'start' ? (
        // Start view: Show title and start button
        <div className="flex flex-col items-center gap-3 py-2">
          <h1 className="enable-theme-font text-xl font-bold text-gray-900 text-center px-2 leading-tight">
            {story?.name}
          </h1>
          <button
            aria-label="Start story"
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded text-sm text-gray-700 font-medium"
            onClick={onStartStory}
            title="Start Story"
          >
            <PlayIcon className="h-5 w-5" />
            <span>Start</span>
          </button>
        </div>
      ) : (
        // Step view: Navigation + Restart
        <div className="flex items-center justify-between py-1">
          {/* Previous button */}
          <button
            aria-label="Previous step"
            className="flex items-center gap-1 px-2 py-1 hover:bg-slate-100 rounded text-xs text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={!canGoPrev}
            onClick={onPrevStep}
            title="Previous Step"
          >
            <ArrowLeft className={iconSize} />
          </button>

          {/* Center: Step info + Restart */}
          <div 
            className={`flex-1 flex items-center justify-center gap-2 ${onToggleSteps ? 'cursor-pointer' : ''}`}
            onClick={onToggleSteps}
          >
            <span className={`${textSize} text-gray-600 uppercase tracking-wider`}>
              Schritt {currentPageIndex + 1} / {story?.steps?.length || 0}
            </span>
            <button
              aria-label="Restart story"
              className="p-1 hover:bg-slate-100 rounded text-gray-500 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation()
                onBackToStart()
              }}
              title="Neustart"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* Next button */}
          <button
            aria-label="Next step"
            className="flex items-center gap-1 px-2 py-1 hover:bg-slate-100 rounded text-xs text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={!canGoNext}
            onClick={onNextStep}
            title="Next Step"
          >
            <ArrowRight className={iconSize} />
          </button>
        </div>
      )}
    </div>
  )
}

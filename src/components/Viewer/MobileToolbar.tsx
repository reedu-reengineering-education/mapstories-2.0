import { PlayIcon } from '@radix-ui/react-icons'
import { ArrowLeft, ArrowRight, ListChecksIcon } from 'lucide-react'
import { Button } from '../Elements/Button'

interface MobileToolbarProps {
  page: string
  story: any
  currentPageIndex: number
  onBackToStart: () => void
  onNextStep: () => void
  onPrevStep: () => void
  onStartStory: () => void
  toggleSteps?: () => void
}

export function MobileToolbar({
  page,
  story,
  currentPageIndex,
  onBackToStart,
  onNextStep,
  onPrevStep,
  onStartStory,
  toggleSteps,
}: MobileToolbarProps) {
  return (
    <div className="w-full md:hidden pointer-events-auto">
      {page !== 'start' && (
        <div className="flex flex-col items-center justify-between gap-2 py-1">
          {/* Left: Back/Restart Button */}
          <div className='flex'>

          {currentPageIndex === 0 ? (
            <button
              aria-label="Restart story"
              className="flex items-center gap-1 px-2 py-1 hover:bg-slate-100 rounded text-xs text-gray-600"
              onClick={onBackToStart}
              title="Restart Story"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : (
            <button
              aria-label="Previous step"
              className="flex items-center gap-1 px-2 py-1 hover:bg-slate-100 rounded text-xs text-gray-600"
              onClick={onPrevStep}
              title="Previous Step"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}

          {/* Center: Step info */}
          <div className="flex-1 text-center">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">
              Schritt {currentPageIndex + 1} / {story.steps?.length || 0}
            </span>
          </div>

          {/* Right: Next Button */}
          <button
            aria-label="Next step"
            className="flex items-center gap-1 px-2 py-1 hover:bg-slate-100 rounded text-xs text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={!story.steps || currentPageIndex >= story.steps.length - 1}
            onClick={onNextStep}
            title="Next Step"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
          </div>
            <hr
            style={
              {
                borderTop: '2px solid #D9D9D9',
                borderRadius: '5px',
                width:'100%',
                margin: '5px',
              }
            }
          />
        </div>
        
      )}
      
      {page === 'start' && (
        <div className="flex items-center justify-center gap-2 py-1">
          <Button
            aria-label="Start story"
            className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-100 rounded text-sm font-medium"
            onClick={onStartStory}
            title="Start Story"
          >
            <div className='flex gap-2 flex-row'>
            <PlayIcon className="h-4 w-4" />
            <span>Start</span>
            </div>

          </Button>
          <Button
            aria-label="Show steps"
            className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-100 rounded text-sm"
            onClick={toggleSteps}
            title="Steps"
          >
                        <div className='flex gap-2 flex-row'>

            <ListChecksIcon className="h-4 w-4" />
            <span>Schritte</span>
            </div>
          </Button>
        </div>
      )}
    </div>
  )
}

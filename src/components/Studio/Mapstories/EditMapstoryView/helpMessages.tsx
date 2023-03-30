import { StoryStep } from '@prisma/client'
import { useBoundStore } from '@/src/lib/store/store'
import { XMarkIcon } from '@heroicons/react/24/outline'

type HelpMessagesProps = {
  currentStep: StoryStep
  firstStepId: string | undefined
}

export default function HelpMessages({
  currentStep,
  firstStepId,
}: HelpMessagesProps) {
  const titleSlide = useBoundStore(state => state.titleslide)
  const setTitleSlide = useBoundStore(state => state.setTitleSlide)
  const noMarkerOnSlide = useBoundStore(state => state.noMarkerOnSlide)
  const setNoMarkerOnSlide = useBoundStore(state => state.setNoMarkerOnSlide)
  const dragMarker = useBoundStore(state => state.dragMarker)
  const setDragMarker = useBoundStore(state => state.setDragMarker)

  let message, onClick

  if (titleSlide && currentStep.id === firstStepId) {
    message = 'Dies ist deine Titelfolie.'
    onClick = () => setTitleSlide(false)
  } else if (noMarkerOnSlide && !currentStep?.feature) {
    message = 'Klicke auf die Karte um deinen Marker hinzuzufügen'
    onClick = () => setNoMarkerOnSlide(false)
  } else if (
    dragMarker &&
    currentStep?.feature &&
    currentStep.id !== firstStepId
  ) {
    message = 'Verschiebe den roten Marker um dessen Position zu ändern'
    onClick = () => setDragMarker(false)
  } else {
    return null
  }

  return (
    <span className="flex">
      {message}
      <XMarkIcon
        className="ml-2 h-4 w-5 hover:cursor-pointer"
        onClick={onClick}
      />
    </span>
  )
}

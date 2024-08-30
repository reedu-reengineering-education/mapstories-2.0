'use client'
import { Button } from '../../Elements/Button'
import { useState } from 'react'
import { Modal } from '../../Modal'
import { CSSTransition } from 'react-transition-group'
import useStory from '@/src/lib/api/story/useStory'
import ShowStepWithContents from '@/src/components/Viewer/CommunityStep/ShowStepWithContents'
import SelectContentType from '@/src/components/Viewer/CommunityStep/SelectContentType'
import { TextContentEdit } from '@/src/components/Viewer/CommunityStep/ContentEdits/TextContentEdit'
import { StoryStepSuggestion } from '@prisma/client'
import { toast } from '@/src/lib/toast'

import InitialView from './ModalViews/InitialView'
import DateSelectionView from './ModalViews/DateSelectionView'
import LocationSelectionView from './ModalViews/LocationSelectionView'
import ConfirmationView from './ModalViews/ConfirmationView'

// Props type definition
type Props = {
  story: any
  slug: string
  size?: 'xs' | 's' | 'm'
}

// Main component
export default function AddCommunityStep({ story, slug, size }: Props) {
  const { createStoryStepSuggestion } = useStory(story.id)
  const [isOpen, setIsOpen] = useState(false)
  const [stepSuggestion, setStepSuggestion] = useState<StoryStepSuggestion>()
  const [contentType, setContentType] = useState<string>('')
  const [date, setDate] = useState<Date>(new Date())

  const handleAddCommunityStep = async () => {
    setContentType(story.mode === 'TIMELINE' ? 'addDate' : 'addSlide')

    try {
      const position = parseInt(slug) + 1
      const tempStepSuggestion: StoryStepSuggestion = {
        storyId: story.id,
        position: position,
        content: [
          {
            type: 'TITLE',
            content: 'Deine Überschrift',
            position: 0,
            suggestionId: null,
          },
        ],
        timestamp: story.mode === 'TIMELINE' ? date : undefined,
      }
      setStepSuggestion(tempStepSuggestion)
    } catch (e) {
      console.log(e)
    }
  }

  const handleConfirmStep = async () => {
    try {
      await createStoryStepSuggestion(stepSuggestion)
      setContentType('')
      toast({ message: 'Community Step hinzugefügt', type: 'success' })
      setIsOpen(false)
    } catch (e) {
      console.log(e)
    }
  }

  const handleAddLocation = (feature: any) => {
    setStepSuggestion(prev => ({ ...prev, feature }))
  }

  return (
    <Modal
      onClose={() => setContentType('')}
      onOpenChange={setIsOpen}
      open={isOpen}
      title="Community Step"
      trigger={<Button variant={'inverse'}>Step hinzufügen</Button>}
    >
      <Modal.Content>
        <ContentSwitcher
          contentType={contentType}
          date={date}
          handleAddCommunityStep={handleAddCommunityStep}
          handleAddLocation={handleAddLocation}
          handleConfirmStep={handleConfirmStep}
          setContentType={setContentType}
          setDate={setDate}
          setStepSuggestion={setStepSuggestion}
          stepSuggestion={stepSuggestion}
          storyId={story.id}
        />
      </Modal.Content>
    </Modal>
  )
}

// ContentSwitcher component to handle transitions between different content types
function ContentSwitcher({
  contentType,
  handleAddCommunityStep,
  handleConfirmStep,
  setContentType,
  stepSuggestion,
  setStepSuggestion,
  storyId,
  date,
  setDate,
  handleAddLocation,
}: any) {
  return (
    <>
      <CSSTransition
        appear
        classNames="slide-transition"
        in={contentType === ''}
        timeout={400}
        unmountOnExit
      >
        <InitialView
          onAdd={handleAddCommunityStep}
          onCancel={() => setContentType('')}
        />
      </CSSTransition>

      <CSSTransition
        appear
        classNames="slide-transition"
        in={contentType === 'addDate'}
        timeout={400}
        unmountOnExit
      >
        <DateSelectionView
          date={date}
          onBack={() => setContentType('')}
          onNext={() => setContentType('addSlide')}
          setDate={setDate}
        />
      </CSSTransition>

      <CSSTransition
        appear
        classNames="slide-transition"
        in={contentType === 'addSlide'}
        timeout={400}
        unmountOnExit
      >
        <ShowStepWithContents
          setContentType={setContentType}
          setIsOpen={() => {}}
          setStepSuggestion={setStepSuggestion}
          stepId={stepSuggestion?.id}
          stepSuggestion={stepSuggestion}
          storyId={storyId}
        />
      </CSSTransition>

      <CSSTransition
        appear
        classNames="slide-transition"
        in={contentType === 'addContent'}
        timeout={400}
        unmountOnExit
      >
        <SelectContentType setContentType={setContentType} />
      </CSSTransition>

      <CSSTransition
        appear
        classNames="slide-transition"
        in={contentType === 'text'}
        timeout={400}
        unmountOnExit
      >
        <TextContentEdit
          setContentType={setContentType}
          setStepSuggestion={setStepSuggestion}
          stepSuggestion={stepSuggestion}
        />
      </CSSTransition>

      <CSSTransition
        appear
        classNames="slide-transition"
        in={contentType === 'addLocation'}
        timeout={400}
        unmountOnExit
      >
        <LocationSelectionView
          handleAddLocation={handleAddLocation}
          onBack={() => setContentType('addSlide')}
          onNext={() => setContentType('confirmStep')}
          stepSuggestion={stepSuggestion}
        />
      </CSSTransition>

      <CSSTransition
        appear
        classNames="slide-transition"
        in={contentType === 'confirmStep'}
        timeout={400}
        unmountOnExit
      >
        <ConfirmationView
          onBack={() => setContentType('addLocation')}
          onConfirm={handleConfirmStep}
          stepSuggestion={stepSuggestion}
        />
      </CSSTransition>
    </>
  )
}

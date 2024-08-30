import { Button } from '../../Elements/Button'
import { useEffect, useState } from 'react'
import { Modal } from '../../Modal'
import { CSSTransition } from 'react-transition-group'
import useStory from '@/src/lib/api/story/useStory'
import ShowStepWithContents from '@/src/components/Viewer/CommunityStep/ShowStepWithContents'
import SelectContentType from '@/src/components/Viewer/CommunityStep/SelectContentType'
import { TextContentEdit } from '@/src/components/Viewer/CommunityStep/ContentEdits/TextContentEdit'
import { StoryStepSuggestion } from '@prisma/client'
import { DatePickerWrapper } from '../../Timeline/DatePicker/DatePickerWrapper'
import MiniMap from './MiniMap/MiniMap'
import { toast } from '@/src/lib/toast'

type Props = {
  story: any
  slug: string
  size?: 'xs' | 's' | 'm'
}
export default function AddCommunityStep({ story, slug, size }: Props) {
  const { createStoryStepSuggestion } = useStory(story.id)
  const [isOpen, setIsOpen] = useState(false)
  const [stepSuggestion, setStepSuggestion] = useState<StoryStepSuggestion>()
  const [contentType, setContentType] = useState<string>('')
  const [date, setDate] = useState<Date>(new Date())

  useEffect(() => {
    console.log(contentType)
  }, [contentType])

  const handleAddCommunityStep = async () => {
    if (story.mode === 'TIMELINE') {
      setContentType('addDate')
    } else {
      setContentType('addSlide')
    }
    try {
      const tempStepSuggestion: StoryStepSuggestion = {
        storyId: story.id,
        position: story.steps.length,
        content: [
          {
            type: 'TITLE',
            content: 'Deine Überschrift',
            position: 0,
            suggestionId: null,
          },
        ],
      }
      story.mode === 'TIMELINE' ? (tempStepSuggestion.timestamp = date) : null
      // @ts-ignore
      setStepSuggestion(tempStepSuggestion)
    } catch (e) {
      console.log(e)
    }
  }

  const handleConfirmStep = async () => {
    try {
      console.log(stepSuggestion)
      const newStepSuggestion = await createStoryStepSuggestion(stepSuggestion)
      console.log(newStepSuggestion)
      setContentType('')
      toast({
        message: 'Community Step hinzugefügt',
        type: 'success',
      })
      setIsOpen(false)
    } catch (e) {
      console.log(e)
    }
  }

  const handleAddLocation = (feature: any) => {
    console.log(stepSuggestion)
    const newStepSuggestion = stepSuggestion
    newStepSuggestion.feature = feature
    setStepSuggestion(newStepSuggestion)
  }

  return (
    <>
      <Modal
        onClose={() => setContentType('')}
        onOpenChange={setIsOpen}
        open={isOpen}
        title="Community Step"
        trigger={<Button variant={'inverse'}>Step hinzufügen</Button>}
      >
        <Modal.Content>
          <div>
            <CSSTransition
              appear
              classNames="slide-transition"
              in={contentType === ''}
              timeout={400}
              unmountOnExit
            >
              <div className="flex flex-col gap-4">
                Du kannst dieser Story einen Community Step hinzufügen. Dieser
                muss von den Autoren genehmigt werden und wird dann in die Story
                eingefügt und angezeigt
                <div className="flex flex-row justify-end gap-4">
                  <Button onClick={() => setIsOpen(false)} variant={'inverse'}>
                    Abbrechen
                  </Button>
                  <Button onClick={() => handleAddCommunityStep()}>
                    Hinzufügen
                  </Button>
                </div>
              </div>
            </CSSTransition>
            <CSSTransition
              appear
              classNames="slide-transition"
              in={contentType === 'addDate'}
              timeout={400}
              unmountOnExit
            >
              <div className="flex flex-col justify-center gap-4">
                <DatePickerWrapper date={date} setDate={setDate} />
                <div className="flex justify-between">
                  <Button
                    onClick={() => setContentType('')}
                    variant={'inverse'}
                  >
                    Zurück
                  </Button>
                  <Button onClick={() => setContentType('addSlide')}>
                    Weiter
                  </Button>
                </div>
              </div>
            </CSSTransition>
            <CSSTransition
              appear
              classNames="slide-transition"
              in={contentType === 'addSlide'}
              timeout={400}
              unmountOnExit
            >
              <div>
                {/* @ts-ignore */}
                <ShowStepWithContents
                  setContentType={setContentType}
                  setIsOpen={setIsOpen}
                  setStepSuggestion={setStepSuggestion}
                  stepId={stepSuggestion?.id}
                  stepSuggestion={stepSuggestion}
                  storyId={story.id}
                />
              </div>
            </CSSTransition>
            <CSSTransition
              appear
              classNames={'slide-transition'}
              in={contentType === 'addContent'}
              timeout={400}
              unmountOnExit
            >
              <SelectContentType setContentType={setContentType} />
            </CSSTransition>
            <CSSTransition
              appear
              classNames={'slide-transition'}
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
              classNames={'slide-transition'}
              in={contentType === 'media'}
              timeout={400}
              unmountOnExit
            >
              <div>Media</div>
            </CSSTransition>
            <CSSTransition
              appear
              classNames={'slide-transition'}
              in={contentType === 'embed'}
              timeout={400}
              unmountOnExit
            >
              <div>Embed</div>
            </CSSTransition>
            <CSSTransition
              appear
              classNames={'slide-transition'}
              in={contentType === 'addLocation'}
              timeout={400}
              unmountOnExit
            >
              <div className="flex flex-col justify-end gap-4">
                Setze einen Marker auf der Karte oder gebe die Addresse in der
                Suchleiste ein
                <div className="h-56 w-96">
                  <MiniMap handleAddLocation={handleAddLocation} />
                </div>
                <div className="flex flex-row justify-between gap-4">
                  <Button
                    onClick={() => setContentType('addSlide')}
                    variant={'inverse'}
                  >
                    Zurück
                  </Button>
                  <Button onClick={() => setContentType('confirmStep')}>
                    Weiter
                  </Button>
                </div>
              </div>
            </CSSTransition>
            <CSSTransition
              appear
              classNames={'slide-transition'}
              in={contentType === 'confirmStep'}
              timeout={400}
              unmountOnExit
            >
              <div>
                <div>Confirm Step</div>
                <div className="flex flex-row justify-end gap-4">
                  <Button
                    onClick={() => setContentType('addLocation')}
                    variant={'inverse'}
                  >
                    Zurück
                  </Button>
                  <Button onClick={() => handleConfirmStep()}>
                    Bestätigen
                  </Button>
                </div>
              </div>
            </CSSTransition>
          </div>
        </Modal.Content>
      </Modal>
    </>
  )
}

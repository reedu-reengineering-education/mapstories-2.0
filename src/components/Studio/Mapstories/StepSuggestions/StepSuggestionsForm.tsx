'use client'
import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import { Story, StoryStepSuggestion } from '@prisma/client'
import { useEffect } from 'react'
import StepSuggestionCard from './StepSuggestionCard'
import React from 'react'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/src/components/Elements/Carousel'
import useStory from '@/src/lib/api/story/useStory'
import { toast } from '@/src/lib/toast'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { CheckIcon } from 'lucide-react'
import { Button } from '@/src/components/Elements/Button'
type Props = {
  story: Story
}

export default function StepSuggestionsForm({ story }: Props) {
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'stepSuggestions')
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  const { deleteStepSuggestion, createStoryStep, mutate, reorderStorySteps } =
    useStory(story.id)
  const [content, setContent] = React.useState<StoryStepSuggestion[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  useEffect(() => {
    setContent(story.stepSuggestions)
  }, [])

  useEffect(() => {
    if (!api) {
      return
    }
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api, content])

  useEffect(() => {
    console.log(story)
  }, [story])

  const handleReject = async (stepSuggestion: StoryStepSuggestion) => {
    await deleteStepSuggestion(stepSuggestion.id)
    const newContent = content.filter(
      suggestion => suggestion.id !== stepSuggestion.id,
    )
    setContent(newContent)
    toast({
      message: 'Step suggestion rejected',
      type: 'success',
    })
  }

  const confirmStepSuggestion = async (stepSuggestion: StoryStepSuggestion) => {
    try {
      // create new step
      const newStep: any = await createStep(stepSuggestion)
      // reordering story
      await reorderStory(newStep, story)
      // deleting stepsuggestion
      await deleteStepSuggestion(stepSuggestion.id)
    } catch (error) {
      console.log(error)
      toast({
        message: 'Error accepting step suggestion',
        type: 'error',
      })
    }
  }

  const reorderStory = async (newStep: StoryStepSuggestion, story: Story) => {
    const newStory = await mutate()
    const newStoryWithSuggestion = addElementWithPosition(
      newStory?.steps || [],
      newStep,
    )

    const reorderedStory = await reorderStorySteps(newStoryWithSuggestion)
  }

  const createStep = async (stepSuggestion: StoryStepSuggestion) => {
    try {
      setIsLoading(true)
      const newStoryStep = await createStoryStep({
        content: stepSuggestion.content,
        feature: stepSuggestion.feature,
        tags: stepSuggestion.tags,
        position: stepSuggestion.position,
      })
      // reorder the story with the new step
      toast({
        message: 'Step suggestion accepted',
        type: 'success',
      })
      const newContent = content.filter(
        suggestion => suggestion.id !== stepSuggestion.id,
      )
      setContent(newContent)
      setIsLoading(false)
      return newStoryStep
    } catch (error) {
      console.log(error)
      toast({
        message: 'Error accepting step suggestion',
        type: 'error',
      })
    }
  }

  return (
    <div className="flex flex-col justify-center">
      {content.length === 0 ? (
        // screen to show no suggestion have been found

        <div className="text-muted-foreground text-center">
          {t('noSuggestions')}
        </div>
      ) : (
        <>
          <Carousel
            className="w-full max-w-xs self-center"
            opts={{ loop: true }}
            setApi={setApi}
          >
            <CarouselContent>
              {content.map((stepSuggestion, index) => (
                <CarouselItem className="content-center" key={index}>
                  <div className="flex flex-col gap-4">
                    <StepSuggestionCard stepSuggestion={stepSuggestion} />
                    <div className="flex items-center justify-between">
                      <Button
                        onClick={() => handleReject(stepSuggestion)}
                        startIcon={<XMarkIcon className="w-5" />}
                        variant={'danger'}
                      >
                        {t('reject')}
                      </Button>
                      <Button
                        disabled={isLoading}
                        onClick={() => confirmStepSuggestion(stepSuggestion)}
                        startIcon={
                          isLoading ? (
                            <svg
                              className="... mr-3 h-5 w-5 animate-spin"
                              viewBox="0 0 24 24"
                            ></svg>
                          ) : (
                            <CheckIcon className="w-5" />
                          )
                        }
                      >
                        {isLoading ? t('loading') : t('accept')}
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="text-muted-foreground py-2 text-center text-sm">
            {t('suggestion')} {current} {t('of')} {count}
          </div>
        </>
      )}
    </div>
  )
}

const addElementWithPosition = (array: any[], newElement: any) => {
  for (let i = 0; i < array.length; i++) {
    const element = array[i]
    if (element.id === newElement.id) {
      continue
    }
    if (element.position >= newElement.position) {
      element.position = element.position + 1
    }
  }

  const reorderedArray = array.sort((a, b) => a.position - b.position)
  return reorderedArray
}

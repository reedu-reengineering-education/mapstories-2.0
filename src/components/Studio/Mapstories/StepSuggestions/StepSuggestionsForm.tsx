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
    CarouselPrevious
  } from '@/src/components/Elements/Carousel'
import useStory from '@/src/lib/api/story/useStory'
import { toast } from '@/src/lib/toast'
type Props = {
    story: Story
}



export default function StepSuggestionsForm({
    story
} : Props) {
    
    const lng = useBoundStore(state => state.language)
    const { t } = useTranslation(lng, 'stepSuggestions')
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(0)
    const { deleteStepSuggestion, createStoryStep } = useStory(story.id)
    const [content, setContent] = React.useState<StoryStepSuggestion[]>([])
    const [isLoading, setIsLoading] = React.useState(false)


  useEffect(() => {
    setContent(story.stepSuggestions)}
  ,[])

    useEffect(() => {
        if (!api) {
          return
        }
        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)
     
        api.on('select', () => {
          setCurrent(api.selectedScrollSnap() + 1)
        })
      }, [api , content])

      const handleReject = async (stepSuggestion: StoryStepSuggestion) => {
        await deleteStepSuggestion(stepSuggestion.id)
        const newContent = content.filter((suggestion) => suggestion.id !== stepSuggestion.id)
        setContent(newContent)
        toast({
            message: 'Step suggestion rejected',
            type: 'success',
          })

      }

      const handleAccept = async (stepSuggestion: StoryStepSuggestion) => {
        try {
          setIsLoading(true);
          const newStoryStep = await createStoryStep({content: stepSuggestion.content})
          await deleteStepSuggestion(stepSuggestion.id)
          toast({
            message: 'Step suggestion accepted',
            type: 'success',
          })
          const newContent = content.filter((suggestion) => suggestion.id !== stepSuggestion.id)
          setContent(newContent)
          setIsLoading(false);
        } catch (error) {
          console.log(error)
          toast({
            message: 'Error accepting step suggestion',
            type: 'error',
          })
        }
      }

      return (
        <div className='flex flex-col justify-center'>
          {content.length === 0 ? (
            // screen to show no suggestion have been found 

            <div className='text-center text-muted-foreground'>
              {t('noSuggestions')} 
            </div>
          ) : (
            <>
              <Carousel className='w-full max-w-xs self-center' opts={{loop:true}} setApi={setApi}>
                <CarouselContent>
                  {content.map((stepSuggestion, index) => (
                    <CarouselItem className='content-center' key={index}>
                      <StepSuggestionCard handleAccept = {handleAccept} handleReject={handleReject} loading={isLoading} stepSuggestion={stepSuggestion} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
              <div className="py-2 text-center text-sm text-muted-foreground">
                {t('suggestion')} {current} {t('of')} {count}
              </div>
            </>
          )}
        </div>
      );
      
}
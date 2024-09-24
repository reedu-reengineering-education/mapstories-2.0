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
import { CheckIcon } from 'lucide-react'
import { Button } from '@/src/components/Elements/Button'
import { Modal } from '@/src/components/Modal'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Marker, Map as ReactMap } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/src/components/Elements/Breadcrumbs'
type Props = {
  story: Story
}

export default function StepSuggestionsForm({ story }: Props) {
  const lng = useBoundStore(state => state.language)
  //  @ts-ignore
  const { t } = useTranslation(lng, 'stepSuggestions')
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  const { deleteStepSuggestion, createStoryStep, mutate, reorderStorySteps } =
    useStory(story.id)
  const [content, setContent] = React.useState<StoryStepSuggestion[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [rejectModalOpen, setRejectModalOpen] = React.useState(false)
  const [currentStepSuggestion, setCurrentStepSuggestion] =
    React.useState<StoryStepSuggestion>(story.stepSuggestions[0] || null)

  const mapRef = React.useRef(null)
  useEffect(() => {
    setContent(
      (story as unknown as { stepSuggestions: StoryStepSuggestion[] })
        .stepSuggestions,
    )
  }, [])

  useEffect(() => {
    setCurrentStepSuggestion(content[current - 1])
  }, [current])

  useEffect(() => {
    mapRef.current?.flyTo({
      center: [
        currentStepSuggestion.feature?.geometry?.coordinates[0] ?? 7.5,
        currentStepSuggestion.feature?.geometry?.coordinates[1] ?? 51.5,
      ],
    })
  }, [currentStepSuggestion])

  useEffect(() => {
    if (!api) {
      return
    }
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    // set currentStepSuggestion according to current
    setCurrentStepSuggestion(content[current - 1])
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api, content])

  const handleReject = async (stepSuggestion: StoryStepSuggestion) => {
    await deleteStepSuggestion(stepSuggestion.id)
    const newContent = content.filter(
      suggestion => suggestion.id !== stepSuggestion.id,
    )
    setContent(newContent)
    setRejectModalOpen(false)
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
      if (story.mode !== 'TIMELINE') {
        await reorderStory(newStep, story)
      }
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
        // @ts-ignore
        content: stepSuggestion.content,
        feature: stepSuggestion.feature,
        tags: stepSuggestion.tags,
        position: stepSuggestion.position,
        timestamp: stepSuggestion.timestamp,
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
          {/* @ts-ignore */}
          {t('noSuggestions')}
        </div>
      ) : (
        <div>
          <div className="px-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/storylab">StoryLab</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/storylab/${story.slug}`}>
                    {story.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{t('stepSuggestions')}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex flex-row items-center justify-center gap-20">
            <div>
              <Carousel
                className="max-w-md self-center"
                opts={{ loop: true }}
                setApi={setApi}
              >
                <CarouselContent>
                  {content.map((stepSuggestion, index) => (
                    <CarouselItem className="content-center" key={index}>
                      <div className="ml-12 flex flex-col gap-4 p-1">
                        <StepSuggestionCard stepSuggestion={stepSuggestion} />
                        <div className="flex items-center justify-between">
                          <Button
                            onClick={() => setRejectModalOpen(true)}
                            startIcon={<XMarkIcon className="w-5" />}
                            variant={'danger'}
                          >
                            {/* @ts-ignore */}
                            {t('reject')}
                          </Button>
                          <Button
                            disabled={isLoading}
                            onClick={() =>
                              confirmStepSuggestion(stepSuggestion)
                            }
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
                            {/* @ts-ignore */}
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
                {current} / {count}
              </div>
            </div>
            <div className="h-72 w-1/3 rounded-full">
              {' '}
              <ReactMap
                initialViewState={{
                  longitude:
                    currentStepSuggestion?.feature?.geometry?.coordinates[0] ??
                    7.5,
                  latitude:
                    currentStepSuggestion?.feature?.geometry?.coordinates[1] ??
                    51.5,
                  zoom: 3,
                }}
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                ref={mapRef}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '0.5rem',
                }}
              >
                {currentStepSuggestion && (
                  <Marker
                    color="green"
                    latitude={
                      currentStepSuggestion?.feature?.geometry?.coordinates[1]
                    }
                    longitude={
                      currentStepSuggestion?.feature?.geometry?.coordinates[0]
                    }
                  ></Marker>
                )}
              </ReactMap>
            </div>

            <Modal
              onOpenChange={setRejectModalOpen}
              open={rejectModalOpen}
              // @ts-ignore
              title={t('reject')}
            >
              <Modal.Content>
                <div>
                  Möchtest du wirklich löschen? Diese Aktion kann nicht
                  rückgängig gemacht werden.
                </div>
                <div className="mt-4 flex flex-row justify-between">
                  <Button
                    onClick={() => setRejectModalOpen(false)}
                    variant="primary"
                  >
                    {/* @ts-ignore */}
                    {t('cancel')}
                  </Button>
                  <Button
                    onClick={() => handleReject(content[current - 1])}
                    variant="danger"
                  >
                    {/* @ts-ignore */}
                    {t('reject')}
                  </Button>
                </div>
              </Modal.Content>
            </Modal>
          </div>
        </div>
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

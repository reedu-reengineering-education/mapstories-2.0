import { APIError } from '@/types'
import { SlideContent, Story, StoryStep, StoryStepSuggestion } from '@prisma/client'
import { AxiosResponse } from 'axios'
import useSWR from 'swr'
import { createStory, ICreateStoryProps } from './createStory'
import { createStoryStep } from './createStoryStep'
import { deleteStory } from './deleteStory'
import { deleteStoryStep } from './deleteStoryStep'
import { reorderStorySteps } from './reorderSteps'
import { updateStory } from './updateStory'
import { createStepSuggestion } from './createStepSuggestion'
import { deleteStepSuggestion } from './deleteStepSuggestion'

const useStory = (storyId: string) => {
  const { data: story, mutate } = useSWR<
    Story & {
      steps?: (StoryStep & { content: SlideContent[] })[]
      firstStep?: StoryStep & { content: SlideContent[] }
      stepSuggestions?: StoryStepSuggestion[]
    }
  >(`/api/mapstory/${storyId}`)

  const mutation = async (request: Promise<AxiosResponse<Story, APIError>>) => {
    const { data } = await request
    return await mutate(data)
  }

  const APICreateStory = async (props: ICreateStoryProps) => {
    const createStoryRequest = createStory(props)
    return await mutation(createStoryRequest)
  }

  const APIUpdateStory = async (story: Partial<Story>) => {
    const updateStoryRequest = updateStory(storyId, story)
    return await mutation(updateStoryRequest)
  }

  const APIDeleteStory = async () => {
    const deleteStoryRequest = deleteStory(storyId)
    await mutation(deleteStoryRequest)
  }

  const APICreateStoryStep = async (props?: Partial<Omit<StoryStep, 'id'>>) => {
    const createStoryStepRequest = createStoryStep({ id: storyId, ...props })
    const newStep = (await createStoryStepRequest).data

    if (story) {
      await mutate({
        ...story,
        steps: [...(story.steps || []), { ...newStep, content: [] }],
      })
    }
    return newStep
  }

  const APIDeleteStoryStep = async (stepId: string) => {
    const deleteStoryStepRequest = deleteStoryStep(storyId, stepId)
    const deletedStep = (await deleteStoryStepRequest).data

    if (story) {
      await mutate({
        ...story,
        steps: [
          ...(story.steps?.filter(({ id }) => id !== deletedStep.id) || []),
        ],
      })
    }
    return deletedStep
  }

  const APIReorderStorySteps = async (update: StoryStep[]) => {
    const reorderStoryStepsRequest = reorderStorySteps(storyId, update)
    return await mutation(reorderStoryStepsRequest)
  }

  const APIAddStepSuggestion = async (props?: Partial<Omit<StoryStepSuggestion, 'id'>>) => {
    const createStepSuggestionRequest = createStepSuggestion({ id: storyId, ...props })
    const newStepSuggestion = (await createStepSuggestionRequest).data

    if (story) {
      await mutate({
        ...story,
        stepSuggestions: [...(story.stepSuggestions || []), newStepSuggestion],
      })
    }
    return newStepSuggestion
  }

  const APIDeleteStepSuggestion = async (stepSuggestionId: string) => {
    const deleteStoryStepSuggestionRequest = deleteStepSuggestion(storyId, stepSuggestionId)
    const deletedSuggestionStep = (await deleteStoryStepSuggestionRequest).data

    if (story) {
      await mutate ({
        ...story, 
        stepSuggestions: [
          ...(story.stepSuggestions?.filter(({ id }) => id !== deletedSuggestionStep.id) || [])
        ]
      })
    }
    return deletedSuggestionStep;
  }

  return {
    story,
    mutate,
    createStory: APICreateStory,
    updateStory: APIUpdateStory,
    deleteStory: APIDeleteStory,
    reorderStorySteps: APIReorderStorySteps,
    createStoryStep: APICreateStoryStep,
    deleteStoryStep: APIDeleteStoryStep,
    addStepSuggestion: APIAddStepSuggestion,
    deleteStepSuggestion: APIDeleteStepSuggestion
  }
}

export default useStory

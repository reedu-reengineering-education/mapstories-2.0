import { APIError } from '@/types'
import { SlideContent, Story, StoryStep } from '@prisma/client'
import { AxiosResponse } from 'axios'
import useSWR from 'swr'
import { createStory, ICreateStoryProps } from './createStory'
import { createStoryStep } from './createStoryStep'
import { deleteStory } from './deleteStory'
import { deleteStoryStep } from './deleteStoryStep'
import { reorderStorySteps } from './reorderSteps'
import { updateStory } from './updateStory'

const useStory = (storyId: string) => {
  const { data: story, mutate } = useSWR<
    Story & {
      steps?: (StoryStep & { content: SlideContent[] })[]
      firstStep?: StoryStep & { content: SlideContent[] }
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

  const APICreateStoryStep = async () => {
    const createStoryStepRequest = createStoryStep({ id: storyId })
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

  return {
    story,
    mutate,
    createStory: APICreateStory,
    updateStory: APIUpdateStory,
    deleteStory: APIDeleteStory,
    reorderStorySteps: APIReorderStorySteps,
    createStoryStep: APICreateStoryStep,
    deleteStoryStep: APIDeleteStoryStep,
  }
}

export default useStory

import { APIError } from '@/types'
import { Story, StoryStep } from '@prisma/client'
import { AxiosResponse } from 'axios'
import useSWR from 'swr'
import { createStory, ICreateStoryProps } from './createStory'
import { createStoryStep } from './createStoryStep'
import { deleteStory } from './deleteStory'
import { deleteStoryStep } from './deleteStoryStep'
import { reorderStorySteps } from './reorderSteps'

const useStory = (storyId: string) => {
  const { data: story, mutate } = useSWR<
    Story & {
      steps?: StoryStep[]
    }
  >(`/api/mapstory/${storyId}`)

  const mutation = async (request: Promise<AxiosResponse<Story, APIError>>) => {
    const { data: story } = await request
    mutate(story, {
      populateCache: false,
      revalidate: true,
    })
    return story
  }

  const APICreateStory = async (props: ICreateStoryProps) => {
    const createStoryRequest = createStory(props)
    await mutation(createStoryRequest)
    return await (
      await createStoryRequest
    ).data
  }

  //   const APIUpdateGame = async (game: Partial<Game>) => {
  //     const updateGameRequest = updateGame(gameId, game)
  //     updateToast(updateGameRequest)
  //     await mutation(updateGameRequest)
  //   }

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
        steps: [...(story.steps || []), newStep],
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
    // updateGame: APIUpdateGame,
    deleteStory: APIDeleteStory,
    reorderStorySteps: APIReorderStorySteps,
    createStoryStep: APICreateStoryStep,
    deleteStoryStep: APIDeleteStoryStep,
  }
}

export default useStory

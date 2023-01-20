import { APIError } from '@/types'
import { Story, StoryStep } from '@prisma/client'
import { AxiosResponse } from 'axios'
import useSWR from 'swr'
import { createStory, ICreateStoryProps } from './createStory'
import { deleteStory } from './deleteStory'
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

  const APIReorderStorySteps = async (update: StoryStep[]) => {
    const reorderStoryStepsRequest = reorderStorySteps(storyId, update)
    await mutation(reorderStoryStepsRequest)
  }

  return {
    story,
    mutate,
    createStory: APICreateStory,
    // updateGame: APIUpdateGame,
    deleteStory: APIDeleteStory,
    reorderStorySteps: APIReorderStorySteps,
  }
}

export default useStory

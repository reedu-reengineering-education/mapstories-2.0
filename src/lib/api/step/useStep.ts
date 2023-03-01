import { APIError } from '@/types'
import { StoryStep } from '@prisma/client'
import { AxiosResponse } from 'axios'
import useSWR, { mutate } from 'swr'
import { updateStoryStep } from './updateStep'

const useStep = (storyId: string, stepId: string) => {
  const { data: step, mutate: stepMutate } = useSWR<StoryStep>(
    `/api/mapstory/${storyId}/step/${stepId}`,
  )

  const mutation = async (
    request: Promise<AxiosResponse<StoryStep, APIError>>,
  ) => {
    const { data: step } = await request
    stepMutate(step)
    // also mutate the story
    mutate(`/api/mapstory/${storyId}`)
    return step
  }

  const APIUpdateStep = async (step: Partial<StoryStep>) => {
    const updateStoryStepRequest = updateStoryStep(storyId, stepId, step)
    return await mutation(updateStoryStepRequest)
  }

  return {
    step,
    mutate: stepMutate,
    updateStep: APIUpdateStep,
  }
}

export default useStep

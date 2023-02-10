import axios from '@/src/lib/axios'
import { APIError } from '@/types'
import { StoryStep } from '@prisma/client'
import { AxiosResponse } from 'axios'

export const updateStoryStep = (
  storyId: string,
  stepId: string,
  props: Partial<StoryStep>,
) => {
  return axios.put<any, AxiosResponse<StoryStep, APIError>>(
    `/api/mapstory/${storyId}/${stepId}`,
    props,
  )
}

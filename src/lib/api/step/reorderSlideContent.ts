import axios from '@/src/lib/axios'
import { APIError } from '@/types'
import { SlideContent, StoryStep } from '@prisma/client'
import { AxiosResponse } from 'axios'

export const reorderSlideContent = (
  storyStepId: string,
  update: SlideContent[],
) => {
  return axios.put<SlideContent[], AxiosResponse<StoryStep, APIError>>(
    `/api/mapstory/step/${storyStepId}/content/`,
    update,
  )
}

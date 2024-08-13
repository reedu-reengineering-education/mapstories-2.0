import axios from '@/src/lib/axios'
import { APIError } from '@/types'
import { SlideContent } from '@prisma/client'
import { AxiosResponse } from 'axios'
import { StepWithContent } from './useStepSuggestion'

export const reorderSlideContent = (
  storyId: string,
  storyStepId: string,
  update: SlideContent[],
) => {
  return axios.put<SlideContent[], AxiosResponse<StepWithContent, APIError>>(
    `/api/mapstory/${storyId}/step/${storyStepId}/content/reorder`,
    update,
  )
}

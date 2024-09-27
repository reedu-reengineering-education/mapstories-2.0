import axios from '@/src/lib/axios'
import { APIError } from '@/types'
import { StoryStep } from '@prisma/client'
import { AxiosResponse } from 'axios'
import { StepWithContent } from './useStepSuggestion'

export const updateStoryStepSuggestion = (
  storyId: string,
  stepId: string,
  props: Partial<StoryStep>,
) => {
  return axios.put<typeof props, AxiosResponse<StepWithContent, APIError>>(
    `/api/mapstory/${storyId}/stepSuggestion/${stepId}`,
    props,
  )
}

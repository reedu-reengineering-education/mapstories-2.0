import axios from '@/src/lib/axios'
import { APIError } from '@/types'
import { Story, StoryStep } from '@prisma/client'
import { AxiosResponse } from 'axios'

export const reorderStorySteps = (storyId: string, update: StoryStep[]) => {
  return axios.put<StoryStep[], AxiosResponse<Story, APIError>>(
    `/api/mapstory/${storyId}/reorder`,
    update,
  )
}

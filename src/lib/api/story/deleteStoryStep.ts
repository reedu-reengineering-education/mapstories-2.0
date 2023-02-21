import axios from '@/src/lib/axios'
import { StoryStep } from '@prisma/client'

export const deleteStoryStep = (storyId: string, stepId: string) => {
  return axios.delete<StoryStep>(`/api/mapstory/${storyId}/step/${stepId}`)
}

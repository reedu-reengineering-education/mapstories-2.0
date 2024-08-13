import axios from '@/src/lib/axios'
import { StoryStepSuggestion } from '@prisma/client'

export const deleteStepSuggestion = (storyId: string, stepSuggestionId: string) => {
  return axios.delete<StoryStepSuggestion>(`/api/mapstory/${storyId}/stepSuggestion/${stepSuggestionId}`)
}

import axios from '@/src/lib/axios'
import { APIError } from '@/types'
import { SlideContent } from '@prisma/client'
import { AxiosResponse } from 'axios'

export const updateContent = (
  storyId: string,
  stepSuggestionId: string,
  contentId: string,
  props: Partial<SlideContent>,
) => {
  return axios.put<typeof props, AxiosResponse<SlideContent, APIError>>(
    `/api/mapstory/${storyId}/stepSuggestion/${stepSuggestionId}/content/${contentId}`,
    props,
  )
}

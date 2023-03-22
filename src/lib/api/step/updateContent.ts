import axios from '@/src/lib/axios'
import { APIError } from '@/types'
import { SlideContent } from '@prisma/client'
import { AxiosResponse } from 'axios'

export const updateContent = (
  storyId: string,
  stepId: string,
  contentId: Pick<SlideContent, 'id'>,
  props: Partial<SlideContent>,
) => {
  return axios.put<typeof props, AxiosResponse<SlideContent, APIError>>(
    `/api/mapstory/${storyId}/step/${stepId}/content/${contentId}`,
    props,
  )
}

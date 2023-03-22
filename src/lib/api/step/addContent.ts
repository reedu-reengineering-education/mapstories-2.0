import axios from '@/src/lib/axios'
import { APIError } from '@/types'
import { SlideContent } from '@prisma/client'
import { AxiosResponse } from 'axios'

export const addContent = (
  storyId: string,
  stepId: string,
  props: Partial<SlideContent>,
) => {
  return axios.post<typeof props, AxiosResponse<SlideContent, APIError>>(
    `/api/mapstory/${storyId}/step/${stepId}/content`,
    props,
  )
}

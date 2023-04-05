import axios from '@/src/lib/axios'
import { APIError } from '@/types'
import { Image, SlideContent } from '@prisma/client'
import { AxiosResponse } from 'axios'

export const addMedia = (
  storyId: string,
  stepId: string,
  props: Partial<SlideContent>,
) => {
  
  return axios.post<typeof props, AxiosResponse<Image, APIError>>(
    `/api/mapstory/${storyId}/step/${stepId}/content/media`,
    props,
  )
}

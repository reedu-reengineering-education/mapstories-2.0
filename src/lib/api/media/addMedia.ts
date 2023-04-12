import axios from '@/src/lib/axios'
import { APIError } from '@/types'
import { Image } from '@prisma/client'
import { AxiosResponse } from 'axios'

export const addMedia = (
  storyId: string,
  stepId: string,
  content: Partial<Image>,
) => {
  return axios.post<AxiosResponse<Image, APIError>>(
    `/api/mediaupload/${content.name}`,
    content,
  )
}

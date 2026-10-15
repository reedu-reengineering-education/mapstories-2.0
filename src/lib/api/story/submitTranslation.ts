import axios from '@/src/lib/axios'
import { APIError } from '@/types'
import { Story } from '@prisma/client'
import { AxiosResponse } from 'axios'

export const submitTranslation = (storyId: string) => {
  return axios.post<never, AxiosResponse<Story, APIError>>(
    `/api/mapstory/${storyId}/submitTranslation`,
  )
}

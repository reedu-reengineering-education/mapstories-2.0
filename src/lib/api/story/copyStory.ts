import axios from '@/src/lib/axios'
import { APIError } from '@/types'
import { Story } from '@prisma/client'
import { AxiosResponse } from 'axios'

export const copyStory = (storyId: string, props: Partial<Story>) => {
  return axios.post<typeof props, AxiosResponse<Story, APIError>>(
    `/api/mapstory/${storyId}/duplicate`,
    props,
  )
}

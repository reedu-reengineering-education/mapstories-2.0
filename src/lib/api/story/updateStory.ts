import axios from '@/src/lib/axios'
import { APIError } from '@/types'
import { Story } from '@prisma/client'
import { AxiosResponse } from 'axios'

export const updateStory = (storyId: string, props: Partial<Story>) => {
  return axios.put<typeof props, AxiosResponse<Story, APIError>>(
    `/api/mapstory/${storyId}`,
    props,
  )
}

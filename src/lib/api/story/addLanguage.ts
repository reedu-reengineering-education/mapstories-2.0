import axios from '@/src/lib/axios'
import { APIError } from '@/types'
import { Story } from '@prisma/client'
import { AxiosResponse } from 'axios'

export const addLanguage = (storyId: string, language: string) => {
  return axios.post<{ language: string }, AxiosResponse<Story, APIError>>(
    `/api/mapstory/${storyId}/addLanguage`,
    { language },
  )
}

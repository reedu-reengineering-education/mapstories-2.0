import axios from '@/src/lib/axios'
import { APIError } from '@/types'
import { AxiosResponse } from 'axios'

export const deleteLanguage = (
  storyId: string,
  language: string,
  variantId: string,
) => {
  return axios.delete<{ message: string }, AxiosResponse<{ message: string }, APIError>>(
    `/api/mapstory/${storyId}/deleteLanguage`,
    {
      data: { language, variantId },
    },
  )
}

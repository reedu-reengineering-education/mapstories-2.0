import axios from '@/src/lib/axios'
import { APIError } from '@/types'
import { Story } from '@prisma/client'
import { AxiosResponse } from 'axios'

export type ReviewTranslationAction = 'approve' | 'reject'

// `translationId` is the id of the submitted translation draft
export const reviewTranslation = (
  translationId: string,
  action: ReviewTranslationAction,
) => {
  return axios.post<
    { action: ReviewTranslationAction },
    AxiosResponse<Story, APIError>
  >(`/api/mapstory/${translationId}/reviewTranslation`, { action })
}

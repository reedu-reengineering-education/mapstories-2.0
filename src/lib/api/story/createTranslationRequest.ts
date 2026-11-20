import axios from '@/src/lib/axios'
import { APIError } from '@/types'
import { AxiosResponse } from 'axios'

export type TranslationDraft = { slug: string; firstStepId: string | null }

export const createTranslationRequest = (storyId: string, language: string) => {
  return axios.post<
    { language: string },
    AxiosResponse<TranslationDraft, APIError>
  >(`/api/mapstory/${storyId}/translationRequest`, { language })
}

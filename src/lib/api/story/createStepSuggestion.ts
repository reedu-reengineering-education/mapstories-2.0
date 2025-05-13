import axios, { AxiosResponse } from 'axios'
import { APIError } from '@/types'
import { Story, StoryStepSuggestion } from '@prisma/client'

export interface ICreateStepSuggestionProps
  extends Pick<Story, 'id'>,
    Partial<Omit<StoryStepSuggestion, 'id'>> {}

export const createStepSuggestion = (
  props: ICreateStepSuggestionProps,
): Promise<AxiosResponse<StoryStepSuggestion, APIError>> => {
  return axios.post(`/api/mapstory/${props.id}/stepSuggestion`, props)
}

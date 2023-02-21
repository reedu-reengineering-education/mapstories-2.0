import axios from '@/src/lib/axios'
import { APIError } from '@/types'
import { Story, StoryStep } from '@prisma/client'
import { AxiosResponse } from 'axios'

export interface ICreateStoryStepProps extends Pick<Story, 'id'> {}

export const createStoryStep = (props: ICreateStoryStepProps) => {
  return axios.post<ICreateStoryStepProps, AxiosResponse<StoryStep, APIError>>(
    `/api/mapstory/${props.id}/step`,
    props,
  )
}

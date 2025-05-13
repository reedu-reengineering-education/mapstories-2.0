import axios from '@/src/lib/axios'
import { APIError } from '@/types'
import { Story } from '@prisma/client'
import { AxiosResponse } from 'axios'

export interface ICreateStoryProps extends Pick<Story, 'name' | 'mode'> {}

export const createStory = (props: ICreateStoryProps) => {
  return axios.post<ICreateStoryProps, AxiosResponse<Story, APIError>>(
    '/api/mapstory',
    props,
  )
}

import axios from '@/src/lib/axios'
import { APIError } from '@/types'
import { Story } from '@prisma/client'
import { AxiosResponse } from 'axios'
import slugify from 'slugify'

export interface ICreateStoryProps extends Pick<Story, 'name' | 'slug'> { }

export const createStory = (props: ICreateStoryProps) => {
  props.slug = slugify(props.name || '')
  return axios.post<ICreateStoryProps, AxiosResponse<Story, APIError>>(
    '/api/mapstory',
    props,
  )
}

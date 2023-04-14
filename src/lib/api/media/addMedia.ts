import axios from '@/src/lib/axios'
import { APIError } from '@/types'
import { Image } from '@prisma/client'
import { AxiosResponse } from 'axios'

export const addMedia = (
  storyId: string,
  stepId: string,
  props: Partial<Image>,
) => {
  return axios.post<typeof props, AxiosResponse<Image, APIError>>(
    `/api/mediaupload/${props.name}`,
    props,
  )
}

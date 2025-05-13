import axios from '@/src/lib/axios'
import { APIError } from '@/types'
import { Media } from '@prisma/client'
import { AxiosResponse } from 'axios'

export const addMedia = (props: Partial<Media>) => {
  return axios.post<typeof props, AxiosResponse<Media, APIError>>(
    `/api/mediaupload/${props.name}`,
    props,
  )
}

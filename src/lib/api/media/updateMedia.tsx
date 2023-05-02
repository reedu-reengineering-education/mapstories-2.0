import axios from '@/src/lib/axios'
import { APIError } from '@/types'
import { Media } from '@prisma/client'
import { AxiosResponse } from 'axios'

export const updateMedia = (mediaId: string, props: Partial<Media>) => {
  return axios.put<typeof props, AxiosResponse<Media, APIError>>(
    `/api/mediaupload/content/${mediaId}`,
    props,
  )
}

import axios from '@/src/lib/axios'
import { APIError } from '@/types'
import { Image } from '@prisma/client'
import { AxiosResponse } from 'axios'

export const updateMedia = (mediaId: string, props: Partial<Image>) => {
  return axios.put<typeof props, AxiosResponse<Image, APIError>>(
    `/api/mediaupload/content/${mediaId}`,
    props,
  )
}

import axios from '@/src/lib/axios'
import { APIError } from '@/types'
import { Image } from '@prisma/client'
import { AxiosResponse } from 'axios'

export const updateMedia = (mediaId: string, image: Partial<Image>) => {
  return axios.put<AxiosResponse<Image, APIError>>(
    `/api/mediaupload/content/${mediaId}`,
    image,
  )
}

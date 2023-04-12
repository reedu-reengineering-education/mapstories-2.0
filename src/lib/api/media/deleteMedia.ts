import axios from '@/src/lib/axios'
import { APIError } from '@/types'
import { Image } from '@prisma/client'
import { AxiosResponse } from 'axios'

export const deleteMedia = (fileName: string, mediaId: string) => {
  return axios.delete<AxiosResponse<Image, APIError>>(
    `/api/mediaupload/${fileName}`,
    { data: { mediaId } },
  )
}

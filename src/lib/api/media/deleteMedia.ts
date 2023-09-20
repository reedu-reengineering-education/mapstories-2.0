import axios from '@/src/lib/axios'
import { APIError } from '@/types'
import { Media } from '@prisma/client'
import { AxiosResponse } from 'axios'

export const deleteMedia = (fileName: string, mediaId: string) => {
  return axios.delete<AxiosResponse<Media, APIError>>(
    `/api/mediaupload/${fileName}/${mediaId}`,
  )
}

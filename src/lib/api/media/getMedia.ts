import axios from '@/src/lib/axios'
import { Image } from '@prisma/client'

export const getMedia = (mediaId: string) => {
  return axios.get<Image>(`/api/mediaupload/content/${mediaId}`)
}

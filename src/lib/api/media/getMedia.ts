import axios from '@/src/lib/axios'
import { Media } from '@prisma/client'

export const getMedia = (mediaId: string) => {
  return axios.get<Media>(`/api/mediaupload/content/${mediaId}`)
}

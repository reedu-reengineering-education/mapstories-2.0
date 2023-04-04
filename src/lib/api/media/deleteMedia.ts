import axios from '@/src/lib/axios'
import { Image } from '@prisma/client'

export const deleteMedia = (
  storyId: string,
  stepId: string,
  mediaId: Pick<Image, 'id'>,
) => {
  return axios.delete<Image>(
    `/api/mapstory/${storyId}/step/${stepId}/content/media/${mediaId}`,
  )
}

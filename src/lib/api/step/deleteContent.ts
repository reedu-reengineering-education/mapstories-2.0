import axios from '@/src/lib/axios'
import { SlideContent } from '@prisma/client'

export const deleteContent = (
  storyId: string,
  stepId: string,
  contentId: Pick<SlideContent, 'id'>,
) => {
  return axios.delete<SlideContent>(
    `/api/mapstory/${storyId}/step/${stepId}/content/${contentId}`,
  )
}

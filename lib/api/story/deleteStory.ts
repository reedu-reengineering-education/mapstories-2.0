import axios from '@/lib/axios'
import { Story } from '@prisma/client'

export interface ICreateStoryProps extends Pick<Story, 'name'> {}

export const deleteStory = (storyId: string) => {
  return axios.delete<Story>(`/api/mapstory/${storyId}`)
}

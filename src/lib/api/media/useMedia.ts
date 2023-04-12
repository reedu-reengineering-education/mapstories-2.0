import { Image, SlideContent, StoryStep } from '@prisma/client'
import useSWR, { mutate } from 'swr'
import { useBoundStore } from '../../store/store'
import { addMedia } from './addMedia'
import { getMedia } from './getMedia'
import { deleteMedia } from './deleteMedia'
export type StepWithContent = StoryStep & {
  content: SlideContent[]
}

export type Media = {
  content: Image
}

const useMedia = (stepId: string) => {
  const storyId = useBoundStore(store => store.storyID)
  const { data: step, mutate: stepMutate } = useSWR<StepWithContent>(
    `/api/mapstory/${storyId}/step/${stepId}`,
  )

  const mutation = async (image?: Image) => {
    stepMutate(step)
    // also mutate the story
    mutate(`/api/mapstory/${storyId}`)
    return image
  }

  const APIAddMedia = async (content: Partial<Image>) => {
    const addSlideContentRequest = addMedia(storyId, stepId, content)

    const newContent = (await addSlideContentRequest).data
    console.log(newContent)
    if (!step) {
      return
    }
    return newContent
  }

  const APIGetMedia = async (mediaId: string) => {
    const getImageRequest = getMedia(mediaId)
    const newContent = (await getImageRequest).data
    if (!step) {
      return
    }
    return newContent
  }

  const APIDeleteMedia = async (fileName: string, mediaId: string) => {
    const deleteImageRequest = deleteMedia(fileName, mediaId)
    const deletedContent = (await deleteImageRequest).data
    if (!step) {
      return
    }
    return mutation(deletedContent)
  }

  return {
    step,
    addMedia: APIAddMedia,
    getMedia: APIGetMedia,
    deleteMedia: APIDeleteMedia,
  }
}

export default useMedia

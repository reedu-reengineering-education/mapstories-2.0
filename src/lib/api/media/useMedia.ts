import { Image, SlideContent, StoryStep } from '@prisma/client'
import { useBoundStore } from '../../store/store'
import { addMedia } from './addMedia'
import { getMedia } from './getMedia'
import { deleteMedia } from './deleteMedia'
import { updateMedia } from './updateMedia'
export type StepWithContent = StoryStep & {
  content: SlideContent[]
}

export type Media = {
  content: Image
}

const useMedia = (stepId: string) => {
  const storyId = useBoundStore(store => store.storyID)

  const APIAddMedia = async (content: Partial<Image>) => {
    const addSlideContentRequest = addMedia(storyId, stepId, content)
    const newContent = (await addSlideContentRequest).data

    return newContent
  }

  const APIGetMedia = async (mediaId: string) => {
    const getImageRequest = getMedia(mediaId)
    const newContent = (await getImageRequest).data

    return newContent
  }

  const APIDeleteMedia = async (fileName: string, mediaId: string) => {
    const deleteImageRequest = deleteMedia(fileName, mediaId)
    const deletedContent = (await deleteImageRequest).data

    return deletedContent
  }

  const APIUpdateMedia = async (mediaId: string, image: Partial<Image>) => {
    const updateImageRequest = updateMedia(mediaId, image)
    return await updateImageRequest
  }
  return {
    addMedia: APIAddMedia,
    getMedia: APIGetMedia,
    deleteMedia: APIDeleteMedia,
    updateMedia: APIUpdateMedia,
  }
}

export default useMedia

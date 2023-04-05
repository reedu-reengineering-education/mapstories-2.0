import { Image, SlideContent, StoryStep } from '@prisma/client'
import useSWR, { mutate } from 'swr'
import { useBoundStore } from '../../store/store'
import { addMedia } from './addMedia'
import { getMedia } from './getMedia'
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
    const addSlideContentRequest = addMedia(storyId, stepId, content);
    const newContent = (await addSlideContentRequest).data;
    if (!step) {
      return;
    }
    return mutation(newContent);
  };


  const APIGetMedia = async ( imageId: string) => {
    const getImageRequest = getMedia(stepId,imageId );
    const newContent = (await getImageRequest).data;
    if (!step) {
      return;
    }
    return mutation(newContent);
  };

  return {
    step,
    addMedia: APIAddMedia,
    getMedia: APIGetMedia,
  }
}

export default useMedia

import { Image, SlideContent, StoryStep } from '@prisma/client'
import useSWR, { mutate } from 'swr'
import { useBoundStore } from '../../store/store'
import { addImage } from './addMedia'
export type StepWithContent = StoryStep & {
  content: SlideContent[]
}

const useMedia = (stepId: string) => {
  const storyId = useBoundStore(store => store.storyID)

  const { data: step, mutate: stepMutate } = useSWR<StepWithContent>(
    `/api/mapstory/${storyId}/step/${stepId}`,
  )

  const mutation = async (step?: StepWithContent) => {
    stepMutate(step)
    // also mutate the story
    mutate(`/api/mapstory/${storyId}`)
    return step
  }

  const APIAddImage = async (content: Partial<Image>) => {
    const addSlideContentRequest = addImage(storyId, stepId, content);

    const newContent = (await addSlideContentRequest).data;
    
    if (!step) {
      return;
    }
    return mutation({
      ...step,
      content: [...step.content, newContent],
    });
  };

  return {
    step,
    addImage: APIAddImage,
  }
}

export default useMedia

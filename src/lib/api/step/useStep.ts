import { APIError } from '@/types'
import { SlideContent, StoryStep } from '@prisma/client'
import { AxiosResponse } from 'axios'
import useSWR, { mutate } from 'swr'
import { reorderSlideContent } from './reorderSlideContent'
import { addContent } from './addContent'
import { deleteContent } from './deleteContent'
import { updateContent } from './updateContent'
import { updateStoryStep } from './updateStep'
import { useBoundStore } from '../../store/store'
import useMedia from '../media/useMedia'

export type StepWithContent = StoryStep & {
  content: SlideContent[]
}

const useStep = (stepId: string) => {
  const storyId = useBoundStore(store => store.storyID)
  const { deleteMedia } = useMedia()

  const { data: step, mutate: stepMutate } = useSWR<StepWithContent>(
    `/api/mapstory/${storyId}/step/${stepId}`,
  )

  const mutateRequest = async (
    request: Promise<AxiosResponse<StepWithContent, APIError>>,
  ) => {
    const { data: step } = await request
    mutation(step)
  }

  const mutation = async (step?: StepWithContent) => {
    stepMutate(step)
    // also mutate the story
    mutate(`/api/mapstory/${storyId}`)
    return step
  }

  const APIUpdateStep = async (step: Partial<StoryStep>) => {
    const updateStoryStepRequest = updateStoryStep(storyId, stepId, step)
    return await mutateRequest(updateStoryStepRequest)
  }

  const APIAddContent = async (content: Partial<SlideContent>) => {
    const addSlideContentRequest = addContent(storyId, stepId, content)
    const newContent = (await addSlideContentRequest).data
    if (!step) {
      return
    }
    return mutation({
      ...step,
      content: [...step.content, newContent],
    })
  }

  const APIUpdateContent = async (
    contentId: string,
    content: Partial<SlideContent>,
  ) => {
    const updateContentRequest = updateContent(
      storyId,
      stepId,
      contentId,
      content,
    )
    const updatedContent = (await updateContentRequest).data
    if (!step) {
      return
    }
    return mutation({
      ...step,
      content: [
        ...step.content.filter(s => s.id !== updatedContent.id),
        updatedContent,
      ],
    })
  }

  const APIDeleteContent = async (contentId: Pick<SlideContent, 'id'>) => {
    const deleteContentRequest = await deleteContent(storyId, stepId, contentId)
    const deletedContent = (await (
      await deleteContentRequest
    ).data) as SlideContent
    if (deletedContent.mediaId) {
      // delete the image from the s3 service also
      const deletedMedia = await deleteMedia(
        deletedContent.content,
        deletedContent.mediaId,
      )
    }

    if (!step) {
      return
    }
    return mutation({
      ...step,
      content: step.content.filter(c => c.id !== deletedContent.id),
    })
  }

  const APIReorderSlideContent = async (update: SlideContent[]) => {
    const reorderSlideContentRequest = reorderSlideContent(
      storyId,
      stepId,
      update,
    )
    return await mutateRequest(reorderSlideContentRequest)
  }

  return {
    step,
    mutate: mutation,
    reorderSlideContent: APIReorderSlideContent,
    updateStep: APIUpdateStep,
    addContent: APIAddContent,
    updateContent: APIUpdateContent,
    deleteContent: APIDeleteContent,
  }
}

export default useStep

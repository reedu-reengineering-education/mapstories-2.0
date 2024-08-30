import { APIError } from '@/types'
import { SlideContent, StoryStepSuggestion } from '@prisma/client'
import { AxiosResponse } from 'axios'
import useSWR, { mutate } from 'swr'
import { reorderSlideContent } from './reorderSlideContent'
import { addContent } from './addContent'
import { deleteContent } from './deleteContent'
import { updateContent } from './updateContent'
import { updateStoryStepSuggestion } from './updateStepSuggestion'
import { useBoundStore } from '../../store/store'
import useMedia from '../media/useMedia'

export type StepWithContent = StoryStepSuggestion & {
  content: SlideContent[]
}

const useStepSuggestion = (stepSuggestionId: string) => {
  const storyId = useBoundStore(store => store.storyID)

  const { deleteMedia } = useMedia(stepSuggestionId)

  const { data: stepSuggestion, mutate: stepMutate } = useSWR<StepWithContent>(
    `/api/mapstory/${storyId}/stepSuggestion/${stepSuggestionId}`,
  )

  const mutateRequest = async (
    request: Promise<AxiosResponse<StepWithContent, APIError>>,
  ) => {
    const { data: stepSuggestion } = await request
    mutation(stepSuggestion)
  }

  const mutation = async (step?: StepWithContent) => {
    stepMutate(step)
    // also mutate the story
    mutate(`/api/mapstory/${storyId}`)
    return step
  }

  const APIUpdateStepSuggestion = async (
    step: Partial<StoryStepSuggestion>,
  ) => {
    const updateStoryStepRequest = updateStoryStepSuggestion(
      storyId,
      stepSuggestionId,
      step,
    )
    return await mutateRequest(updateStoryStepRequest)
  }

  const APIAddContent = async (content: Partial<SlideContent>) => {
    const addSlideContentRequest = addContent(
      storyId,
      stepSuggestionId,
      content,
    )
    console.log('data from add content', [storyId, stepSuggestionId, content])
    const newContent = (await addSlideContentRequest).data
    if (!stepSuggestion) {
      return
    }
    return mutation({
      ...stepSuggestion,
      content: [...stepSuggestion.content, newContent],
    })
  }

  const APIUpdateContent = async (
    contentId: string,
    content: Partial<SlideContent>,
  ) => {
    const updateContentRequest = updateContent(
      storyId,
      stepSuggestionId,
      contentId,
      content,
    )
    const updatedContent = (await updateContentRequest).data
    if (!stepSuggestion) {
      return
    }
    return mutation({
      ...stepSuggestion,
      content: [
        ...stepSuggestion.content.filter(s => s.id !== updatedContent.id),
        updatedContent,
      ],
    })
  }

  const APIDeleteContent = async (contentId: Pick<SlideContent, 'id'>) => {
    const deleteContentRequest = await deleteContent(
      storyId,
      stepSuggestionId,
      contentId,
    )
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

    if (!stepSuggestion) {
      return
    }
    return mutation({
      ...stepSuggestion,
      content: stepSuggestion.content.filter(c => c.id !== deletedContent.id),
    })
  }

  const APIReorderSlideContent = async (update: SlideContent[]) => {
    const reorderSlideContentRequest = reorderSlideContent(
      storyId,
      stepSuggestionId,
      update,
    )
    return await mutateRequest(reorderSlideContentRequest)
  }

  return {
    stepSuggestion,
    mutate: mutation,
    reorderSlideContent: APIReorderSlideContent,
    updateStepSuggestion: APIUpdateStepSuggestion,
    addContent: APIAddContent,
    updateContent: APIUpdateContent,
    deleteContent: APIDeleteContent,
  }
}

export default useStepSuggestion

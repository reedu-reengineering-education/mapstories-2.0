import { APIError } from '@/types'
import { SlideContent, StoryStep } from '@prisma/client'
import { AxiosResponse } from 'axios'
import useSWR, { mutate } from 'swr'
import { useStoryStore } from '../../store/story'
import { addContent } from './addContent'
import { deleteContent } from './deleteContent'
import { updateContent } from './updateContent'
import { updateStoryStep } from './updateStep'

export type StepWithContent = StoryStep & {
  content: SlideContent[]
}

const useStep = (stepId: string) => {
  const storyId = useStoryStore(store => store.storyID)

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

  const APIUpdateContent = async (content: Partial<SlideContent>) => {
    const updateContentRequest = updateContent(storyId, stepId, content)
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
    const deleteContentRequest = deleteContent(storyId, stepId, contentId)
    const deletedContent = await (await deleteContentRequest).data
    if (!step) {
      return
    }
    return mutation({
      ...step,
      content: step.content.filter(c => c.id !== deletedContent.id),
    })
  }

  return {
    step,
    mutate: stepMutate,
    updateStep: APIUpdateStep,
    addContent: APIAddContent,
    updateContent: APIUpdateContent,
    deleteContent: APIDeleteContent,
  }
}

export default useStep

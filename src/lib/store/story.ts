import { StateCreator } from 'zustand'
import { UIState } from './ui'
import { TutorialState } from './tutorial'

export interface StoryState {
  storyID: string
  setStoryID: (storyID: string) => void
  selectedStepIndex: number | undefined
  updateSelectedStepIndex: (index: number) => void
  hoverMarkerId: string
  setHoverMarkerId: (hoverMarkerId: string) => void
  showSlidePreview: boolean
  setShowSlidePreview: (showSlidePreview: boolean) => void
}

export const useStoryStore: StateCreator<
  StoryState & UIState & TutorialState,
  [],
  [],
  StoryState
> = set => ({
  storyID: '', // TODO: undefined would be better
  setStoryID: (storyID: string) => set({ storyID }),
  selectedStepIndex: undefined,
  updateSelectedStepIndex: (index: number) => set({ selectedStepIndex: index }),
  hoverMarkerId: '',
  setHoverMarkerId: (hoverMarkerId: string) => set({ hoverMarkerId }),
  showSlidePreview: false,
  setShowSlidePreview: showSlidePreview => set({ showSlidePreview }),
})

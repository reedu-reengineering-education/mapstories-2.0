import { StateCreator } from 'zustand'
import { UIState } from './ui'
import { SlideContent, Story, StoryStep } from '@prisma/client'

export interface StoryState {
  storyID: string
  setStoryID: (storyID: string) => void
  selectedStepIndex: number | undefined
  updateSelectedStepIndex: (index: number) => void
  hoverMarkerId: string
  setHoverMarkerId: (hoverMarkerId: string) => void
  showSlidePreview: boolean
  setShowSlidePreview: (showSlidePreview: boolean) => void
  viewerStories: Story[],
  setViewerStories: (viewerStories:  (Story & {
    steps: (StoryStep & { content: SlideContent[] })[]
  })[]) => void
}

export const useStoryStore: StateCreator<
  StoryState & UIState,
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
  viewerStories: [],
  setViewerStories: (viewerStories: (Story & {
    steps: (StoryStep & { content: SlideContent[] })[]
  })[])  => set({viewerStories})
})

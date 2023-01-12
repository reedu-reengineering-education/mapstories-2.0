import { Story, StoryStep } from '@prisma/client'
import { create } from 'zustand'

interface StoryState {
  story?: Story & {
    steps?: StoryStep[]
  }
  updateStory: (_newStory: Story) => void
  addStoryStep: (_step: StoryStep) => void
}

export const useStoryStore = create<StoryState>()((set, get) => ({
  story: undefined,
  updateStory: (newStory: Story) => set({ story: newStory }),
  addStoryStep: (step: StoryStep) =>
    set({
      story: {
        ...get().story!,
        steps: [...(get().story?.steps || []), step],
      },
    }),
}))

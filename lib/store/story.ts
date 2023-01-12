import { Story } from '@prisma/client'
import { create } from 'zustand'

interface StoryState {
    story: Story | undefined,
    updateStory: (newStory: Story) => void
}

export const useStoryStore = create<StoryState>()((set) => ({
    story: undefined,
    updateStory: (newStory: Story) => set({ story: newStory }),
}))
import { create } from 'zustand'

interface StoryState {
  storyID: string
  setStoryID: (storyID: string) => void
  hoverMarkerId: string
  setHoverMarkerId: (hoverMarkerId: string) => void
}

export const useStoryStore = create<StoryState>()((set, get) => ({
  storyID: '', // TODO: undefined would be better
  setStoryID: (storyID: string) => set({ storyID }),
  hoverMarkerId: '',
  setHoverMarkerId: (hoverMarkerId: string) => set({ hoverMarkerId }),
}))

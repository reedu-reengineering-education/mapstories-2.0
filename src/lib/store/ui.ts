import { StateCreator } from 'zustand'
import { StoryState } from './story'
import { TutorialState } from './tutorial'

export interface UIState {
  language: string
  setLanguage: (lng: string) => void
}

export const useUIStore: StateCreator<
  StoryState & UIState & TutorialState,
  [],
  [],
  UIState
> = set => ({
  language: '',
  setLanguage: (lng: string) => set({ language: lng }),
})

// create<UIState>(set => ({
//   language: '',
//   setLanguage: (lng: string) => set({ language: lng }),
// }))

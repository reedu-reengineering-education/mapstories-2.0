import { StateCreator } from 'zustand'
import { StoryState } from './story'

export interface UIState {
  language: string
  setLanguage: (lng: string) => void
}

export const useUIStore: StateCreator<
  StoryState & UIState,
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

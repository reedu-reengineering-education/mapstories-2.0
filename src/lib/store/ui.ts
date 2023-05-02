import { StateCreator } from 'zustand'
import { StoryState } from './story'

export interface UIState {
  language: string
  setLanguage: (lng: string) => void
  slidesOpen: boolean
  setSlidesOpen: (open: boolean) => void
}

export const useUIStore: StateCreator<
  StoryState & UIState,
  [],
  [],
  UIState
> = set => ({
  language: '',
  setLanguage: (lng: string) => set({ language: lng }),
  slidesOpen: false,
  setSlidesOpen: (open: boolean) => set({ slidesOpen: open }),
})

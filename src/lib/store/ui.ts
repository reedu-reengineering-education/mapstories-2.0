import { StateCreator } from 'zustand'
import { CombinedState } from './CombinedState'

export interface UIState {
  language: string
  setLanguage: (lng: string) => void
}

export const useUIStore: StateCreator<
  CombinedState,
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

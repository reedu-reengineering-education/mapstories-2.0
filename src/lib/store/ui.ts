import { create } from 'zustand'

interface UIState {
  language: string
  setLanguage: (lng: string) => void
}

export const useUIStore = create<UIState>(set => ({
  language: '',
  setLanguage: (lng: string) => set({ language: lng }),
}))

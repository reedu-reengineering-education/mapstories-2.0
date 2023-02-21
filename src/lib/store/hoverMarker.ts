import { create } from 'zustand'

interface HoverMarkerStore {
  markerId: string
  setMarkerId: (markerId: string) => void
}

export const useHoverMarkerStore = create<HoverMarkerStore>(set => ({
  markerId: '',
  setMarkerId: (markerId: string) => set({ markerId }),
}))

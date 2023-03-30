import { StateCreator } from 'zustand'
import { UIState } from './ui'
import { StoryState } from './story'

export interface TutorialState {
  titleslide: boolean
  noMarkerOnSlide: boolean
  dragMarker: boolean
  setTitleSlide: (titleslide: boolean) => void
  setNoMarkerOnSlide: (noMarkerOnSlide: boolean) => void
  setDragMarker: (dragMarker: boolean) => void
}

export const useTutorialStore: StateCreator<
  StoryState & UIState & TutorialState,
  [],
  [],
  TutorialState
> = set => ({
  titleslide: true,
  setTitleSlide: (titleslide: boolean) => set({ titleslide }),
  noMarkerOnSlide: true,
  setNoMarkerOnSlide: (noMarkerOnSlide: boolean) => set({ noMarkerOnSlide }),
  dragMarker: true,
  setDragMarker: (dragMarker: boolean) => set({ dragMarker }),
})

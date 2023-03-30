import { create } from 'zustand'
import { StoryState, useStoryStore } from './story'
import { UIState, useUIStore } from './ui'
import { persist } from 'zustand/middleware'
import { TutorialState, useTutorialStore } from './tutorial'

export const useBoundStore = create(
  persist<StoryState & UIState & TutorialState>(
    (set, get, api) => ({
      ...useStoryStore(set, get, api),
      ...useUIStore(set, get, api),
      ...useTutorialStore(set, get, api),
    }),
    {
      name: 'bound-store',
    },
  ),
)

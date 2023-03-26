import { create } from 'zustand'
import { StoryState, useStoryStore } from './story'
import { UIState, useUIStore } from './ui'
import { persist } from 'zustand/middleware'

export const useBoundStore = create(
  persist<StoryState & UIState>(
    (set, get, api) => ({
      ...useStoryStore(set, get, api),
      ...useUIStore(set, get, api),
    }),
    {
      name: 'bound-store',
    },
  ),
)

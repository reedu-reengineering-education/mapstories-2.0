import { create } from 'zustand'
import { useStoryStore } from './story'
import { useUIStore } from './ui'
import { persist } from 'zustand/middleware'
import { useTutorialStore } from './tutorial'
import { CombinedState } from './CombinedState'

export const useBoundStore = create(
  persist<CombinedState>(
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

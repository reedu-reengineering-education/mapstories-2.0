import { UIState } from './ui'
import { TutorialState } from './tutorial'
import { StoryState } from './story'

export type CombinedState = UIState & TutorialState & StoryState

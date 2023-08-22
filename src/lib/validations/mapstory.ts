// import { Visibility } from '@prisma/client'
import { StoryMode } from '@prisma/client'
import * as z from 'zod'

export const createMapstorySchema = z.object({
  name: z.string().min(3).max(100),
  mode: z.enum([StoryMode.NORMAL, StoryMode.TIMELINE]),
})

export const updateMapstorySchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string(),
  mode: z.enum([StoryMode.NORMAL, StoryMode.TIMELINE]),
  visibility: z.any(),
  themeId: z.string(),
})

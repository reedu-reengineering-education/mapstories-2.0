import { Visibility } from '@prisma/client'
import * as z from 'zod'

const StoryStepSchema = z.object({
  position: z.number(),
  storyId: z.string(),
  feature: z.record(z.unknown()),
  content: z.array(z.record(z.unknown())),
  connections: z.array(z.record(z.unknown())),
  viewport: z.record(z.unknown()),
  storyTitleStep: z.string().optional(),
})

export const createMapstorySchema = z.object({
  name: z.string().min(3).max(32),
})

export const updateMapstorySchema = z.object({
  name: z.string().min(3).max(32),
  description: z.string(),
  visibility: z.nativeEnum(Visibility),
  theme: z.string(),
  firstStep: StoryStepSchema,
})

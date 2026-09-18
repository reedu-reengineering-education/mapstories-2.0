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
  author: z.string(),
  mode: z.enum([StoryMode.NORMAL, StoryMode.TIMELINE]),
  visibility: z.enum(['PRIVATE', 'PUBLIC']),
  themeId: z.string().nullable().optional(),
  lines: z.boolean(),
  community: z.boolean(),
  defaultLanguage: z.string().min(2).max(5).optional().nullable(),
})

export const copyMapstorySchema = z.object({
  name: z.string().min(3).max(100),
})

export const addLanguageSchema = z.object({
  language: z.string().min(2).max(5),
})

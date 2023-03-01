import { Visibility } from '@prisma/client'
import * as z from 'zod'

export const createMapstorySchema = z.object({
  name: z.string().min(3).max(32),
})

export const updateMapstorySchema = z.object({
  name: z.string().min(3).max(32),
  description: z.string(),
  visibility: z.nativeEnum(Visibility),
  theme: z.string(),
})

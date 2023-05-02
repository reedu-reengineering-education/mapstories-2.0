import * as z from 'zod'

export const createMapstorySchema = z.object({
  name: z.string().min(3).max(100),
})

export const updateMapstorySchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string(),
  // visibility: z.nativeEnum(Visibility),
  // theme: z.string(),
})

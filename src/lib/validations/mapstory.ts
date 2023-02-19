import * as z from 'zod'

export const createMapstoryeSchema = z.object({
  name: z.string().min(3).max(32),
  slug: z.string().max(32)
})

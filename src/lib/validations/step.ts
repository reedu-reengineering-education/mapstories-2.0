import * as z from 'zod'

export const updateStepSchema = z.object({
  feature: z.any(), //TODO: can we validate GeoJSON here?
  timestamp: z.string().or(z.date()).optional(),
  tags: z.array(z.string()).optional(),
})

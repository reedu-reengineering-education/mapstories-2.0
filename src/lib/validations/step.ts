import * as z from 'zod'

export const updatStepSchema = z.object({
  feature: z.any(), //TODO: can we validate GeoJSON here?
})

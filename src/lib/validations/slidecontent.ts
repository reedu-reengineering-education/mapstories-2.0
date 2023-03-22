import * as z from 'zod'

export const slideTitleContentSchema = z.object({
  title: z.string().min(3).max(52),
})

export const slideEmbedContentSchema = z.object({
  content: z.string().url(),
  options: z
    .object({
      autoplay: z.boolean(),
    })
    .optional(),
})

import * as z from 'zod'

export const slideTitleContentSchema = z.object({
  title: z.string(),
})

export const slideEmbedContentSchema = z.object({
  content: z.string().url(),
  options: z
    .object({
      autoplay: z.boolean(),
    })
    .optional(),
})

export const slideContentLinkSchema = z.object({
  url: z.string().url(),
})

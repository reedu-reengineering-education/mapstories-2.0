import * as z from 'zod'

export const slideTitleContentSchema = z.object({
    title: z.string().min(3).max(52),
})

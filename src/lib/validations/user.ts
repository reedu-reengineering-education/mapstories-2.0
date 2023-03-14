import * as z from 'zod'

export const userNameSchema = z.object({
  name: z.string().min(3).max(32),
})

export const userEmailSchema = z.object({
  email: z.string().email(),
})

export const userUpdateSchema = z.union([userNameSchema, userEmailSchema])

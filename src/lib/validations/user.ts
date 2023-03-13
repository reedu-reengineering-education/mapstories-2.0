import * as z from 'zod'

export const userNameSchema = z.object({
  name: z.string().min(3).max(32),
})

export const userEmailSchema = z.object({
  email: z.string().min(6).max(50),
})

export const userUpdateSchema = z.union([userNameSchema, userEmailSchema])

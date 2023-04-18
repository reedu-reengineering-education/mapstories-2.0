import * as z from 'zod'

const MAX_FILE_SIZE = 500000
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

export const mapstoryOptionsSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(350),
  public: z.boolean(),
  theme: z.string(),
  image:
    z.string() ||
    z.object({
      image: z
        .any()
        .refine(
          files => files?.[0]?.size <= MAX_FILE_SIZE,
          'Max image size is 5MB.',
        )
        .refine(
          files => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
          'Only .jpg, .jpeg, .png and .webp formats are supported.',
        ),
    }),
})

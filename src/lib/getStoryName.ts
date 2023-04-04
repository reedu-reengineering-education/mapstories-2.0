import { Story } from '@prisma/client'
import { db } from './db'

export async function getStoryName(slug: Story['slug']) {
  return await db.story.findFirst({
    where: {
      slug: slug,
    },
    select: {
      name: true,
    },
  })
}

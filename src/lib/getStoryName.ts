import { Story } from '@prisma/client'
import { db } from './db'

export async function getStoryName(slug: Story['slug']) {
  console.log('JADASJDLASJDASDAS')
  return await db.story.findFirst({
    where: {
      slug: slug,
    },
    select: {
      name: true,
    },
  })
}

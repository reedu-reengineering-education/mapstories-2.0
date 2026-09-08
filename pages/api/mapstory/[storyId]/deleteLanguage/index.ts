import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { db } from '@/src/lib/db'
import { withMapstory } from '@/src/lib/apiMiddlewares/withMapstory'
import { authOptions } from '@/src/lib/auth'
import { getServerSession } from 'next-auth/next'

const deleteLanguageSchema = z.object({
  language: z.string(),
  variantId: z.string(),
})

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const storyId = req.query.storyId as string
    const { language, variantId } = deleteLanguageSchema.parse(req.body)

    try {
      const session = await getServerSession(req, res, authOptions)
      const user = session?.user

      // Get the original story to verify ownership
      const originalStory = await db.story.findFirst({
        where: {
          OR: [{ id: storyId }, { slug: storyId }],
        },
      })

      if (!originalStory) {
        return res.status(404).end()
      }
      if (user?.id !== originalStory.ownerId) {
        return res.status(401).end()
      }

      // Get the variant to delete
      const variantStory = await db.story.findUnique({
        where: { id: variantId },
      })

      if (!variantStory) {
        return res.status(404).json({ message: 'Variant not found' })
      }

      if (variantStory.language !== language) {
        return res.status(400).json({ message: 'Language mismatch' })
      }

      // Don't allow deleting the default language (non-translation)
      if (!variantStory.isTranslation) {
        return res
          .status(400)
          .json({ message: 'Cannot delete the default language' })
      }

      // Delete the language variant and all its associated data
      await db.$transaction(async transaction => {
        // Delete all steps associated with this story
        await transaction.storyStep.deleteMany({
          where: { storyId: variantId },
        })

        // Delete the story variant itself
        await transaction.story.delete({
          where: { id: variantId },
        })
      })

      return res.status(200).json({ message: 'Language deleted successfully' })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues)
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(422).json({ message: error.message })
      }
      return res.status(422).end()
    }
  }
}

export default withMethods(['DELETE'], withMapstory(handler))

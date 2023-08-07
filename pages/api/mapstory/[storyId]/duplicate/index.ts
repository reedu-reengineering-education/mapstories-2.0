import { NextApiRequest, NextApiResponse } from 'next'

import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { db } from '@/src/lib/db'
import { withMapstory } from '@/src/lib/apiMiddlewares/withMapstory'
import { generateSlug } from '@/src/lib/slug'
import { authOptions } from '@/src/lib/auth'
import { getServerSession } from 'next-auth/next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const storyId = req.query.storyId as string

  if (req.method === 'POST') {
    try {
      // find the story first and then duplicate it
      const session = await getServerSession(req, res, authOptions)
      const user = session?.user

      const story = await db.story.findFirst({
        where: {
          OR: [{ id: storyId }, { slug: storyId }],
        },
        include: {
          firstStep: {
            include: {
              content: true,
            },
          },
          steps: {
            include: {
              content: true,
            },
          },
        },
      })

      const storyCopy = await db.story.create({
        data: {
          ownerId: story?.ownerId,
          name: story?.name + '(copy)',
          visibility: 'PRIVATE',
          slug: await generateSlug(story?.name + '(copy)'),
        },
      })

      const firstStep = await db.storyStep.create({
        data: {
          viewport: {},
          position: 0,
          feature: story?.steps[0]?.feature ? story.steps[0].feature : {},
          storyId: storyCopy.id,
        },
      })

      story?.steps.map(async (step, index) => {
        if (index !== 0) {
          const newStep = await db.storyStep.create({
            data: {
              storyId: storyCopy.id,
              position: step.position,
              viewport: {},
              feature: step.feature! ? step.feature : {},
            },
            include: {
              Story: {
                select: {
                  name: true,
                },
              },
            },
          })
          step.content.map(async content => {
            const newContent = await db.slideContent.create({
              data: {
                type: content.type,
                content: content.content,
                position: content.position,
                storyStepId: newStep.id,
              },
            })
          })
        }
      })

      await db.story.update({
        where: { id: storyCopy.id },
        data: { firstStepId: firstStep.id },
      })

      return res.status(200).json(storyCopy)
    } catch (error) {
      console.log(error)
      return res.status(500).end()
    }
  }
}

export default withMethods(['POST'], withMapstory(handler))

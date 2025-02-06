import { NextApiRequest, NextApiResponse } from 'next'

import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { db } from '@/src/lib/db'
import { withMapstory } from '@/src/lib/apiMiddlewares/withMapstory'
import { generateSlug } from '@/src/lib/slug'
import { authOptions } from '@/src/lib/auth'
import { getServerSession } from 'next-auth/next'
import { createMapstorySchema } from '@/src/lib/validations/mapstory'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const storyId = req.query.storyId as string
  const payload = createMapstorySchema.parse(req.body)

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
      
      // if session user is not owner of the story
      if (user?.id !== story?.ownerId) {
        res.status(401).end()
      }
      // create copy of the mapstory
      const storyCopy = await db.story.create({
        data: {
          ownerId: req.body.ownerId,
          visibility: req.body.visibility,
          slug: await generateSlug(payload.name),
          ...payload
        },
      })

      if (story?.steps?.length && story?.steps?.length > 0) {
        let index = 0
        for (const step of story.steps) {
          const newStep = await db.storyStep.create({
            data: {
              storyId: storyCopy.id,
              position: step.position,
              viewport: step.viewport || {},
              tags: step.tags,
            },
            include: {
              Story: {
                select: {
                  name: true,
                },
              },
            },
          })
          // Assign firstStepId
          // if (index === 0) {
          //   await db.story.update({
          //     where: { id: storyCopy.id },
          //     data: { firstStepId: newStep.id },
          //   })

          //   index++
          // }
          // Get all slide contents for the given story step id
          const slideContents = await db.slideContent.findMany({
            where: {
              storyStepId: step.id,
            },
          })

          // Copy slide contents and assign them to the new step
          slideContents.forEach(async (item) => {
            let newMedia = null
            const { type, content, position, mediaId, suggestionId } = item
            if (mediaId) {
              const { name, size, url, altText, caption, source} = await db.media.findFirst({
                where: {
                  id: mediaId,
                }
              })

              newMedia = await db.media.create({
                data: {
                  name,
                  size,
                  url, 
                  altText,
                  caption,
                  source
                },
              })
            }
            await db.slideContent.create({
              data: {
                storyStepId: newStep.id,
                type,
                content,
                position,
                suggestionId,
                mediaId: mediaId ? newMedia?.id : null
              }
            })
          })
        }
      }

      res.status(200).json(storyCopy)
      res.end()
    } catch (error) {
      console.log(error)
      res.status(500).end()
    }
  }
}

export default withMethods(['POST'], withMapstory(handler))

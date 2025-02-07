import { NextApiRequest, NextApiResponse } from 'next'

import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { db } from '@/src/lib/db'
import { withMapstory } from '@/src/lib/apiMiddlewares/withMapstory'
import { generateSlug } from '@/src/lib/slug'
import { authOptions } from '@/src/lib/auth'
import { getServerSession } from 'next-auth/next'
import { updateMapstorySchema } from '@/src/lib/validations/mapstory'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const storyId = req.query.storyId as string
    const payload = updateMapstorySchema.parse(req.body)

    try {
      const session = await getServerSession(req, res, authOptions)
      const user = session?.user
      // find the story
      const story = await db.story.findFirst({
        where: {
          OR: [{ id: storyId }, { slug: storyId }],
        },
        include: {
          theme: true, // Include the theme of the story
          steps: {
            include: {
              content: {
                include: {
                  media: true, // Include media for each slide content
                },
              },
            },
          },
          stepSuggestions: true, // Include step suggestions for the story
        },
      })

      // if session user is not owner of the story
      if (user?.id !== story?.ownerId) {
        res.status(401).end()
      }
      
      // create copy of the mapstory
      const storyCopy = await db.story.create({
        data: {
          slug: await generateSlug(payload.name),
          ownerId: story?.ownerId,
          ...payload
        },
      })
      
      // copy steps, if any
      const steps = story?.steps || []
      if (steps?.length > 0) {
        for (const step of steps) {
          const newStep = await db.storyStep.create({
            data: {
              storyId: storyCopy.id,
              position: step.position,
              feature: step.feature || undefined,
              viewport: step.viewport || {},
              tags: step.tags,
              timestamp: step.timestamp,
            }
          })
          // If there is content
          step.content.forEach(async slideContent => {
            let newMedia 
            if (slideContent.mediaId) {
              const media = slideContent.media

              newMedia = await db.media.create({
                data: { 
                  name: media?.name || "", 
                  size: media?.size, 
                  url: media?.url, 
                  altText: media?.altText, 
                  caption: media?.caption, 
                  source: media?.source 
                }
              })
            }

            await db.slideContent.create({
              data: {
                storyStepId: newStep.id,
                content: slideContent.content,
                type: slideContent.type,
                position: slideContent.position,
                options: slideContent.options || undefined,
                suggestionId: slideContent.suggestionId,
                ogData: slideContent.ogData || undefined,
                mediaId: newMedia ? newMedia.id : null
              }
            })
          })
        }
      }
      // copy suggestions, if any
      story?.stepSuggestions.forEach(async suggestion => {
        await db.storyStepSuggestion.create({
          data: {
            storyId: storyCopy.id,
            position: suggestion.position,
            feature: suggestion.feature || undefined,
            viewport: suggestion.viewport || {},
            tags: suggestion.tags,
            timestamp: suggestion.timestamp,
            status: suggestion.status
          }
        })
      })
      // return copied story
      res.status(200).json(storyCopy) 
      res.end()
    } catch (error) {
      console.log(error)
      res.status(500).end()
    }
  }
}

export default withMethods(['POST'], withMapstory(handler))

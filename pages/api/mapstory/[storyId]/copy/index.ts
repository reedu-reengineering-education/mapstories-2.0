import { NextApiRequest, NextApiResponse } from 'next'

import { Media } from '@prisma/client'
import { StoryStep } from '@prisma/client'
import { SlideContent } from '@prisma/client'
import { StoryStepSuggestion } from '@prisma/client'

import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { db } from '@/src/lib/db'
import { withMapstory } from '@/src/lib/apiMiddlewares/withMapstory'
import { generateSlug } from '@/src/lib/slug'
import { authOptions } from '@/src/lib/auth'
import { getServerSession } from 'next-auth/next'
import { updateMapstorySchema } from '@/src/lib/validations/mapstory'

type ExtendedSlideContent = SlideContent & { media: Media | null}
type ExtendedStoryStep = StoryStep & { content: ExtendedSlideContent[] | null}

async function createStepContent(step: ExtendedStoryStep, newStepId: string) {
  step?.content?.forEach(async (slideContent: ExtendedSlideContent )=> {
    let newMedia 
    if (slideContent.mediaId) {
      const media = slideContent?.media
      newMedia = await db.media.create({
        data: { 
          name: media?.name?? "", 
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
        storyStepId: newStepId,
        content: slideContent.content,
        type: slideContent.type,
        position: slideContent.position,
        options: slideContent.options ?? undefined,
        suggestionId: slideContent.suggestionId,
        ogData: slideContent.ogData ?? undefined,
        mediaId: newMedia?.id ?? null
      }
    })
  })
}

async function createStep(step: ExtendedStoryStep, storyId: string | null) {
  const newFirstStep = await db.storyStep.create({
    data: {
      storyId,
      position: step?.position ?? 0,
      feature: step?.feature ?? undefined,
      viewport: step?.viewport ?? {},
      tags: step?.tags,
      timestamp: step?.timestamp,
    }
  })

  await createStepContent(step, newFirstStep.id)

  return newFirstStep.id
}

async function createStepSuggestion(suggestion: StoryStepSuggestion, storyId: string) {
  await db.storyStepSuggestion.create({
    data: {
      storyId: storyId,
      position: suggestion.position,
      feature: suggestion.feature ?? undefined,
      viewport: suggestion.viewport ?? {},
      tags: suggestion.tags,
      timestamp: suggestion.timestamp,
      status: suggestion.status
    }
  })
}

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

      if (!story) {
        res.status(404).end()
        return
      }
      // if session user is not owner of the story
      if (user?.id !== story?.ownerId) {
        res.status(401).end()
        return 
      }
      await db.$transaction(async (transaction) => {
        let newFirstStepId;
        if (story.firstStepId) {
          const firstStep = await transaction.storyStep.findFirst({
            where: {
              id: story.firstStepId,
            },
            include: {
              content: {
                include: {
                  media: true, // Include media for each slide content
                },
              },
            },
          });

          if (!firstStep) {
            res.status(404).end()
            return
          }

          let newFirstStepId = await createStep(firstStep, firstStep?.storyId ?? null)
        }
        // create copy of the story
        const storyCopy = await transaction.story.create({
          data: {
            slug: await generateSlug(payload.name),
            ownerId: story?.ownerId,
            firstStepId: newFirstStepId,
            ...payload
          },
        })
        // copy steps
        story?.steps.forEach(async step => {
          await createStep(step, storyCopy.id)
        })

        // copy suggestions
        story?.stepSuggestions.forEach(async suggestion => {
          await createStepSuggestion(suggestion, storyCopy.id)
        })
        // return copied story
        res.status(200).json(storyCopy) 
        res.end()
      })
    } catch (error) {
      console.log(error)
      res.status(500).end()
    }
  }
}

export default withMethods(['POST'], withMapstory(handler))

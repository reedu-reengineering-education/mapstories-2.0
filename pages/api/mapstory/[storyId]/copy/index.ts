import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

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

type ExtendedSlideContent = SlideContent & { media: Media | null }
type ExtendedStoryStep = StoryStep & { content: ExtendedSlideContent[] | null }

async function createStepContent(step: ExtendedStoryStep, newStepId: string) {
  step?.content?.forEach(async (slideContent: ExtendedSlideContent )=> {
    let newMedia 
    if (slideContent.mediaId) {
      const mediaData = slideContent.media
      newMedia = await db.media.create({
        data: { 
          ...mediaData,
          name: mediaData?.name ?? ''
        }
      })
    }
    
    const content = slideContent as SlideContent
    await db.slideContent.create({
      data: {
        ...content,
        storyStepId: newStepId,
        mediaId: newMedia?.id ?? undefined,
        options: content.options ?? undefined,
        ogData: content.ogData ?? undefined
      }
    })
  })
}

async function createStep(step: ExtendedStoryStep, storyId: string | null) {
  const stepData = step as StoryStep
  const newFirstStep = await db.storyStep.create({
    data: {
      ...stepData,
      storyId,
      position: stepData?.position ?? 0,
      feature: stepData?.feature ?? undefined,
      viewport: stepData?.viewport ?? {}
    }
  })

  await createStepContent(step, newFirstStep.id)

  return newFirstStep.id
}

async function createStepSuggestion(suggestion: StoryStepSuggestion, storyId: string) {
  await db.storyStepSuggestion.create({
    data: {
      ...suggestion,
      storyId,
      feature: suggestion.feature ?? undefined,
      viewport: suggestion.viewport ?? {}
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

          newFirstStepId = await createStep(firstStep, firstStep?.storyId ?? null)
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
      if (error instanceof z.ZodError) {
        res.status(422).json(error.issues)
      }

      res.status(422).end()
    }
  }
}

export default withMethods(['POST'], withMapstory(handler))

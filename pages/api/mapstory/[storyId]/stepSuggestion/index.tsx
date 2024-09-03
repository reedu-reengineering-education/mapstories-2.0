import { NextApiRequest, NextApiResponse } from 'next'
import { withMapstory } from '@/src/lib/apiMiddlewares/withMapstory'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { db } from '@/src/lib/db'
import { z } from 'zod'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const storyId = req.body.id as string
      const stepSuggestionContents = req.body.content as any[]
      const story = await db.story.findFirst({
        where: {
          id: storyId,
        },
        select: {
          steps: true,
          mode: true,
        },
      })
      const newStepSuggestion = await db.storyStepSuggestion.create({
        data: {
          storyId,
          viewport: {},
          position: req.body.position || 0,
          feature: req.body.feature ?? null,
          timestamp: req.body.timestamp ?? null,
          tags: ['community'],
        },
        include: {
          Story: {
            select: {
              name: true,
            },
          },
        },
      })

      const newStepSuggestionId = newStepSuggestion.id as string
      // if (story?.mode === StoryMode.TIMELINE) {
      //     await reorderTimeline(storyId)
      for (const slideContent of stepSuggestionContents) {
        await db.slideContent.create({
          data: {
            type: slideContent.type,
            content: slideContent.content,
            position: slideContent.position,
            suggestionId: newStepSuggestionId,
            mediaId: slideContent.mediaId || undefined,
          },
        })
      }

      res.status(200).json(newStepSuggestion)
      res.end()
    } catch (e) {
      if (e instanceof z.ZodError) {
        console.log(e)
        res.status(422).json(e.issues)
        return
      }
      console.log(e)
      res.status(422).end()
    }
  }
}

export default withMethods(['POST'], withMapstory(handler))

import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/src/lib/db'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { withAuthentication } from '@/src/lib/apiMiddlewares/withAuthentication'
import { z } from 'zod'
import { SlideContent } from '@prisma/client'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      //TODO: Check schema
      const storyStepId = req.query.storyStepId as string

      const newSlideContent = await db.slideContent.create({
        data: {
          ...req.body,
          storyStepId,
          position:
            (
              await db.slideContent.findMany({
                where: {
                  storyStepId,
                },
              })
            )?.length || 0,
        },
      })

      res.json(newSlideContent)

      return res.end()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues)
      }

      return res.status(422).end()
    }
  } else if (req.method === 'PUT') {
    try {
      //TODO: Check schema
      const story = await db.story.findFirst({
        where: {
          id: req.query.storyStepId as string,
        },
        include: {
          steps: {
            include: {
              content: true,
            },
          },
        },
      })

      const contentIds = (req.body as SlideContent[]).map(r => r.id)

      const newSlideContentOrder = contentIds.map((s, i) => ({
        ...story?.steps?.map(step => step.content.find(c => c.id === s))[0],
        position: i,
      }))

      await db.$transaction(
        newSlideContentOrder.map(s =>
          db.slideContent.update({
            where: {
              id: s.id,
            },
            data: {
              position: s.position,
            },
          }),
        ),
      )

      const storyToReturn = await db.story.findFirst({
        where: {
          id: story?.id,
        },
      })

      return res.status(200).json(storyToReturn)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues)
      }

      return res.status(422).end()
    }
  }
}

export default withMethods(['POST', 'PUT'], withAuthentication(handler))

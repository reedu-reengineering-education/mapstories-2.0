import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/src/lib/db'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { withMapstory } from '@/src/lib/apiMiddlewares/withMapstory'
import { z } from 'zod'


async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const storyStepSuggestion = await db.storyStepSuggestion.findFirst({
        where: {
          id: req.query.stepSuggestionId as string,
        },
        include: {
          content: true,
        },
      })
      res.status(200).json(storyStepSuggestion)
      res.end()
    } catch (error) {
      res.status(500).end()
    }
  }
  if (req.method === 'DELETE') {
    try {
      const storyStepSuggestionId = req.query.stepSuggestionId as string

      // TODO: Check if we really need to delete slide Content: oncascade delete story step
      // delete all slideContent associated with the step
      const deletedContent = await db.slideContent.deleteMany({
        where: { suggestionId: storyStepSuggestionId },
      })
      // delete the step
      const deletedStepSuggestion = await db.storyStepSuggestion.delete({
        where: { id: storyStepSuggestionId },
      })

      //TODO: THis can never happen but we need this code for TS?
      if (!deletedStepSuggestion.storyId) {
         res.status(422).end()
         return;
      }

      const updatedStory = await db.story.findFirst({
        where: {
          id: deletedStepSuggestion.storyId.toString(),
        },
        include: {
          steps: true,
        },
      })

  

      res.json(deletedStepSuggestion)

      res.end()
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(422).json(error.issues)
      }

      res.status(422).end()
    }
  }
}

export default withMethods(
  ['GET', 'PUT', 'DELETE'],
  withMapstory(handler),
)

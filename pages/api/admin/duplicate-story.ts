import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/src/lib/auth'
import { db } from '@/src/lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const session = await getServerSession(req, res, authOptions)

  if (!session?.user || session.user.role !== 'ADMIN') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { storyId } = req.body

  if (!storyId) {
    return res.status(400).json({ error: 'Story ID is required' })
  }

  try {
    const originalStory = await db.story.findUnique({
      where: { id: storyId },
      include: {
        steps: {
          include: { 
            content: true,
            connections: true,
          },
        },
        theme: true,
        stepSuggestions: true,
      },
    })

    if (!originalStory) {
      return res.status(404).json({ error: 'Story not found' })
    }

    // Generate unique slug
    let slug = originalStory.slug + '-copy'
    let counter = 1
    while (
      await db.story.findUnique({
        where: { slug },
      })
    ) {
      slug = originalStory.slug + `-copy-${counter}`
      counter++
    }

    // Duplicate story with all steps and content
    const duplicatedStory = await db.story.create({
      data: {
        name: originalStory.name + ' (Copy)',
        slug,
        description: originalStory.description,
        author: originalStory.author,
        themeId: originalStory.themeId,
        ownerId: session.user.id,
        visibility: originalStory.visibility,
        mode: originalStory.mode,
        lines: originalStory.lines,
        community: originalStory.community,
        language: originalStory.language,
        isTranslation: originalStory.isTranslation,
        defaultLanguage: originalStory.defaultLanguage,
        // Don't copy groupId for translations - let it be its own story
      },
    })

    // Copy all steps
    const stepMapping: Record<string, string> = {}
    const stepPromises = originalStory.steps.map(async step => {
      const newStep = await db.storyStep.create({
        data: {
          position: step.position,
          storyId: duplicatedStory.id,
          feature: step.feature,
          viewport: step.viewport,
          timestamp: step.timestamp,
          tags: step.tags,
          content: {
            create: step.content.map(c => ({
              content: c.content,
              type: c.type,
              position: c.position,
              options: c.options,
              ogData: c.ogData,
              mediaId: c.mediaId,
            })),
          },
        },
      })
      stepMapping[step.id] = newStep.id
      return newStep
    })

    const newSteps = await Promise.all(stepPromises)

    // Copy connections (lines between steps)
    const connectionPromises = originalStory.steps.flatMap(step =>
      (step.connections || []).map(async connection => {
        await db.connection.create({
          data: {
            feature: connection.feature,
            storyStepId: stepMapping[step.id],
            width: connection.width,
            color: connection.color,
          },
        })
      }),
    )

    await Promise.all(connectionPromises)

    // Set firstStep if original had one
    if (originalStory.firstStepId && stepMapping[originalStory.firstStepId]) {
      await db.story.update({
        where: { id: duplicatedStory.id },
        data: {
          firstStepId: stepMapping[originalStory.firstStepId],
        },
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Story duplicated successfully',
      storyId: duplicatedStory.id,
      slug: duplicatedStory.slug,
    })
  } catch (error) {
    console.error('Error duplicating story:', error)
    return res.status(500).json({
      error: 'Failed to duplicate story',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

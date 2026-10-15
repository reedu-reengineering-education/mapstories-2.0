import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { Prisma } from '@prisma/client'
import { authOptions } from '@/src/lib/auth'
import { db } from '@/src/lib/db'
import { canManageSite } from '@/src/lib/site'

// Prisma rejects a plain `null` for nullable Json fields in create input
const toJsonInput = (value: Prisma.JsonValue) =>
  value === null ? Prisma.JsonNull : value

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const session = await getServerSession(req, res, authOptions)

  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  })

  if (user?.role !== 'ADMIN' && user?.role !== 'SITE_ADMIN_BFDW') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' })
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
        // The title slide is only linked via firstStepId (its storyId is
        // null), so it is not part of `steps` and must be copied separately.
        firstStep: {
          include: { content: true },
        },
        theme: true,
        stepSuggestions: true,
      },
    })

    if (!originalStory) {
      return res.status(404).json({ error: 'Story not found' })
    }

    // SITE_ADMIN_BFDW may only manage stories of the BFDW site
    if (!canManageSite(user.role, originalStory.site)) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' })
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
        // The copy is a standalone story (no group), so it must not be a
        // translation, otherwise it would be locked to text-only editing.
        isTranslation: false,
        defaultLanguage: originalStory.defaultLanguage,
        // Keep the copy on the same site, otherwise a BFDW copy would become MAIN
        site: originalStory.site,
      },
    })

    // Copy all steps
    const stepMapping: Record<string, string> = {}
    const stepPromises = originalStory.steps.map(async step => {
      const newStep = await db.storyStep.create({
        data: {
          position: step.position,
          storyId: duplicatedStory.id,
          feature: toJsonInput(step.feature),
          viewport: toJsonInput(step.viewport),
          timestamp: step.timestamp,
          tags: step.tags,
          content: {
            create: step.content.map(c => ({
              content: c.content,
              type: c.type,
              position: c.position,
              options: toJsonInput(c.options),
              ogData: toJsonInput(c.ogData),
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
            feature: toJsonInput(connection.feature),
            storyStepId: stepMapping[step.id],
            width: connection.width,
            color: connection.color,
          },
        })
      }),
    )

    await Promise.all(connectionPromises)

    // Copy the title slide; without firstStepId the editor redirects away
    const firstStep = originalStory.firstStep
    const newFirstStep = await db.storyStep.create({
      data: {
        position: firstStep?.position ?? 0,
        feature: firstStep ? toJsonInput(firstStep.feature) : undefined,
        viewport: firstStep ? toJsonInput(firstStep.viewport) : {},
        timestamp: firstStep?.timestamp,
        tags: firstStep?.tags ?? [],
        content: {
          create: (firstStep?.content ?? []).map(c => ({
            content: c.content,
            type: c.type,
            position: c.position,
            options: toJsonInput(c.options),
            ogData: toJsonInput(c.ogData),
            mediaId: c.mediaId,
          })),
        },
      },
    })

    await db.story.update({
      where: { id: duplicatedStory.id },
      data: { firstStepId: newFirstStep.id },
    })

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

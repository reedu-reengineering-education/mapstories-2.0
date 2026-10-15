import { NextApiRequest, NextApiResponse } from 'next'
import { TranslationStatus } from '@prisma/client'

import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { withMapstory } from '@/src/lib/apiMiddlewares/withMapstory'
import { db } from '@/src/lib/db'
import { sendTranslationSubmittedMail } from '@/src/lib/sendTranslationSubmittedMail'

// The translator (owner of the draft) submits it to the original author.
async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const storyId = req.query.storyId as string
    const draft = await db.story.findFirst({
      where: { OR: [{ id: storyId }, { slug: storyId }] },
      include: {
        owner: { select: { name: true, email: true } },
        translationOf: {
          select: { id: true, name: true, owner: { select: { email: true } } },
        },
      },
    })

    if (!draft?.translationOf) {
      return res.status(404).end()
    }
    if (
      draft.translationStatus !== TranslationStatus.DRAFT &&
      draft.translationStatus !== TranslationStatus.REJECTED
    ) {
      return res.status(409).json({ message: 'Translation already submitted' })
    }

    const updated = await db.story.update({
      where: { id: draft.id },
      data: { translationStatus: TranslationStatus.PENDING },
    })

    const authorEmail = draft.translationOf.owner?.email
    if (authorEmail) {
      const proto = (req.headers['x-forwarded-proto'] as string) ?? 'https'
      const baseUrl = req.headers.host
        ? `${proto}://${req.headers.host}`
        : process.env.NEXTAUTH_URL
      await sendTranslationSubmittedMail({
        to: authorEmail,
        storyName: draft.translationOf.name ?? '',
        language: draft.language,
        translatorName: draft.owner?.name ?? draft.owner?.email ?? '',
        reviewLink: `${baseUrl}/storylab/translationRequests/${draft.translationOf.id}`,
      })
    }

    return res.status(200).json(updated)
  } catch (error) {
    console.error(error)
    return res.status(500).end()
  }
}

export default withMethods(['POST'], withMapstory(handler))

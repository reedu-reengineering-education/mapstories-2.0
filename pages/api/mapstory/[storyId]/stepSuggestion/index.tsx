import { NextApiRequest, NextApiResponse } from 'next'
import { withMapstory } from '@/src/lib/apiMiddlewares/withMapstory'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { db } from '@/src/lib/db'
import { z } from 'zod'
import nodemailer from 'nodemailer'

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
          owner: {
            select: {
              email: true,
            },
          },
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

      // send notification email
      if (story?.owner?.email) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        })

        const emailHtml = generateEmailHtml(newStepSuggestion)
        const mailOptions = {
          from: process.env.SMTP_USER,
          to: story?.owner?.email,
          subject: 'New Step Suggestion',
          html: emailHtml,
        }

        await transporter.sendMail(mailOptions)
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

function generateEmailHtml(stepSuggestion: any) {
  return `
    <div style="font-family: 'Arial', sans-serif; line-height: 1.5; color: #333; padding: 16px; background-color: #f9fafb;">
      <h1 style="color: #16a34a; font-size: 24px; font-weight: 600;">Neue Step Suggestion erstellt</h1>
      <p style="font-size: 16px; color: #1f2937;">Für die Story: <strong>${stepSuggestion.Story.name}</strong> wurde eine neue Step Suggestion erstellt.</p>

      <h2 style="font-size: 20px; font-weight: 500; color: #4b5563; margin-top: 16px;">Details zur Step Suggestion</h2>
      <ul style="list-style-type: none; padding: 0;">    
        <li style="font-size: 16px; color: #374151;"><strong>Position:</strong> ${stepSuggestion.position}</li>
        <li style="font-size: 16px; color: #374151;"><strong>Timestamp:</strong> ${stepSuggestion.timestamp || 'Kein Timestamp angegeben'}</li>
        <li style="font-size: 16px; color: #374151;"><strong>Tags:</strong> ${stepSuggestion.tags.join(', ')}</li>
      </ul>

      <a href="${process.env.NEXT_PUBLIC_APP_URL}/de/storylab/stepSuggestions/${stepSuggestion.storyId}" style="display: inline-block; margin-top: 16px; padding: 8px 16px; background-color: #16a34a; color: #fff; text-decoration: none; border-radius: 4px;">Zur Step Suggestion</a>
      
      <p style="font-size: 16px; color: #1f2937; margin-top: 16px;">Vielen Dank, dass Sie unsere Plattform nutzen!</p>
    </div>
  `
}

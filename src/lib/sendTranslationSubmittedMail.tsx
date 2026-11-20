import { MailOptions } from 'nodemailer/lib/smtp-transport'
import nodemailer from 'nodemailer'

import { getLanguageInfo } from '@/src/lib/languageFlags'

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

type Params = {
  to: string
  storyName: string
  language: string
  translatorName: string
  reviewLink: string
}

// Notifies the author of a story that a community translation was submitted.
export const sendTranslationSubmittedMail = async ({
  to,
  storyName,
  language,
  translatorName,
  reviewLink,
}: Params) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const { flag, label } = getLanguageInfo(language)
    const html = `
      <div style="font-family: 'Arial', sans-serif; line-height: 1.5; color: #333; padding: 16px; background-color: #f9fafb;">
        <h1 style="color: #16a34a; font-size: 24px; font-weight: 600;">Neue Übersetzung eingereicht</h1>
        <p style="font-size: 16px; color: #1f2937;">
          <strong>${escapeHtml(translatorName)}</strong> hat eine Übersetzung (${flag} ${escapeHtml(label)})
          deiner Story <strong>${escapeHtml(storyName)}</strong> eingereicht.
        </p>
        <p style="font-size: 16px; color: #1f2937;">
          Die Übersetzung erscheint erst im Viewer, wenn du sie freigibst.
        </p>
        <p style="margin-top: 16px;">
          <a href="${reviewLink}" style="background-color: #16a34a; color: #fff; padding: 8px 16px; border-radius: 6px; text-decoration: none;">Übersetzung prüfen</a>
        </p>
      </div>
    `

    const options: MailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject: `Mapstories: Neue Übersetzung für „${storyName}“`,
      html,
    }

    await transporter.sendMail(options)
  } catch (error) {
    console.log({ error })
  }
}

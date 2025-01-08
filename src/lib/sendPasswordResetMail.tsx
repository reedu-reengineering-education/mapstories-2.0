import { render } from '@react-email/render'
import PasswordResetMail from '@/emails/passwordReset'
import { MailOptions } from 'nodemailer/lib/smtp-transport'
import nodemailer from 'nodemailer'

export const sendPasswordResetMail = async (email: string, token: string) => {
  try {
    const resetLink = `http://localhost:3000/de/passwordResetNew?token=${token}`
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const options: MailOptions = {
      from: 'Mapstories <e.thieme@reedu.de>',
      to: email,
      subject: 'Mapstories Passwort zurücksetzen',
      html: render(PasswordResetMail({ resetLink })),
    }

    await transporter.sendMail(options)
  } catch (error) {
    console.log({ error })
  }
}

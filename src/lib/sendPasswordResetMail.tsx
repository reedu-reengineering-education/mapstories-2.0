import { render } from '@react-email/render'
import PasswordResetMail from '@/emails/passwordReset'
import { MailOptions } from 'nodemailer/lib/smtp-transport'
import nodemailer from 'nodemailer'

export const sendPasswordResetMail = async (
  email: string,
  token: string,
  lng: string,
) => {
  try {
    const resetLink = `${process.env.NEXTAUTH_URL}/${lng}/passwordResetNew?token=${token}`
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const html = await render(PasswordResetMail({ resetLink }))
    const options: MailOptions = {
      from: 'Mapstories <e.thieme@reedu.de>',
      to: email,
      subject: 'Mapstories Passwort zurücksetzen',
      html,
    }

    await transporter.sendMail(options)
  } catch (error) {
    console.log({ error })
  }
}

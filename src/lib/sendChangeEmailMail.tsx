import { resend } from './resend'
import { render } from '@react-email/render'
import ConfirmNewEmail from '@/emails/confirmNewEmail'
export const sendConfirmationRequest = async (params: any) => {
  try {
    const url: string = params.url
    const emailsending = await resend.emails.send({
      from: 'Mapstories <no-reply@mapstories.reedu.de>',
      to: params.identifier,
      subject: 'Mapstories E-Mail bestätigen',
      html: await render(ConfirmNewEmail({ url })),
    })
  } catch (error) {
    console.log({ error })
  }
}

import SignInEmail from '@/emails/sign-in'
import { resend } from './resend'
import { SendVerificationRequestParams } from 'next-auth/providers'
import { render } from '@react-email/render'
export const sendVerificationRequest = async (
  params: SendVerificationRequestParams,
) => {
  try {
    const url: string = params.url
    const emailsending = await resend.emails.send({
      from: 'Mapstories <no-reply@mapstories.reedu.de>',
      to: params.identifier,
      subject: 'Mapstories Login',
      html: render(SignInEmail({ url })),
    })
  } catch (error) {
    console.log({ error })
  }
}

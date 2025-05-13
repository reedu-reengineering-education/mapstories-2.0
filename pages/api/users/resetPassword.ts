import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { db } from '@/src/lib/db'
import { sendPasswordResetMail } from '@/src/lib/sendPasswordResetMail'
import { generatePasswordResetToken } from '@/src/lib/token'
import { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ message: 'Email is required' })
  }
  try {
    const lng =
      req.headers['accept-language']?.split(',')[0].split('-')[0] || 'en'
    resetPassword({ email, lng })
    return res.json({ message: 'Password reset email sent' })
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message })
  }
}

const resetPassword = async (values: { email: string; lng: string }) => {
  const existingUser = await db.user.findUnique({
    where: { email: values.email },
  })
  if (!existingUser) {
    throw new Error('User not found')
  }

  const passwordResetToken = await generatePasswordResetToken(values.email)
  await sendPasswordResetMail(
    values.email,
    passwordResetToken.token,
    values.lng,
  )
  return { message: 'Password reset email sent' }
}

export default withMethods(['POST'], handler)

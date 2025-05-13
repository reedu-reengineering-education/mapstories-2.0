import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { db } from '@/src/lib/db'
import { getPasswordResetTokenByToken } from '@/src/lib/passwordResetToken'
import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'

async function newPassword(token: string, newPassword: string) {
  if (!token || !newPassword) {
    throw new Error('Token or new password missing')
  }

  const existingToken = await getPasswordResetTokenByToken(token)

  if (!existingToken) {
    throw new Error('Token not found')
  }

  const hasExpired = new Date() > existingToken.expires

  if (hasExpired) {
    throw new Error('Token has expired')
  }

  const existingUser = await db.user.findUnique({
    where: { email: existingToken.email },
  })

  if (!existingUser) {
    throw new Error('User not found')
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await db.user.update({
    where: { email: existingToken.email },
    data: { password: hashedPassword },
  })

  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  })

  return { message: 'Password updated' }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token, password } = req.body

  try {
    const result = await newPassword(token, password)
    res.json(result)
  } catch (error) {
    res.status(400).json({ message: (error as Error).message })
  }
}

export default withMethods(['POST'], handler)

import { db } from './db'

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passqordResetToken = await db.passwordResetToken.findUnique({
      where: {
        token,
      },
    })
    return passqordResetToken
  } catch (error) {
    return null
  }
}

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findFirst({
      where: {
        email,
      },
    })
    return passwordResetToken
  } catch (error) {
    return null
  }
}

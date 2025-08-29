import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/src/lib/db'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import bcryptjs from 'bcryptjs'
import { render } from '@react-email/render'
import PasswordRequest from '@/emails/passwordRequest'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ message: 'Email is required' })
  }

  try {
    // Generate a new random password
    const newPassword = crypto.randomBytes(8).toString('hex')
    const hashedPassword = await bcryptjs.hash(newPassword, 10)

    // Update the user's password in the database
    const updatedUser = await db.user.findUnique({
      where: { email },
    })

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (updatedUser.password && updatedUser.password.length > 0) {
      return res.status(400).json({
        message: 'User already has a password set',
      })
    }
    await db.user.update({
      where: { email },
      data: { password: hashedPassword },
    })

    // Send an email to the user with the new password
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const emailHtml = await render(PasswordRequest({ password: newPassword }))

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Your new password',
      html: emailHtml,
    }
    await transporter.sendMail(mailOptions)

    res
      .status(200)
      .json({ message: 'New password has been set and emailed to you' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export default withMethods(['POST'], handler)

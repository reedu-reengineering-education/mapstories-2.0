import { NextAuthOptions } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { db } from './db'
import nodemailer from 'nodemailer'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    EmailProvider({
      from: process.env.SMTP_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        })
        console.log('new log in mail has been sent: ', url)
        // const emailHtml = render(SignInEmail({ url }))

        // const options: MailOptions = {
        //   from: provider.from,
        //   to: identifier,
        //   subject: 'Mapstories Login',
        //   html: emailHtml,
        // }

        // await transporter.sendMail(options)
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
      }

      return session
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if (!dbUser) {
        token.id = user?.id ?? ''
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      }
    },
  },
}

import { NextAuthOptions } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { db } from './db'
import { render } from '@react-email/render'
import SignInEmail from '@/emails/sign-in'
import nodemailer from 'nodemailer'
import { MailOptions } from 'nodemailer/lib/smtp-transport'
import { compare } from 'bcryptjs'
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 28, // 28 days
  },
  pages: {
    signIn: '/login',
  },
  // Set AUTH_COOKIE_DOMAIN (e.g. ".mapstories.de") to share the login session
  // between the main domain and subdomains such as bfdw.mapstories.de.
  ...(process.env.AUTH_COOKIE_DOMAIN
    ? {
        cookies: {
          sessionToken: {
            name: 'next-auth.session-token',
            options: {
              httpOnly: true,
              sameSite: 'lax' as const,
              path: '/',
              secure: process.env.NODE_ENV === 'production',
              domain: process.env.AUTH_COOKIE_DOMAIN,
            },
          },
        },
      }
    : {}),
  providers: [
    EmailProvider({
      from: process.env.SMTP_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        console.log('Login URL:', url)
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        })
        const emailHtml = await render(SignInEmail({ url }))

        const options: MailOptions = {
          from: provider.from,
          to: identifier,
          subject: 'Mapstories Login',
          html: emailHtml,
        }

        await transporter.sendMail(options)
      },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user) {
          return null
        }

        if (!user.password) {
          return null
        }

        const isValidPassword = await compare(
          credentials.password,
          user.password,
        )
        if (!isValidPassword) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  callbacks: {
    // Default NextAuth behaviour forces every redirect back to NEXTAUTH_URL's
    // host, which would always bounce BFDW logins back to the main domain.
    // Trust absolute callback URLs pointing at either of our own hosts.
    async redirect({ url, baseUrl }) {
      let target: URL
      try {
        target = new URL(url, baseUrl)
      } catch {
        return baseUrl
      }

      const allowedHostnames = [new URL(baseUrl).hostname]
      if (process.env.BFDW_DOMAIN) {
        allowedHostnames.push(process.env.BFDW_DOMAIN)
      }

      return allowedHostnames.includes(target.hostname)
        ? target.toString()
        : baseUrl
    },
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
        session.user.role = token.role
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
        role: dbUser.role,
      }
    },
  },
  // logger: {
  //   error: console.error,
  //   warn: console.warn,
  //   debug: console.log,
  // },
}

import { NextApiRequest, NextApiResponse } from 'next'
import * as z from 'zod'
import { getServerSession } from 'next-auth/next'
import bcrypt from 'bcrypt'

import { db } from '@/src/lib/db'
import { userUpdateSchema } from '@/src/lib/validations/user'
import { authOptions } from '@/src/lib/auth'
import { withCurrentUser } from '@/src/lib/apiMiddlewares/withCurrentUser'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { sendConfirmationRequest } from '@/src/lib/sendChangeEmailMail'

// Schema, das explizit KEIN role zulässt
const selfUpdateSchema = userUpdateSchema
  .omit({ role: true } as any) // falls userUpdateSchema role enthält
  .strict() // keine unbekannten Felder zulassen
  
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    try {
      const session = await getServerSession(req, res, authOptions)
      const user = session?.user

      const body = req.body

      if (!user) {
        throw new Error('Unauthenticated')
      }

      // Validiere die Eingabedaten
      const payload = userUpdateSchema.parse(body)
      let newPayload: any = { ...payload }

      // Harte Sperre: role im Body? -> sofort Abbruch
      if ('role' in req.body) {
        return res.status(400).json({ error: 'Role cannot be changed via this endpoint.' })
      }

      // Prüfe, ob die E-Mail geändert wird
      if (payload.email && payload.email !== user.email) {
        const userExists = await db.user.findUnique({
          where: {
            email: payload.email,
          },
        })

        if (userExists) {
          return res.status(422).json({ error: 'E-Mail Address not valid.' })
        }

        const token = Math.random().toString(36).slice(2)

        newPayload = {
          ...newPayload,
          verify_new_email_token: token,
          new_email: payload.email,
        }

        sendConfirmationRequest({
          url: req.headers.host + '/confirmMail?token=' + token,
          identifier: payload.email,
          token: token,
        })

        delete newPayload.email
      }

      // Prüfe, ob ein Passwort aktualisiert wird und ob es nicht leer ist
      if (payload.password && payload.password.trim() !== '') {
        const hashedPassword = await bcrypt.hash(payload.password, 10) // Hash das Passwort
        newPayload.password = hashedPassword
      } else {
        // Entferne das Passwort aus dem Payload, falls es leer ist
        delete newPayload.password
      }

      // Aktualisiere den Benutzer in der Datenbank
      const updatedUser = await db.user.update({
        where: {
          id: user.id,
        },
        data: newPayload,
      })

      // Gib den aktualisierten Benutzer zurück
      return res.status(200).json(updatedUser)
    } catch (error) {
      return res.status(422).json(error)
    }
  }

  if (req.method === 'DELETE') {
    try {
      const session = await getServerSession(req, res, authOptions)
      const user = session?.user

      if (user) {
        await db.user.delete({
          where: {
            id: user.id,
          },
        })
      }

      return res.status(200).end()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues)
      }

      return res.status(422).end()
    }
  }
}

export default withMethods(['PATCH', 'DELETE'], withCurrentUser(handler))

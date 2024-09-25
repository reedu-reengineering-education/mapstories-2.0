import { NextApiRequest, NextApiResponse } from 'next'
import * as z from 'zod'
import { getServerSession } from 'next-auth/next'

import { db } from '@/src/lib/db'
import { userUpdateSchema } from '@/src/lib/validations/user'
import { authOptions } from '@/src/lib/auth'
import { withCurrentUser } from '@/src/lib/apiMiddlewares/withCurrentUser'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { sendConfirmationRequest } from '@/src/lib/sendChangeEmailMail'
// import jwt from “jsonwebtoken”;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    try {
      const session = await getServerSession(req, res, authOptions)
      const user = session?.user

      const body = req.body

      if (!user) {
        throw new Error('Unauthenticated')
      }
      const payload = userUpdateSchema.parse(body)
      let newPayload:any;
      if(payload.email && payload.email != user.email){
        // const token = jwt.encode({
        //   token: {id: user.id, email: payload.email },
        //   secret: process.env.NEXTAUTH_SECRET as string,
        //   maxAge: 24 * 60 * 60 
        // })
        const userExists = await db.user.findUnique( {where: {
          email: payload.email,
        }});
        if(userExists){
          return res.status(422).json({error: 'E-Mail Address not valid.'})
        }
        const token = 'superSecureYO'
        newPayload = {...payload, verify_new_email_token : token, new_email : payload.email}
        sendConfirmationRequest({url: req.headers.host + '/api/users/confirmNewEmail?token='+ token , identifier: payload.email, token: token, expires: new Date()})
        delete newPayload.email

      }
      const updatedUser = await db.user.update({
        where: {
          id: user.id,
        },
        data: newPayload,
      })

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

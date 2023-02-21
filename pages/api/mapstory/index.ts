import { NextApiRequest, NextApiResponse } from 'next'
import * as z from 'zod'
import { unstable_getServerSession } from 'next-auth/next'

import { db } from '@/src/lib/db'
import { authOptions } from '@/src/lib/auth'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { createMapstoryeSchema } from '@/src/lib/validations/mapstory'
import { withAuthentication } from '@/src/lib/apiMiddlewares/withAuthentication'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const session = await unstable_getServerSession(req, res, authOptions)
      const user = session?.user

      const body = req.body

      if (body?.name && user) {
        const payload = createMapstoryeSchema.parse(body)

        let slug = payload.slug;
let suffix = 0;
let isUnique = false;

while (!isUnique) {
  // Check if the current slug with the current suffix exists
  let existingSlug = null
  if(suffix === 0){
    existingSlug = await db.story.findUnique({
      where: { slug: slug },
    });
    if (existingSlug) {
      // If the slug already exists, increment the suffix and try again
      suffix++;
    }
    else{
      isUnique= true
    }
  }
  else {
    existingSlug = await db.story.findUnique({
      where: { slug: `${slug}-${suffix}` },
    });
    if(existingSlug){
      suffix++;
    }
    else{
      // If the slug doesn't exist, set it and exit the loop
      slug = `${slug}-${suffix}`;
      isUnique = true;
    }
  }
}



        const newMapstory = await db.story.create({
          data: {
            ownerId: user.id,
            name: payload.name,
            slug: slug,
            visibility: 'PRIVATE',
          },
        })

        await db.storyStep.create({
          data: {
            storyId: newMapstory.id,
            viewport: {},
            position: 0,
          },
        })

        res.json(newMapstory)
      }

      return res.end()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues)
      }

      return res.status(422).json(error)
    }
  }
}

export default withMethods(['POST'], withAuthentication(handler))

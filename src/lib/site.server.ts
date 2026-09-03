import { headers } from 'next/headers'
import { Site } from '@prisma/client'
import { getSiteFromHost } from '@/src/lib/site'

// Resolves the active site for the current request. Server Components / app
// router route handlers only — importing next/headers breaks pages/ routes.
export function getCurrentSite(): Site {
  return getSiteFromHost(headers().get('host'))
}

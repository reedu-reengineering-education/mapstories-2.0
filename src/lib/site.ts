import { headers } from 'next/headers'
import { Site } from '@prisma/client'

// Domain of the BFDW white-label deployment, e.g. "bfdw.mapstories.de".
const BFDW_DOMAIN = process.env.BFDW_DOMAIN

export function getSiteFromHost(host?: string | null): Site {
  if (!host || !BFDW_DOMAIN) {
    return Site.MAIN
  }
  const hostname = host.split(':')[0].toLowerCase()
  return hostname === BFDW_DOMAIN.toLowerCase() ? Site.BFDW : Site.MAIN
}

// Resolves the active site for the current request in Server Components / Route Handlers.
export function getCurrentSite(): Site {
  return getSiteFromHost(headers().get('host'))
}

export const adminRoleForSite: Record<Site, 'ADMIN' | 'SITE_ADMIN_BFDW'> = {
  MAIN: 'ADMIN',
  BFDW: 'SITE_ADMIN_BFDW',
}

// True if the user's role grants admin rights for the given site.
// The global ADMIN role always has access; a site-specific admin role only for its own site.
export function canManageSite(
  role: string | undefined,
  site: Site,
): boolean {
  if (role === 'ADMIN') {
    return true
  }
  return role === adminRoleForSite[site]
}

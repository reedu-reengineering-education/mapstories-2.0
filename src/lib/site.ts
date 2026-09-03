import { Site } from '@prisma/client'

// Domain of the BFDW white-label deployment, e.g. "bfdw.mapstories.de".
// This module is shared by server code (pages/api, Server Components) and
// client components, so it must use the NEXT_PUBLIC_ variable — plain
// process.env.BFDW_DOMAIN is inlined as `undefined` in the browser bundle.
const BFDW_DOMAIN =
  process.env.NEXT_PUBLIC_BFDW_DOMAIN ?? process.env.BFDW_DOMAIN

export function getSiteFromHost(host?: string | null): Site {
  if (!host || !BFDW_DOMAIN) {
    return Site.MAIN
  }
  const hostname = host.split(':')[0].toLowerCase()
  return hostname === BFDW_DOMAIN.toLowerCase() ? Site.BFDW : Site.MAIN
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

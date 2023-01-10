import { NextRequest, NextResponse } from 'next/server'
import acceptLanguage from 'accept-language'
import { fallbackLng, languages } from './app/i18n/settings'
import { getToken } from 'next-auth/jwt'

export const config = {
  matcher: ['/:lng*', '/studio/(.*)', '/login'],
}

const authRoutes = ['/studio', '/login']

export default async function middleware(req: NextRequest) {
  if (authRoutes.some(r => req.nextUrl.pathname.startsWith(r))) {
    return authMiddleware(req)
  }
  return i18nMiddleware(req)
}

const authMiddleware = async (req: NextRequest) => {
  const token = await getToken({ req })
  const isAuth = !!token

  const lng = getLng(req)

  if (isAuth) {
    if (req.nextUrl.pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL(`/${lng}/studio`, req.url))
    }
    return NextResponse.redirect(
      new URL(`/${lng}${req.nextUrl.pathname}`, req.url),
    )
  }

  let from = req.nextUrl.pathname
  if (req.nextUrl.search) {
    from += req.nextUrl.search
  }

  if (!req.nextUrl.pathname.includes('login')) {
    return NextResponse.redirect(
      new URL(`/${lng}/login?from=${encodeURIComponent(from)}`, req.url),
    )
  }

  return NextResponse.redirect(new URL(`/${lng}/login`, req.url))
}

acceptLanguage.languages(languages)
const cookieName = 'i18next'
const i18nMiddleware = (req: NextRequest) => {
  if (
    req.nextUrl.pathname.indexOf('icon') > -1 ||
    req.nextUrl.pathname.indexOf('chrome') > -1 ||
    req.nextUrl.pathname.indexOf('api') > -1
  ) {
    return NextResponse.next()
  }
  const lng = getLng(req)

  // Redirect if lng in path is not supported
  if (
    !languages.some(loc => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith('/_next')
  ) {
    return NextResponse.redirect(
      new URL(`/${lng}${req.nextUrl.pathname}`, req.url),
    )
  }

  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer')!)
    const lngInReferer = languages.find(l =>
      refererUrl.pathname.startsWith(`/${l}`),
    )
    const response = NextResponse.next()
    if (lngInReferer) {
      response.cookies.set(cookieName, lngInReferer)
    }
    return response
  }

  return NextResponse.next()
}

const getLng = (req: NextRequest): string => {
  if (req.cookies.has(cookieName)) {
    return acceptLanguage.get(req.cookies.get(cookieName)?.value)!
  }
  const header = acceptLanguage.get(req.headers.get('Accept-Language'))
  if (header) {
    return header
  }
  return fallbackLng
}

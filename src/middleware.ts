import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { locales, defaultLocale } from '@/i18n/config'
import type { Locale } from '@/i18n/config'

const secretKey = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'abyte-admin-secret-key-change-in-production'
)

async function verifyAdminSession(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secretKey)
    return true
  } catch {
    return false
  }
}

function getLocaleFromHeaders(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale
  }

  const acceptLanguage = request.headers.get('Accept-Language')
  if (acceptLanguage) {
    const preferred = acceptLanguage.split(',')[0].split('-')[0].toLowerCase()
    if (locales.includes(preferred as Locale)) {
      return preferred as Locale
    }
  }

  return defaultLocale
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle admin routes
  if (pathname.startsWith('/admin')) {
    const sessionToken = request.cookies.get('admin_session')?.value
    const isAuthenticated = sessionToken ? await verifyAdminSession(sessionToken) : false
    const isLoginPage = pathname === '/admin/login'

    if (isLoginPage) {
      // If already authenticated, redirect to dashboard
      if (isAuthenticated) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      return NextResponse.next()
    }

    // All other /admin routes require auth
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    return NextResponse.next()
  }

  // Handle i18n routes (existing logic)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    const locale = pathname.split('/')[1] as Locale
    const response = NextResponse.next()
    response.cookies.set('NEXT_LOCALE', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
    return response
  }

  const locale = getLocaleFromHeaders(request)
  const newUrl = new URL(`/${locale}${pathname}`, request.url)
  const response = NextResponse.redirect(newUrl)
  response.cookies.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
  return response
}

export const config = {
  matcher: [
    '/((?!_next|api|favicon.ico|apple-touch-icon.png|og.png|images|abyte-logo.png|.*\\..*).*)',
  ],
}

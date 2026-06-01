import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { createHash } from 'crypto'

function hashVisitor(ip: string, userAgent: string): string {
  return createHash('sha256').update(`${ip}:${userAgent}`).digest('hex').slice(0, 16)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, path, referrer, deviceType, browser, ttfb, fcp, lcp, dcl, loadTime } = body

    if (!url || !path) {
      return new NextResponse(null, { status: 204 })
    }

    // Skip admin pages
    if (path.startsWith('/admin')) {
      return new NextResponse(null, { status: 204 })
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown'
    const ua = request.headers.get('user-agent') || ''
    const visitorId = hashVisitor(ip, ua)

    // Deduplicate: skip if same visitor + path in last 30 minutes
    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000)
    const existing = await prisma.pageView.findFirst({
      where: {
        visitorId,
        path,
        createdAt: { gte: thirtyMinAgo },
      },
      select: { id: true },
    })

    if (existing) {
      return new NextResponse(null, { status: 204 })
    }

    await prisma.pageView.create({
      data: {
        url,
        path,
        referrer: referrer || null,
        visitorId,
        userAgent: ua || null,
        deviceType: deviceType || null,
        browser: browser || null,
        ttfb: ttfb != null ? Math.round(ttfb) : null,
        fcp: fcp != null ? Math.round(fcp) : null,
        lcp: lcp != null ? Math.round(lcp) : null,
        dcl: dcl != null ? Math.round(dcl) : null,
        loadTime: loadTime != null ? Math.round(loadTime) : null,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch {
    return new NextResponse(null, { status: 204 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminRequest } from '@/lib/auth'

export const dynamic = 'force-dynamic'
import {
  getAnalyticsOverview,
  getViewsOverTime,
  getTopArticles,
  getTopReferrers,
  getDeviceBreakdown,
  getPerformanceOverTime,
  getRecentPageViews,
  type DateRange,
} from '@/lib/analytics'

export async function GET(request: NextRequest) {
  const admin = await verifyAdminRequest(request.headers.get('cookie'))
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const range = (request.nextUrl.searchParams.get('range') || '30d') as DateRange
  if (!['7d', '30d', '90d'].includes(range)) {
    return NextResponse.json({ error: 'Invalid range' }, { status: 400 })
  }

  const [overview, viewsOverTime, topArticles, topReferrers, deviceBreakdown, performanceOverTime, recentViews] =
    await Promise.all([
      getAnalyticsOverview(range),
      getViewsOverTime(range),
      getTopArticles(range),
      getTopReferrers(range),
      getDeviceBreakdown(range),
      getPerformanceOverTime(range),
      getRecentPageViews(50),
    ])

  return NextResponse.json({
    overview,
    viewsOverTime,
    topArticles,
    topReferrers,
    deviceBreakdown,
    performanceOverTime,
    recentViews,
  })
}

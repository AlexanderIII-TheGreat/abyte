import prisma from './db'

export type DateRange = '7d' | '30d' | '90d'

function getRangeDate(range: DateRange): Date {
  const days = range === '7d' ? 7 : range === '90d' ? 90 : 30
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000)
}

export async function getAnalyticsOverview(range: DateRange) {
  const since = getRangeDate(range)

  const [totalViews, uniqueVisitors, perfAgg] = await Promise.all([
    prisma.pageView.count({ where: { createdAt: { gte: since } } }),
    prisma.pageView.findMany({
      where: { createdAt: { gte: since } },
      select: { visitorId: true },
      distinct: ['visitorId'],
    }),
    prisma.pageView.aggregate({
      where: { createdAt: { gte: since } },
      _avg: { ttfb: true, fcp: true, lcp: true, dcl: true, loadTime: true },
    }),
  ])

  return {
    totalViews,
    uniqueVisitors: uniqueVisitors.length,
    avgTtfb: Math.round(perfAgg._avg.ttfb ?? 0),
    avgFcp: Math.round(perfAgg._avg.fcp ?? 0),
    avgLcp: Math.round(perfAgg._avg.lcp ?? 0),
    avgDcl: Math.round(perfAgg._avg.dcl ?? 0),
    avgLoadTime: Math.round(perfAgg._avg.loadTime ?? 0),
  }
}

export async function getViewsOverTime(range: DateRange) {
  const since = getRangeDate(range)

  const views = await prisma.pageView.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true, visitorId: true },
    orderBy: { createdAt: 'asc' },
  })

  const dayMap = new Map<string, { views: number; visitors: Set<string> }>()

  for (const v of views) {
    const day = v.createdAt.toISOString().slice(0, 10)
    if (!dayMap.has(day)) {
      dayMap.set(day, { views: 0, visitors: new Set() })
    }
    const entry = dayMap.get(day)!
    entry.views++
    entry.visitors.add(v.visitorId)
  }

  return Array.from(dayMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, data]) => ({
      date,
      views: data.views,
      visitors: data.visitors.size,
    }))
}

export async function getTopArticles(range: DateRange, limit = 10) {
  const since = getRangeDate(range)

  const grouped = await prisma.pageView.groupBy({
    by: ['path'],
    where: {
      createdAt: { gte: since },
      path: { contains: '/articles/' },
    },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: limit,
  })

  // Extract slug from path and fetch titles
  const results = await Promise.all(
    grouped.map(async (g: { path: string; _count: { id: number } }) => {
      const slug = g.path.split('/').pop() || ''
      const article = await prisma.article.findUnique({
        where: { slug },
        select: {
          translations: {
            where: { languageCode: 'en' },
            select: { title: true },
            take: 1,
          },
        },
      })
      return {
        path: g.path,
        title: article?.translations[0]?.title || slug,
        views: g._count.id,
      }
    })
  )

  return results
}

export async function getTopReferrers(range: DateRange, limit = 10) {
  const since = getRangeDate(range)

  const views = await prisma.pageView.findMany({
    where: { createdAt: { gte: since } },
    select: { referrer: true },
  })

  const referrerMap = new Map<string, number>()

  for (const v of views) {
    let category = 'Direct'
    if (v.referrer) {
      try {
        const hostname = new URL(v.referrer).hostname.replace('www.', '')
        if (hostname.includes('google')) category = 'Google'
        else if (hostname.includes('bing')) category = 'Bing'
        else if (hostname.includes('yahoo')) category = 'Yahoo'
        else if (hostname.includes('duckduckgo')) category = 'DuckDuckGo'
        else if (hostname.includes('twitter') || hostname.includes('x.com')) category = 'Twitter/X'
        else if (hostname.includes('facebook')) category = 'Facebook'
        else if (hostname.includes('instagram')) category = 'Instagram'
        else if (hostname.includes('linkedin')) category = 'LinkedIn'
        else if (hostname.includes('reddit')) category = 'Reddit'
        else if (hostname.includes('github')) category = 'GitHub'
        else category = hostname
      } catch {
        category = 'Other'
      }
    }
    referrerMap.set(category, (referrerMap.get(category) || 0) + 1)
  }

  return Array.from(referrerMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([referrer, count]) => ({ referrer, count }))
}

export async function getDeviceBreakdown(range: DateRange) {
  const since = getRangeDate(range)

  const grouped = await prisma.pageView.groupBy({
    by: ['deviceType'],
    where: { createdAt: { gte: since } },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
  })

  return grouped.map((g) => ({
    device: g.deviceType || 'unknown',
    count: g._count.id,
  }))
}

export async function getPerformanceOverTime(range: DateRange) {
  const since = getRangeDate(range)

  const views = await prisma.pageView.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true, ttfb: true, fcp: true, lcp: true },
    orderBy: { createdAt: 'asc' },
  })

  const dayMap = new Map<string, { ttfb: number[]; fcp: number[]; lcp: number[] }>()

  for (const v of views) {
    const day = v.createdAt.toISOString().slice(0, 10)
    if (!dayMap.has(day)) {
      dayMap.set(day, { ttfb: [], fcp: [], lcp: [] })
    }
    const entry = dayMap.get(day)!
    if (v.ttfb != null) entry.ttfb.push(v.ttfb)
    if (v.fcp != null) entry.fcp.push(v.fcp)
    if (v.lcp != null) entry.lcp.push(v.lcp)
  }

  const avg = (arr: number[]) => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0

  return Array.from(dayMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, data]) => ({
      date,
      ttfb: avg(data.ttfb),
      fcp: avg(data.fcp),
      lcp: avg(data.lcp),
    }))
}

export async function getRecentPageViews(limit = 50) {
  return prisma.pageView.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      url: true,
      path: true,
      referrer: true,
      deviceType: true,
      browser: true,
      loadTime: true,
      ttfb: true,
      createdAt: true,
    },
  })
}

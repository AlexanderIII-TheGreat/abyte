'use client'

import { useEffect } from 'react'

function getDeviceType(): string {
  if (typeof navigator === 'undefined') return 'unknown'
  const ua = navigator.userAgent
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet'
  if (/mobile|iphone|ipod|android.*mobile|windows phone/i.test(ua)) return 'mobile'
  return 'desktop'
}

function getBrowser(): string {
  if (typeof navigator === 'undefined') return 'unknown'
  const ua = navigator.userAgent
  if (ua.includes('Firefox/')) return 'Firefox'
  if (ua.includes('Edg/')) return 'Edge'
  if (ua.includes('Chrome/')) return 'Chrome'
  if (ua.includes('Safari/')) return 'Safari'
  return 'Other'
}

export function AnalyticsScript() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.location.pathname.startsWith('/admin')) return
    if (navigator.doNotTrack === '1') return

    const path = window.location.pathname
    const url = window.location.href
    const referrer = document.referrer || null
    const deviceType = getDeviceType()
    const browser = getBrowser()

    let ttfb: number | null = null
    let fcp: number | null = null
    let lcp: number | null = null
    let dcl: number | null = null
    let loadTime: number | null = null

    // Navigation timing for TTFB and DCL
    const navEntries = performance.getEntriesByType('navigation')
    if (navEntries.length > 0) {
      const nav = navEntries[0] as PerformanceNavigationTiming
      ttfb = Math.round(nav.responseStart - nav.requestStart)
      dcl = Math.round(nav.domContentLoadedEventEnd - nav.startTime)
      loadTime = Math.round(nav.loadEventEnd - nav.startTime)
    }

    // PerformanceObserver for FCP
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            fcp = Math.round(entry.startTime)
          }
        }
      })
      fcpObserver.observe({ type: 'paint', buffered: true })
    } catch {
      // PerformanceObserver not supported
    }

    // PerformanceObserver for LCP
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        if (entries.length > 0) {
          lcp = Math.round(entries[entries.length - 1].startTime)
        }
      })
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
    } catch {
      // PerformanceObserver not supported
    }

    function send() {
      const data = {
        url,
        path,
        referrer,
        deviceType,
        browser,
        ttfb,
        fcp,
        lcp,
        dcl,
        loadTime,
      }

      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })

      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/track', blob)
      } else {
        fetch('/api/analytics/track', {
          method: 'POST',
          body: JSON.stringify(data),
          keepalive: true,
          headers: { 'Content-Type': 'application/json' },
        }).catch(() => {})
      }
    }

    // Send on page unload
    window.addEventListener('pagehide', send)

    // Also send after load completes (for SPA navigations that don't trigger pagehide quickly)
    if (document.readyState === 'complete') {
      setTimeout(send, 3000)
    } else {
      window.addEventListener('load', () => setTimeout(send, 3000))
    }

    return () => {
      window.removeEventListener('pagehide', send)
    }
  }, [])

  return null
}

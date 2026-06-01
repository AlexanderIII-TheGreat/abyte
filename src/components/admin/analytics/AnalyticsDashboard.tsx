'use client'

import { useState, useEffect, useCallback } from 'react'
import '@/lib/chart-config'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

type DateRange = '7d' | '30d' | '90d'

interface AnalyticsData {
  overview: {
    totalViews: number
    uniqueVisitors: number
    avgTtfb: number
    avgFcp: number
    avgLcp: number
    avgDcl: number
    avgLoadTime: number
  }
  viewsOverTime: { date: string; views: number; visitors: number }[]
  topArticles: { path: string; title: string; views: number }[]
  topReferrers: { referrer: string; count: number }[]
  deviceBreakdown: { device: string; count: number }[]
  performanceOverTime: { date: string; ttfb: number; fcp: number; lcp: number }[]
  recentViews: {
    url: string
    path: string
    referrer: string | null
    deviceType: string | null
    browser: string | null
    loadTime: number | null
    ttfb: number | null
    createdAt: string
  }[]
}

const RANGE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: '7d', label: '7 Hari' },
  { value: '30d', label: '30 Hari' },
  { value: '90d', label: '90 Hari' },
]

function formatMs(ms: number): string {
  if (ms <= 0) return '-'
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function getLoadTimeColor(ms: number): string {
  if (ms <= 0) return 'text-gray-400'
  if (ms < 1500) return 'text-emerald-600'
  if (ms < 3000) return 'text-amber-600'
  return 'text-red-600'
}

function getLoadTimeBg(ms: number): string {
  if (ms <= 0) return 'bg-gray-50'
  if (ms < 1500) return 'bg-emerald-50'
  if (ms < 3000) return 'bg-amber-50'
  return 'bg-red-50'
}

const CHART_COLORS = {
  primary: 'rgb(37, 99, 235)',
  primaryLight: 'rgba(37, 99, 235, 0.1)',
  emerald: 'rgb(16, 185, 129)',
  emeraldLight: 'rgba(16, 185, 129, 0.1)',
  amber: 'rgb(245, 158, 11)',
  red: 'rgb(239, 68, 68)',
  purple: 'rgb(168, 85, 247)',
  pink: 'rgb(236, 72, 153)',
  indigo: 'rgb(99, 102, 241)',
}

const DOUGHNUT_COLORS = [
  'rgb(37, 99, 235)',
  'rgb(16, 185, 129)',
  'rgb(245, 158, 11)',
  'rgb(239, 68, 68)',
  'rgb(168, 85, 247)',
  'rgb(236, 72, 153)',
  'rgb(99, 102, 241)',
  'rgb(156, 163, 175)',
]

export function AnalyticsDashboard() {
  const [range, setRange] = useState<DateRange>('30d')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async (r: DateRange) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/analytics?range=${r}`)
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData(range)
  }, [range, fetchData])

  const handleRangeChange = (r: DateRange) => {
    setRange(r)
  }

  if (loading && !data) {
    return (
      <div>
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-display font-bold text-gray-900">Analytics</h2>
          <p className="text-sm text-gray-500 mt-1">Memuat data...</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Gagal memuat data analytics</p>
      </div>
    )
  }

  const { overview, viewsOverTime, topArticles, topReferrers, deviceBreakdown, performanceOverTime, recentViews } = data

  // Chart data
  const viewsChartData = {
    labels: viewsOverTime.map((d) => {
      const date = new Date(d.date)
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    }),
    datasets: [
      {
        label: 'Page Views',
        data: viewsOverTime.map((d) => d.views),
        borderColor: CHART_COLORS.primary,
        backgroundColor: CHART_COLORS.primaryLight,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
      {
        label: 'Unique Visitors',
        data: viewsOverTime.map((d) => d.visitors),
        borderColor: CHART_COLORS.emerald,
        backgroundColor: CHART_COLORS.emeraldLight,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  }

  const perfChartData = {
    labels: performanceOverTime.map((d) => {
      const date = new Date(d.date)
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    }),
    datasets: [
      {
        label: 'TTFB',
        data: performanceOverTime.map((d) => d.ttfb),
        borderColor: CHART_COLORS.emerald,
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 2,
      },
      {
        label: 'FCP',
        data: performanceOverTime.map((d) => d.fcp),
        borderColor: CHART_COLORS.primary,
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 2,
      },
      {
        label: 'LCP',
        data: performanceOverTime.map((d) => d.lcp),
        borderColor: CHART_COLORS.amber,
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 2,
      },
    ],
  }

  const articlesChartData = {
    labels: topArticles.slice(0, 8).map((a) => {
      const title = a.title
      return title.length > 35 ? title.slice(0, 35) + '...' : title
    }),
    datasets: [
      {
        label: 'Views',
        data: topArticles.slice(0, 8).map((a) => a.views),
        backgroundColor: CHART_COLORS.primary,
        borderRadius: 6,
      },
    ],
  }

  const referrerChartData = {
    labels: topReferrers.slice(0, 7).map((r) => r.referrer),
    datasets: [
      {
        data: topReferrers.slice(0, 7).map((r) => r.count),
        backgroundColor: DOUGHNUT_COLORS.slice(0, 7),
        borderWidth: 0,
      },
    ],
  }

  const deviceChartData = {
    labels: deviceBreakdown.map((d) => d.device.charAt(0).toUpperCase() + d.device.slice(1)),
    datasets: [
      {
        data: deviceBreakdown.map((d) => d.count),
        backgroundColor: DOUGHNUT_COLORS.slice(0, deviceBreakdown.length),
        borderWidth: 0,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 10,
        cornerRadius: 8,
        titleFont: { size: 12 },
        bodyFont: { size: 12 },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 }, color: '#9ca3af' },
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.04)' },
        ticks: { font: { size: 11 }, color: '#9ca3af' },
      },
    },
  }

  const lineChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: { usePointStyle: true, pointStyle: 'circle', padding: 20, font: { size: 12 } },
      },
    },
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { usePointStyle: true, pointStyle: 'circle', padding: 16, font: { size: 12 } },
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 10,
        cornerRadius: 8,
      },
    },
  }

  const statCards = [
    {
      label: 'Total Views',
      value: overview.totalViews.toLocaleString('id-ID'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Unique Visitors',
      value: overview.uniqueVisitors.toLocaleString('id-ID'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
      gradient: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      label: 'Avg Load Time',
      value: formatMs(overview.avgLoadTime),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: overview.avgLoadTime < 1500 ? 'from-emerald-500 to-emerald-600' : overview.avgLoadTime < 3000 ? 'from-amber-500 to-amber-600' : 'from-red-500 to-red-600',
      bgColor: getLoadTimeBg(overview.avgLoadTime),
      textColor: getLoadTimeColor(overview.avgLoadTime),
    },
    {
      label: 'Avg TTFB',
      value: formatMs(overview.avgTtfb),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
      gradient: overview.avgTtfb < 200 ? 'from-emerald-500 to-emerald-600' : overview.avgTtfb < 500 ? 'from-amber-500 to-amber-600' : 'from-red-500 to-red-600',
      bgColor: overview.avgTtfb < 200 ? 'bg-emerald-50' : overview.avgTtfb < 500 ? 'bg-amber-50' : 'bg-red-50',
      textColor: overview.avgTtfb < 200 ? 'text-emerald-600' : overview.avgTtfb < 500 ? 'text-amber-600' : 'text-red-600',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-display font-bold text-gray-900">Analytics</h2>
          <p className="text-sm text-gray-500 mt-1">Performa website dan traffic pengunjung</p>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleRangeChange(opt.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                range === opt.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-sm`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Performance Metrics Detail */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 md:mb-8">
        {[
          { label: 'FCP', value: overview.avgFcp, good: 1800, warn: 3000 },
          { label: 'LCP', value: overview.avgLcp, good: 2500, warn: 4000 },
          { label: 'DCL', value: overview.avgDcl, good: 1500, warn: 3000 },
          { label: 'Load Time', value: overview.avgLoadTime, good: 1500, warn: 3000 },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">{m.label}</p>
            <p className={`text-lg font-bold ${getLoadTimeColor(m.value)}`}>{formatMs(m.value)}</p>
            <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  m.value <= 0 ? 'bg-gray-300 w-0' :
                  m.value <= m.good ? 'bg-emerald-500' :
                  m.value <= m.warn ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: m.value <= 0 ? '0%' : `${Math.min(100, (m.value / (m.warn * 1.5)) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Views Over Time Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="font-medium text-gray-900 mb-4">Traffic Over Time</h3>
        <div className="h-72">
          {viewsOverTime.length > 0 ? (
            <Line data={viewsChartData} options={lineChartOptions} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              Belum ada data
            </div>
          )}
        </div>
      </div>

      {/* Two-column: Top Articles + Referrers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Articles */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-medium text-gray-900 mb-4">Artikel Terpopuler</h3>
          <div className="h-72">
            {topArticles.length > 0 ? (
              <Bar
                data={articlesChartData}
                options={{
                  ...chartOptions,
                  indexAxis: 'y' as const,
                  scales: {
                    x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 11 } } },
                    y: { grid: { display: false }, ticks: { font: { size: 11 } } },
                  },
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Belum ada data
              </div>
            )}
          </div>
        </div>

        {/* Referrer Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-medium text-gray-900 mb-4">Sumber Traffic</h3>
          <div className="h-72">
            {topReferrers.length > 0 ? (
              <Doughnut data={referrerChartData} options={doughnutOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Belum ada data
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Over Time + Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-medium text-gray-900 mb-4">Performa Load Time</h3>
          <div className="h-64">
            {performanceOverTime.length > 0 ? (
              <Line data={perfChartData} options={lineChartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Belum ada data
              </div>
            )}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-medium text-gray-900 mb-4">Device</h3>
          <div className="h-64">
            {deviceBreakdown.length > 0 ? (
              <Doughnut data={deviceChartData} options={doughnutOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Belum ada data
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Page Views Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-medium text-gray-900">Recent Page Views</h3>
        </div>
        {recentViews.length === 0 ? (
          <div className="px-5 py-12 text-center text-gray-400 text-sm">
            Belum ada data page view
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Halaman</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 hidden md:table-cell">Referrer</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 hidden sm:table-cell">Device</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Load</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 hidden lg:table-cell">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentViews.map((v, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-[300px]">{v.path}</p>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <span className="text-gray-500 truncate max-w-[150px] inline-block">
                        {v.referrer ? (() => {
                          try { return new URL(v.referrer).hostname.replace('www.', '') } catch { return v.referrer }
                        })() : 'Direct'}
                      </span>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <span className="inline-flex items-center gap-1 text-gray-500">
                        {v.deviceType === 'mobile' ? '📱' : v.deviceType === 'tablet' ? '📱' : '💻'}
                        {v.deviceType || '-'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`font-mono text-xs ${getLoadTimeColor(v.loadTime ?? 0)}`}>
                        {v.loadTime ? formatMs(v.loadTime) : '-'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs hidden lg:table-cell">
                      {new Date(v.createdAt).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

interface SeoCheck {
  id: string
  label: string
  status: 'pass' | 'warn' | 'fail'
  detail: string
}

interface SeoChecklistProps {
  title: string
  description: string
  slug: string
  content: string
  coverImage: string
  coverImageAlt: string
  categoryId: string
  authorId: string
  tags: string
  activeTab: 'en' | 'id'
}

function analyzeSeo(props: SeoChecklistProps): SeoCheck[] {
  const { title, description, slug, content, coverImage, coverImageAlt, categoryId, authorId, tags } = props
  const checks: SeoCheck[] = []

  // 1. Title length
  const titleLen = title.length
  if (titleLen === 0) {
    checks.push({ id: 'title', label: 'Judul', status: 'fail', detail: 'Judul belum diisi' })
  } else if (titleLen >= 40 && titleLen <= 65) {
    checks.push({ id: 'title', label: 'Judul', status: 'pass', detail: `${titleLen} karakter (ideal: 40-65)` })
  } else if (titleLen >= 30 && titleLen <= 80) {
    checks.push({ id: 'title', label: 'Judul', status: 'warn', detail: `${titleLen} karakter — idealnya 40-65 agar tidak terpotong di Google` })
  } else {
    checks.push({ id: 'title', label: 'Judul', status: 'fail', detail: `${titleLen} karakter — ${titleLen < 30 ? 'terlalu pendek' : 'terlalu panjang, akan terpotong di Google'}` })
  }

  // 2. Meta description
  const descLen = description.length
  if (descLen === 0) {
    checks.push({ id: 'desc', label: 'Deskripsi', status: 'fail', detail: 'Deskripsi belum diisi — Google akan membuat sendiri' })
  } else if (descLen >= 120 && descLen <= 165) {
    checks.push({ id: 'desc', label: 'Deskripsi', status: 'pass', detail: `${descLen} karakter (ideal: 120-165)` })
  } else if (descLen >= 80 && descLen <= 200) {
    checks.push({ id: 'desc', label: 'Deskripsi', status: 'warn', detail: `${descLen} karakter — idealnya 120-165` })
  } else {
    checks.push({ id: 'desc', label: 'Deskripsi', status: 'fail', detail: `${descLen} karakter — ${descLen < 80 ? 'terlalu pendek' : 'terlalu panjang'}` })
  }

  // 3. Slug
  if (!slug) {
    checks.push({ id: 'slug', label: 'Slug', status: 'fail', detail: 'Slug belum diisi' })
  } else if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length >= 3 && slug.length <= 80) {
    checks.push({ id: 'slug', label: 'Slug', status: 'pass', detail: `/${slug}` })
  } else if (slug.length > 80) {
    checks.push({ id: 'slug', label: 'Slug', status: 'warn', detail: 'Slug terlalu panjang — idealnya di bawah 80 karakter' })
  } else {
    checks.push({ id: 'slug', label: 'Slug', status: 'warn', detail: 'Slug sebaiknya hanya huruf kecil, angka, dan dash' })
  }

  // 4. Cover image
  if (!coverImage) {
    checks.push({ id: 'cover', label: 'Cover Image', status: 'warn', detail: 'Tanpa cover image — artikel kurang menarik di social media' })
  } else if (!coverImageAlt || coverImageAlt.trim().length < 5) {
    checks.push({ id: 'cover', label: 'Cover Image', status: 'warn', detail: 'Cover image ada tapi alt text belum diisi — Google tidak bisa "lihat" gambar' })
  } else {
    checks.push({ id: 'cover', label: 'Cover Image', status: 'pass', detail: 'Alt text sudah diisi' })
  }

  // 5. Content length
  const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length
  if (wordCount === 0) {
    checks.push({ id: 'content', label: 'Konten', status: 'fail', detail: 'Konten belum diisi' })
  } else if (wordCount >= 300) {
    checks.push({ id: 'content', label: 'Konten', status: 'pass', detail: `${wordCount} kata (minimal 300)` })
  } else if (wordCount >= 150) {
    checks.push({ id: 'content', label: 'Konten', status: 'warn', detail: `${wordCount} kata — idealnya minimal 300 kata untuk ranking lebih baik` })
  } else {
    checks.push({ id: 'content', label: 'Konten', status: 'fail', detail: `${wordCount} kata — terlalu pendek, Google menganggap kurang informatif` })
  }

  // 6. Internal links
  const internalLinks = (content.match(/\[.*?\]\(\/.*?\)/g) || []).length
  if (wordCount > 0 && internalLinks === 0) {
    checks.push({ id: 'links', label: 'Internal Link', status: 'warn', detail: 'Tidak ada link ke artikel lain — tambahkan untuk bantu Google crawl' })
  } else if (internalLinks > 0) {
    checks.push({ id: 'links', label: 'Internal Link', status: 'pass', detail: `${internalLinks} internal link ditemukan` })
  }

  // 7. Category
  if (!categoryId) {
    checks.push({ id: 'category', label: 'Kategori', status: 'fail', detail: 'Kategori belum dipilih — penting untuk struktur website' })
  } else {
    checks.push({ id: 'category', label: 'Kategori', status: 'pass', detail: 'Kategori sudah dipilih' })
  }

  // 8. Author
  if (!authorId) {
    checks.push({ id: 'author', label: 'Author', status: 'fail', detail: 'Author belum dipilih — Google perlu tahu siapa penulisnya' })
  } else {
    checks.push({ id: 'author', label: 'Author', status: 'pass', detail: 'Author sudah dipilih' })
  }

  // 9. Tags
  const tagList = tags.split(',').map(t => t.trim()).filter(Boolean)
  if (tagList.length === 0) {
    checks.push({ id: 'tags', label: 'Tags', status: 'warn', detail: 'Belum ada tags — bantu Google memahami topik artikel' })
  } else if (tagList.length >= 2 && tagList.length <= 8) {
    checks.push({ id: 'tags', label: 'Tags', status: 'pass', detail: `${tagList.length} tags` })
  } else if (tagList.length > 8) {
    checks.push({ id: 'tags', label: 'Tags', status: 'warn', detail: `${tagList.length} tags — terlalu banyak, idealnya 3-8` })
  } else {
    checks.push({ id: 'tags', label: 'Tags', status: 'pass', detail: `${tagList.length} tag — tambah lebih banyak untuk hasil lebih baik` })
  }

  return checks
}

const statusIcons = {
  pass: (
    <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warn: (
    <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  fail: (
    <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

export function SeoChecklist(props: SeoChecklistProps) {
  const checks = analyzeSeo(props)
  const passCount = checks.filter(c => c.status === 'pass').length
  const totalCount = checks.length
  const hasFail = checks.some(c => c.status === 'fail')
  const hasWarn = checks.some(c => c.status === 'warn')

  const scorePercent = Math.round((passCount / totalCount) * 100)
  const scoreColor = scorePercent >= 80 ? 'text-emerald-600' : scorePercent >= 50 ? 'text-amber-600' : 'text-red-600'
  const scoreBg = scorePercent >= 80 ? 'bg-emerald-500' : scorePercent >= 50 ? 'bg-amber-500' : 'bg-red-500'
  const scoreLabel = scorePercent >= 80 ? 'Baik' : scorePercent >= 50 ? 'Perlu Perbaikan' : 'Kurang'

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">SEO Checklist</h3>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${scoreColor}`}>{passCount}/{totalCount}</span>
          <span className="text-xs text-gray-400">|</span>
          <span className={`text-xs font-medium ${scoreColor}`}>{scoreLabel}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all duration-500 ${scoreBg}`}
          style={{ width: `${scorePercent}%` }}
        />
      </div>

      {/* Check list */}
      <div className="space-y-2.5">
        {checks.map((check) => (
          <div key={check.id} className="flex items-start gap-2.5">
            {statusIcons[check.status]}
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-700 leading-tight">{check.label}</p>
              <p className="text-xs text-gray-500 leading-snug mt-0.5">{check.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary hint */}
      {(hasFail || hasWarn) && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {hasFail && 'Perbaiki item yang merah untuk hasil SEO lebih baik.'}
            {hasFail && hasWarn && ' '}
            {hasWarn && 'Item kuning bersifat opsional tapi sangat disarankan.'}
          </p>
        </div>
      )}
    </div>
  )
}

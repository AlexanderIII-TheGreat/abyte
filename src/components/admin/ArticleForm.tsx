'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { SeoChecklist } from './SeoChecklist'

interface Category {
  id: string
  slug: string
  name: string
}

interface Author {
  id: string
  name: string
}

interface ArticleData {
  id?: string
  slug?: string
  coverImage?: string
  featured?: boolean
  datePublished?: string
  categoryId?: string
  authorId?: string
  translations?: Array<{
    languageCode: string
    title: string
    description: string
    content: string
    coverImageAlt: string
    readingTime: string
  }>
  tags?: string[]
}

interface ArticleFormProps {
  initialData?: ArticleData
  categories: Category[]
  authors: Author[]
}

export function ArticleForm({ initialData, categories, authors }: ArticleFormProps) {
  const router = useRouter()
  const isEdit = !!initialData?.id

  const [slug, setSlug] = useState(initialData?.slug || '')
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '')
  const [featured, setFeatured] = useState(initialData?.featured || false)
  const [datePublished, setDatePublished] = useState(
    initialData?.datePublished ? new Date(initialData.datePublished).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  )
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '')
  const [authorId, setAuthorId] = useState(initialData?.authorId || '')
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '')

  // EN translations
  const [enTitle, setEnTitle] = useState(initialData?.translations?.find(t => t.languageCode === 'en')?.title || '')
  const [enDesc, setEnDesc] = useState(initialData?.translations?.find(t => t.languageCode === 'en')?.description || '')
  const [enContent, setEnContent] = useState(initialData?.translations?.find(t => t.languageCode === 'en')?.content || '')
  const [enReadingTime, setEnReadingTime] = useState(initialData?.translations?.find(t => t.languageCode === 'en')?.readingTime || '5 min')
  const [enCoverImageAlt, setEnCoverImageAlt] = useState(initialData?.translations?.find(t => t.languageCode === 'en')?.coverImageAlt || '')

  // ID translations
  const [idTitle, setIdTitle] = useState(initialData?.translations?.find(t => t.languageCode === 'id')?.title || '')
  const [idDesc, setIdDesc] = useState(initialData?.translations?.find(t => t.languageCode === 'id')?.description || '')
  const [idContent, setIdContent] = useState(initialData?.translations?.find(t => t.languageCode === 'id')?.content || '')
  const [idReadingTime, setIdReadingTime] = useState(initialData?.translations?.find(t => t.languageCode === 'id')?.readingTime || '5 min')
  const [idCoverImageAlt, setIdCoverImageAlt] = useState(initialData?.translations?.find(t => t.languageCode === 'id')?.coverImageAlt || '')

  const [activeTab, setActiveTab] = useState<'en' | 'id'>('en')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [compressionInfo, setCompressionInfo] = useState<{
    original: string; compressed: string; savings: string
    originalName: string; originalFormat: string; outputFormat: string
    width: number; height: number; quality: number
  } | null>(null)
  const [showInfo, setShowInfo] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-generate slug from EN title
  useEffect(() => {
    if (!isEdit && enTitle && !slug) {
      setSlug(
        enTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      )
    }
  }, [enTitle, isEdit, slug])

  const handleFileUpload = async (file: File) => {
    setError('')
    setCompressionInfo(null)
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Gagal mengupload file')
        return
      }
      const data = await res.json()
      setCoverImage(data.url)
      if (data.originalSize && data.compressedSize && data.info) {
        setCompressionInfo({
          original: formatBytes(data.originalSize),
          compressed: formatBytes(data.compressedSize),
          savings: data.savings,
          originalName: data.info.originalName,
          originalFormat: data.info.originalFormat,
          outputFormat: data.info.outputFormat,
          width: data.info.width,
          height: data.info.height,
          quality: data.info.quality,
        })
      }
    } catch {
      setError('Terjadi kesalahan saat upload')
    } finally {
      setUploading(false)
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileUpload(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) handleFileUpload(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const payload = {
      slug,
      coverImage,
      featured,
      datePublished,
      categoryId,
      authorId: isEdit ? undefined : authorId,
      enTitle,
      enDescription: enDesc,
      enContent,
      enReadingTime,
      enCoverImageAlt: enCoverImageAlt || enTitle,
      idTitle,
      idDescription: idDesc,
      idContent,
      idReadingTime,
      idCoverImageAlt: idCoverImageAlt || idTitle,
      tags,
    }

    try {
      const url = isEdit ? `/api/admin/articles/${initialData!.id}` : '/api/admin/articles'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Gagal menyimpan')
        return
      }

      router.push('/admin/articles')
      router.refresh()
    } catch {
      setError('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {/* SEO Checklist */}
      <SeoChecklist
        title={activeTab === 'en' ? enTitle : idTitle}
        description={activeTab === 'en' ? enDesc : idDesc}
        slug={slug}
        content={activeTab === 'en' ? enContent : idContent}
        coverImage={coverImage}
        coverImageAlt={activeTab === 'en' ? enCoverImageAlt : idCoverImageAlt}
        categoryId={categoryId}
        authorId={authorId}
        tags={tags}
        activeTab={activeTab}
      />

      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-medium text-gray-900 mb-4">Informasi Dasar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              placeholder="article-slug"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Image</label>
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  placeholder="https://... atau upload file"
                />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 shrink-0"
              >
                {uploading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Upload...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    Pilih File
                  </>
                )}
              </button>
              {coverImage && (
                <>
                  {/* Info button */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowInfo(!showInfo)}
                      className="px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
                      title="Info foto"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                      </svg>
                    </button>
                    {/* Info popover */}
                    {showInfo && compressionInfo && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-20">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Info Foto</h4>
                          <button
                            type="button"
                            onClick={() => setShowInfo(false)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Nama file</span>
                            <span className="text-gray-900 font-medium truncate ml-2 max-w-[140px]" title={compressionInfo.originalName}>{compressionInfo.originalName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Format asli</span>
                            <span className="text-gray-900 font-medium">{compressionInfo.originalFormat}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Format output</span>
                            <span className="text-gray-900 font-medium">{compressionInfo.outputFormat}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Dimensi</span>
                            <span className="text-gray-900 font-medium">{compressionInfo.width} x {compressionInfo.height}px</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Quality</span>
                            <span className="text-gray-900 font-medium">{compressionInfo.quality}%</span>
                          </div>
                          <div className="border-t border-gray-100 pt-2 mt-2">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Ukuran asli</span>
                              <span className="text-gray-900 font-medium">{compressionInfo.original}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Ukuran terkompres</span>
                              <span className="text-green-600 font-medium">{compressionInfo.compressed}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Penghematan</span>
                              <span className="text-green-600 font-bold">-{compressionInfo.savings}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => { setCoverImage(''); setCompressionInfo(null); setShowInfo(false); }}
                    className="px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </>
              )}
            </div>
            {/* Drop zone + Preview */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="mt-3"
            >
              {coverImage ? (
                <div className="relative w-full max-w-xs">
                  <img
                    src={coverImage}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg border border-gray-200"
                  />
                  {compressionInfo && (
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span className="text-gray-500">{compressionInfo.original}</span>
                      <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                      <span className="font-medium text-green-600">{compressionInfo.compressed}</span>
                      <span className="text-green-500 bg-green-50 px-1.5 py-0.5 rounded-full font-medium">
                        -{compressionInfo.savings}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center w-full max-w-xs h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-center">
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-1" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5H3.75a1.5 1.5 0 0 0-1.5 1.5v14.25a1.5 1.5 0 0 0 1.5 1.5Z" />
                    </svg>
                    <p className="text-xs text-gray-500">Drag & drop atau klik untuk upload</p>
                    <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, GIF, WebP - Max 10MB (auto-compressed)</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            >
              <option value="">Pilih kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Author</label>
            <select
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
              required={!isEdit}
              disabled={isEdit}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm disabled:bg-gray-100"
            >
              <option value="">Pilih author</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal Publish</label>
            <input
              type="date"
              value={datePublished}
              onChange={(e) => setDatePublished(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags (pisahkan koma)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              placeholder="nextjs, react, typescript"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">
              Artikel Featured
            </label>
          </div>
        </div>
      </div>

      {/* Translations */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-1 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('en')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'en' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('id')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'id' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Indonesia
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul</label>
            <input
              type="text"
              value={activeTab === 'en' ? enTitle : idTitle}
              onChange={(e) => activeTab === 'en' ? setEnTitle(e.target.value) : setIdTitle(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi</label>
            <textarea
              value={activeTab === 'en' ? enDesc : idDesc}
              onChange={(e) => activeTab === 'en' ? setEnDesc(e.target.value) : setIdDesc(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Konten (Markdown)</label>
            <textarea
              value={activeTab === 'en' ? enContent : idContent}
              onChange={(e) => activeTab === 'en' ? setEnContent(e.target.value) : setIdContent(e.target.value)}
              rows={12}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Reading Time</label>
            <input
              type="text"
              value={activeTab === 'en' ? enReadingTime : idReadingTime}
              onChange={(e) => activeTab === 'en' ? setEnReadingTime(e.target.value) : setIdReadingTime(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              placeholder="5 min"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Image Alt Text</label>
            <input
              type="text"
              value={activeTab === 'en' ? enCoverImageAlt : idCoverImageAlt}
              onChange={(e) => activeTab === 'en' ? setEnCoverImageAlt(e.target.value) : setIdCoverImageAlt(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              placeholder="Deskripsi singkat gambar untuk Google"
            />
            <p className="text-xs text-gray-400 mt-1">Google menggunakan ini untuk memahami isi gambar</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Menyimpan...' : isEdit ? 'Update' : 'Buat Artikel'}
        </button>
      </div>
    </form>
  )
}

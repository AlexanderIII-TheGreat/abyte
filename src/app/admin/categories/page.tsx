'use client'

import { useState, useEffect } from 'react'

interface CategoryTranslation {
  languageCode: string
  name: string
  description: string
}

interface Category {
  id: string
  slug: string
  translations: CategoryTranslation[]
  _count: { articles: number }
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [slug, setSlug] = useState('')
  const [enName, setEnName] = useState('')
  const [enDesc, setEnDesc] = useState('')
  const [idName, setIdName] = useState('')
  const [idDesc, setIdDesc] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchCategories = async () => {
    const res = await fetch('/api/admin/categories')
    const data = await res.json()
    setCategories(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const resetForm = () => {
    setSlug('')
    setEnName('')
    setEnDesc('')
    setIdName('')
    setIdDesc('')
    setEditId(null)
    setShowForm(false)
    setError('')
  }

  const handleEdit = (cat: Category) => {
    setEditId(cat.id)
    setSlug(cat.slug)
    setEnName(cat.translations.find(t => t.languageCode === 'en')?.name || '')
    setEnDesc(cat.translations.find(t => t.languageCode === 'en')?.description || '')
    setIdName(cat.translations.find(t => t.languageCode === 'id')?.name || '')
    setIdDesc(cat.translations.find(t => t.languageCode === 'id')?.description || '')
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    const payload = {
      slug,
      enName,
      enDescription: enDesc,
      idName,
      idDescription: idDesc,
    }

    try {
      const url = editId ? `/api/admin/categories/${editId}` : '/api/admin/categories'
      const method = editId ? 'PUT' : 'POST'

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

      resetForm()
      fetchCategories()
    } catch {
      setError('Terjadi kesalahan')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setDeleteId(null)
        fetchCategories()
      } else {
        const data = await res.json()
        alert(data.error || 'Gagal menghapus')
      }
    } catch {
      alert('Terjadi kesalahan')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const getTranslation = (cat: Category, lang: string) =>
    cat.translations.find(t => t.languageCode === lang)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-display font-bold text-gray-900">Kategori</h2>
          <p className="text-sm text-gray-500 mt-1">{categories.length} kategori</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors text-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="hidden sm:inline">Kategori Baru</span>
          <span className="sm:hidden">Baru</span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h3 className="font-medium text-gray-900 mb-4">
            {editId ? 'Edit Kategori' : 'Kategori Baru'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                placeholder="category-slug"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama (EN)</label>
                <input
                  type="text"
                  value={enName}
                  onChange={(e) => setEnName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama (ID)</label>
                <input
                  type="text"
                  value={idName}
                  onChange={(e) => setIdName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi (EN)</label>
                <textarea
                  value={enDesc}
                  onChange={(e) => setEnDesc(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi (ID)</label>
                <textarea
                  value={idDesc}
                  onChange={(e) => setIdDesc(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors text-sm disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : editId ? 'Update' : 'Buat'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Empty State */}
      {categories.length === 0 && !showForm && (
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-16 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Belum ada kategori</h3>
          <p className="text-sm text-gray-500 mb-4">Buat kategori pertama untuk mengorganisir artikel</p>
          <button
            onClick={() => { resetForm(); setShowForm(true) }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Buat Kategori
          </button>
        </div>
      )}

      {/* Desktop Table */}
      {categories.length > 0 && (
        <>
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Nama (EN)</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Nama (ID)</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Artikel</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat) => {
                  const en = getTranslation(cat, 'en')
                  const id = getTranslation(cat, 'id')
                  return (
                    <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5 text-sm font-mono text-gray-600">{cat.slug}</td>
                      <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{en?.name ?? cat.slug}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-700">{id?.name ?? cat.slug}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{cat._count.articles}</td>
                      <td className="px-5 py-3.5 text-right">
                        {deleteId === cat.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-xs text-gray-600">Yakin?</span>
                            <button
                              onClick={() => handleDelete(cat.id)}
                              disabled={deleting}
                              className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                              {deleting ? '...' : 'Hapus'}
                            </button>
                            <button
                              onClick={() => setDeleteId(null)}
                              className="px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(cat)}
                              className="px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteId(cat.id)}
                              className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            >
                              Hapus
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {categories.map((cat) => {
              const en = getTranslation(cat, 'en')
              const id = getTranslation(cat, 'id')
              return (
                <div key={cat.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">{en?.name ?? cat.slug}</p>
                      <p className="text-xs text-gray-500 mt-0.5 font-mono">/{cat.slug}</p>
                    </div>
                    <span className="flex-shrink-0 inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                      {cat._count.articles} artikel
                    </span>
                  </div>
                  {id && (
                    <p className="text-xs text-gray-500 mt-2">ID: {id.name}</p>
                  )}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                    {deleteId === cat.id ? (
                      <>
                        <span className="text-xs text-gray-600 flex-1">Yakin hapus?</span>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          disabled={deleting}
                          className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          {deleting ? '...' : 'Ya'}
                        </button>
                        <button
                          onClick={() => setDeleteId(null)}
                          className="px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          Batal
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(cat)}
                          className="flex-1 text-center px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(cat.id)}
                          className="flex-1 text-center px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          Hapus
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

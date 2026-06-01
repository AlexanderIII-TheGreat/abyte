'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function DeleteArticleButton({ articleId }: { articleId: string }) {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/articles/${articleId}`, { method: 'DELETE' })
      if (res.ok) {
        router.push('/admin/articles')
        router.refresh()
      }
    } catch {
      alert('Gagal menghapus artikel')
    } finally {
      setLoading(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-2.5 py-1.5 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {loading ? '...' : 'Hapus'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          Batal
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
    >
      Hapus
    </button>
  )
}

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyAdminRequest } from '@/lib/auth'

// PUT /api/admin/categories/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdminRequest(request.headers.get('cookie'))
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const { enName, enDescription, idName, idDescription } = body

    const existing = await prisma.category.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Kategori tidak ditemukan' }, { status: 404 })
    }

    // Update translations
    for (const [lang, name, desc] of [
      ['en', enName, enDescription],
      ['id', idName, idDescription],
    ] as const) {
      if (name) {
        await prisma.categoryTranslation.upsert({
          where: { categoryId_languageCode: { categoryId: id, languageCode: lang } },
          update: { name, description: desc || '' },
          create: { categoryId: id, languageCode: lang, name, description: desc || '' },
        })
      }
    }

    const updated = await prisma.category.findUnique({
      where: { id },
      include: { translations: true },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Gagal mengupdate kategori' }, { status: 500 })
  }
}

// DELETE /api/admin/categories/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdminRequest(request.headers.get('cookie'))
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params

    const existing = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { articles: true } } },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Kategori tidak ditemukan' }, { status: 404 })
    }

    if (existing._count.articles > 0) {
      return NextResponse.json(
        { error: `Kategori masih memiliki ${existing._count.articles} artikel. Hapus artikel terlebih dahulu.` },
        { status: 400 }
      )
    }

    await prisma.category.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Gagal menghapus kategori' }, { status: 500 })
  }
}

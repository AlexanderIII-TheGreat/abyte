import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyAdminRequest } from '@/lib/auth'

// GET /api/admin/articles/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdminRequest(request.headers.get('cookie'))
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        translations: true,
        tags: { include: { tag: { include: { translations: true } } } },
      },
    })

    if (!article) {
      return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json({ error: 'Gagal mengambil artikel' }, { status: 500 })
  }
}

// PUT /api/admin/articles/[id]
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
    const {
      slug, coverImage, featured, categoryId, datePublished,
      enTitle, enDescription, enContent, enReadingTime, enCoverImageAlt,
      idTitle, idDescription, idContent, idReadingTime, idCoverImageAlt,
      tags,
    } = body

    // Check article exists
    const existing = await prisma.article.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 })
    }

    // Check slug uniqueness (if changed)
    if (slug && slug !== existing.slug) {
      const slugTaken = await prisma.article.findUnique({ where: { slug } })
      if (slugTaken) {
        return NextResponse.json({ error: 'Slug sudah digunakan' }, { status: 400 })
      }
    }

    // Update article
    await prisma.article.update({
      where: { id },
      data: {
        slug: slug || existing.slug,
        coverImage: coverImage ?? existing.coverImage,
        featured: featured ?? existing.featured,
        categoryId: categoryId || existing.categoryId,
        ...(datePublished ? { datePublished: new Date(datePublished) } : {}),
      },
    })

    // Update translations
    for (const [lang, title, desc, content, readingTime, coverImageAlt] of [
      ['en', enTitle, enDescription, enContent, enReadingTime, enCoverImageAlt],
      ['id', idTitle, idDescription, idContent, idReadingTime, idCoverImageAlt],
    ] as const) {
      if (title) {
        await prisma.articleTranslation.upsert({
          where: { articleId_languageCode: { articleId: id, languageCode: lang } },
          update: {
            title,
            description: desc || '',
            content: content || '',
            coverImageAlt: coverImageAlt || title,
            readingTime: readingTime || (lang === 'en' ? '5 min read' : '5 menit baca'),
          },
          create: {
            articleId: id,
            languageCode: lang,
            title,
            description: desc || '',
            content: content || '',
            coverImageAlt: coverImageAlt || title,
            readingTime: readingTime || (lang === 'en' ? '5 min read' : '5 menit baca'),
          },
        })
      }
    }

    // Update tags
    if (tags !== undefined) {
      const tagNames = tags
        ? tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        : []

      // Remove old tags
      await prisma.articleTag.deleteMany({ where: { articleId: id } })

      // Add new tags
      for (const tagName of tagNames) {
        const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

        const tag = await prisma.tag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: { slug: tagSlug },
        })

        for (const lang of ['en', 'id'] as const) {
          await prisma.tagTranslation.upsert({
            where: { tagId_languageCode: { tagId: tag.id, languageCode: lang } },
            update: { name: tagName },
            create: { tagId: tag.id, languageCode: lang, name: tagName },
          })
        }

        await prisma.articleTag.create({
          data: { articleId: id, tagId: tag.id },
        })
      }
    }

    const updated = await prisma.article.findUnique({
      where: { id },
      include: { translations: true },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json({ error: 'Gagal mengupdate artikel' }, { status: 500 })
  }
}

// DELETE /api/admin/articles/[id]
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

    const existing = await prisma.article.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 })
    }

    await prisma.article.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json({ error: 'Gagal menghapus artikel' }, { status: 500 })
  }
}

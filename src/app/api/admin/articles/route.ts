import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyAdminRequest } from '@/lib/auth'

// GET /api/admin/articles - List all articles
export async function GET(request: NextRequest) {
  const admin = await verifyAdminRequest(request.headers.get('cookie'))
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const articles = await prisma.article.findMany({
      orderBy: { datePublished: 'desc' },
      include: {
        translations: true,
        category: { include: { translations: true } },
      },
    })
    return NextResponse.json(articles)
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json({ error: 'Gagal mengambil artikel' }, { status: 500 })
  }
}

// POST /api/admin/articles - Create new article
export async function POST(request: NextRequest) {
  const admin = await verifyAdminRequest(request.headers.get('cookie'))
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      slug, coverImage, featured, categoryId, authorId, datePublished,
      enTitle, enDescription, enContent, enReadingTime, enCoverImageAlt,
      idTitle, idDescription, idContent, idReadingTime, idCoverImageAlt,
      tags,
    } = body

    // Validate required fields
    if (!slug || !categoryId || !enTitle || !idTitle) {
      return NextResponse.json({ error: 'Slug, kategori, dan judul harus diisi' }, { status: 400 })
    }

    // Check slug uniqueness
    const existing = await prisma.article.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: 'Slug sudah digunakan' }, { status: 400 })
    }

    // Get author - use provided authorId or fall back to first author
    let author
    if (authorId) {
      author = await prisma.author.findUnique({ where: { id: authorId } })
    }
    if (!author) {
      author = await prisma.author.findFirst()
    }
    if (!author) {
      return NextResponse.json({ error: 'Author tidak ditemukan' }, { status: 500 })
    }

    // Parse tags
    const tagNames = tags
      ? tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      : []

    const article = await prisma.article.create({
      data: {
        slug,
        coverImage: coverImage || '',
        featured: featured || false,
        categoryId,
        authorId: author.id,
        ...(datePublished ? { datePublished: new Date(datePublished) } : {}),
        translations: {
          createMany: {
            data: [
              {
                languageCode: 'en',
                title: enTitle,
                description: enDescription || '',
                content: enContent || '',
                coverImageAlt: enCoverImageAlt || enTitle,
                readingTime: enReadingTime || '5 min read',
              },
              {
                languageCode: 'id',
                title: idTitle,
                description: idDescription || '',
                content: idContent || '',
                coverImageAlt: idCoverImageAlt || idTitle,
                readingTime: idReadingTime || '5 menit baca',
              },
            ],
          },
        },
      },
    })

    // Create tags
    for (const tagName of tagNames) {
      const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

      const tag = await prisma.tag.upsert({
        where: { slug: tagSlug },
        update: {},
        create: { slug: tagSlug },
      })

      // Upsert translations
      for (const lang of ['en', 'id'] as const) {
        await prisma.tagTranslation.upsert({
          where: { tagId_languageCode: { tagId: tag.id, languageCode: lang } },
          update: { name: tagName },
          create: { tagId: tag.id, languageCode: lang, name: tagName },
        })
      }

      await prisma.articleTag.create({
        data: { articleId: article.id, tagId: tag.id },
      })
    }

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json({ error: 'Gagal membuat artikel' }, { status: 500 })
  }
}

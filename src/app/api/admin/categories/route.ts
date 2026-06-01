import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyAdminRequest } from '@/lib/auth'

// GET /api/admin/categories
export async function GET(request: NextRequest) {
  const admin = await verifyAdminRequest(request.headers.get('cookie'))
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const categories = await prisma.category.findMany({
      include: {
        translations: true,
        _count: { select: { articles: true } },
      },
      orderBy: { slug: 'asc' },
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Gagal mengambil kategori' }, { status: 500 })
  }
}

// POST /api/admin/categories
export async function POST(request: NextRequest) {
  const admin = await verifyAdminRequest(request.headers.get('cookie'))
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { slug, enName, enDescription, idName, idDescription } = body

    if (!slug || !enName || !idName) {
      return NextResponse.json({ error: 'Slug dan nama harus diisi' }, { status: 400 })
    }

    // Check slug uniqueness
    const existing = await prisma.category.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: 'Slug sudah digunakan' }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: {
        slug,
        translations: {
          createMany: {
            data: [
              {
                languageCode: 'en',
                name: enName,
                description: enDescription || '',
              },
              {
                languageCode: 'id',
                name: idName,
                description: idDescription || '',
              },
            ],
          },
        },
      },
      include: { translations: true },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Gagal membuat kategori' }, { status: 500 })
  }
}

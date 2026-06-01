import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import { enArticles } from '../src/lib/articles/en'
import { idArticles } from '../src/lib/articles/id'
import { AUTHOR } from '../src/lib/constants'

const connectionString = (process.env.DIRECT_URL || process.env.DATABASE_URL) as string
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Memulai seeding database...')

  // 1. Seed Author & Terjemahannya (idempotent)
  console.log('Seeding Author...')
  let author = await prisma.author.findFirst({ where: { name: AUTHOR.name } })
  if (!author) {
    author = await prisma.author.create({
      data: {
        name: AUTHOR.name,
        avatar: AUTHOR.avatar,
        url: AUTHOR.url,
      },
    })
  } else {
    author = await prisma.author.update({
      where: { id: author.id },
      data: { avatar: AUTHOR.avatar, url: AUTHOR.url },
    })
  }

  for (const lang of ['en', 'id'] as const) {
    await prisma.authorTranslation.upsert({
      where: { authorId_languageCode: { authorId: author.id, languageCode: lang } },
      update: { role: AUTHOR.role, bio: AUTHOR.bio },
      create: { authorId: author.id, languageCode: lang, role: AUTHOR.role, bio: AUTHOR.bio },
    })
  }
  console.log(`Author '${author.name}' selesai (ID: ${author.id})`)

  // 2. Ekstrak Kategori Unik dari Artikel
  console.log('Ekstraksi Kategori...')
  const categoryMap = new Map<string, { slug: string; enName: string; enDesc: string; idName: string; idDesc: string }>()

  enArticles.forEach((enArt) => {
    if (!categoryMap.has(enArt.category.slug)) {
      const idArt = idArticles.find((x) => x.id === enArt.id)
      categoryMap.set(enArt.category.slug, {
        slug: enArt.category.slug,
        enName: enArt.category.name,
        enDesc: enArt.category.description,
        idName: idArt?.category.name ?? enArt.category.name,
        idDesc: idArt?.category.description ?? enArt.category.description,
      })
    }
  })

  const categories = Array.from(categoryMap.values())
  console.log(`Ditemukan ${categories.length} kategori unik`)

  // 3. Seed Kategori & Terjemahannya (idempotent)
  console.log('Seeding Kategori...')
  const categoryRecords = new Map<string, string>()
  for (const cat of categories) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { slug: cat.slug },
    })
    categoryRecords.set(cat.slug, record.id)

    for (const [lang, name, desc] of [
      ['en', cat.enName, cat.enDesc],
      ['id', cat.idName, cat.idDesc],
    ] as const) {
      await prisma.categoryTranslation.upsert({
        where: { categoryId_languageCode: { categoryId: record.id, languageCode: lang } },
        update: { name, description: desc },
        create: { categoryId: record.id, languageCode: lang, name, description: desc },
      })
    }
    console.log(`  Kategori '${cat.slug}' selesai`)
  }

  // 4. Seed Artikel & Terjemahannya (idempotent)
  console.log('Seeding Artikel...')
  for (const enArt of enArticles) {
    const catId = categoryRecords.get(enArt.category.slug)
    if (!catId) {
      console.log(`  Peringatan: Kategori '${enArt.category.slug}' tidak ditemukan untuk artikel '${enArt.slug}'`)
      continue
    }

    const article = await prisma.article.upsert({
      where: { slug: enArt.slug },
      update: {
        coverImage: enArt.coverImage,
        featured: enArt.featured,
        datePublished: new Date(enArt.datePublished),
        dateModified: new Date(enArt.dateModified),
        authorId: author.id,
        categoryId: catId,
      },
      create: {
        slug: enArt.slug,
        coverImage: enArt.coverImage,
        featured: enArt.featured,
        datePublished: new Date(enArt.datePublished),
        dateModified: new Date(enArt.dateModified),
        authorId: author.id,
        categoryId: catId,
      },
    })

    const idArt = idArticles.find((x) => x.id === enArt.id)

    for (const [lang, data] of [
      ['en', enArt],
      ['id', idArt ?? enArt],
    ] as const) {
      await prisma.articleTranslation.upsert({
        where: { articleId_languageCode: { articleId: article.id, languageCode: lang } },
        update: {
          title: data.title,
          description: data.description,
          content: data.content,
          coverImageAlt: data.coverImageAlt,
          readingTime: data.readingTime,
        },
        create: {
          articleId: article.id,
          languageCode: lang,
          title: data.title,
          description: data.description,
          content: data.content,
          coverImageAlt: data.coverImageAlt,
          readingTime: data.readingTime,
        },
      })
    }

    // 5. Seed Tags untuk Artikel ini (idempotent)
    // Hapus relasi tag lama agar sinkron dengan data terbaru
    await prisma.articleTag.deleteMany({ where: { articleId: article.id } })

    for (let i = 0; i < enArt.tags.length; i++) {
      const tagName = enArt.tags[i]
      const idTagName = idArt?.tags[i] ?? tagName
      const tagSlug = tagName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      const tag = await prisma.tag.upsert({
        where: { slug: tagSlug },
        update: {},
        create: { slug: tagSlug },
      })

      for (const [lang, name] of [
        ['en', tagName],
        ['id', idTagName],
      ] as const) {
        await prisma.tagTranslation.upsert({
          where: { tagId_languageCode: { tagId: tag.id, languageCode: lang } },
          update: { name },
          create: { tagId: tag.id, languageCode: lang, name },
        })
      }

      await prisma.articleTag.create({
        data: { articleId: article.id, tagId: tag.id },
      })
    }

    console.log(`  Artikel '${enArt.slug}' selesai dengan ${enArt.tags.length} tags`)
  }

  // 6. Seed Admin (idempotent)
  console.log('Seeding Admin...')
  const adminEmail = 'admin@abyte.id'
  const adminPassword = 'abyte132109#'
  const passwordHash = await bcrypt.hash(adminPassword, 12)

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: 'Admin' },
    create: { email: adminEmail, passwordHash, name: 'Admin' },
  })
  console.log(`  Admin '${adminEmail}' selesai`)

  console.log('\nSeeding selesai!')
}

main()
  .catch((e) => {
    console.error('Terjadi error saat seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

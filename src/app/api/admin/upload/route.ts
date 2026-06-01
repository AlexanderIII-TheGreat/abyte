import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminRequest } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB (before compression)
const WEBP_QUALITY = 80

export async function POST(request: NextRequest) {
  const admin = await verifyAdminRequest(request.headers.get('cookie'))
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipe file tidak didukung. Gunakan JPG, PNG, GIF, atau WebP' },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Ukuran file maksimal 10MB' },
        { status: 400 }
      )
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    const inputBuffer = Buffer.from(await file.arrayBuffer())
    const originalSize = inputBuffer.length

    // Get original image metadata
    const metadata = await sharp(inputBuffer).metadata()

    // Compress to WebP
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const outputFilename = `${timestamp}-${random}.webp`

    const compressedBuffer = await sharp(inputBuffer)
      .webp({
        quality: WEBP_QUALITY,
        effort: 4,
        smartSubsample: true,
      })
      .toBuffer()

    const compressedSize = compressedBuffer.length
    const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1)

    await writeFile(path.join(uploadsDir, outputFilename), compressedBuffer)

    return NextResponse.json({
      url: `/uploads/${outputFilename}`,
      originalSize,
      compressedSize,
      savings: `${savings}%`,
      info: {
        originalName: file.name,
        originalFormat: metadata.format?.toUpperCase() || 'UNKNOWN',
        outputFormat: 'WebP',
        width: metadata.width || 0,
        height: metadata.height || 0,
        quality: WEBP_QUALITY,
      },
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Gagal mengupload file' }, { status: 500 })
  }
}

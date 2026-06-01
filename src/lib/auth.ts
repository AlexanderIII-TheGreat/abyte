import { SignJWT, jwtVerify } from 'jose'
import { compare } from 'bcryptjs'
import prisma from './db'

const secretKey = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'abyte-admin-secret-key-change-in-production'
)

const COOKIE_NAME = 'admin_session'

export async function signToken(payload: { sub: string; email: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey)
    return payload as { sub: string; email: string }
  } catch {
    return null
  }
}

export async function verifyAdmin(email: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { email } })
  if (!admin) return null

  const valid = await compare(password, admin.passwordHash)
  if (!valid) return null

  return { id: admin.id, email: admin.email, name: admin.name }
}

export async function getAdminFromToken(token: string) {
  const payload = await verifyToken(token)
  if (!payload) return null

  const admin = await prisma.admin.findUnique({ where: { id: payload.sub } })
  if (!admin) return null

  return { id: admin.id, email: admin.email, name: admin.name }
}

export async function verifyAdminRequest(cookieHeader: string | null) {
  if (!cookieHeader) return null

  const token = cookieHeader
    .split(';')
    .map(c => c.trim())
    .find(c => c.startsWith(`${COOKIE_NAME}=`))
    ?.split('=')[1]

  if (!token) return null

  return getAdminFromToken(token)
}

export { COOKIE_NAME }

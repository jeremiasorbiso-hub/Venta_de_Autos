import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'tu-secret-super-seguro-cambiar-en-produccion')

export async function generateToken(userId: string): Promise<string> {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(secret)
}

export async function verifyToken(token: string): Promise<string | null> {
  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload.userId as string
  } catch {
    return null
  }
}
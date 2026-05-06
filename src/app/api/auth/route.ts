import { NextRequest, NextResponse } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'
import { users, hashPassword, verifyPassword } from '@/lib/inMemoryDb'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'tu-secret-super-seguro-cambiar-en-produccion')

async function generateToken(userId: string): Promise<string> {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(secret)
}

 async function verifyToken(token: string): Promise<string | null> {
  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload.userId as string
  } catch {
    return null
  }
}

// ─── REGISTRO ───────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const { action } = Object.fromEntries(new URL(request.url).searchParams)

  if (action === 'register') {
    try {
      const { email, password, nombre } = await request.json()

      if (!email || !password || !nombre) {
        return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
      }

      // Validar que el email no existe
      if (users.find(u => u.email === email)) {
        return NextResponse.json({ error: 'El email ya está registrado' }, { status: 400 })
      }

      // Validar contraseña (mínimo 8 caracteres)
      if (password.length < 8) {
        return NextResponse.json({ error: 'La contraseña debe tener al menos 8 caracteres' }, { status: 400 })
      }

      // Crear usuario
      const newUser = {
        id: 'user-' + Date.now(),
        email,
        passwordHash: hashPassword(password),
        nombre,
        rol: 'usuario',
        createdAt: new Date().toISOString()
      }

      users.push(newUser)
      const token = await generateToken(newUser.id)

      return NextResponse.json(
        {
          message: 'Registro exitoso',
          user: { id: newUser.id, email: newUser.email, nombre: newUser.nombre, rol: newUser.rol },
          token
        },
        { status: 201 }
      )
    } catch (error) {
      console.error('Error en registro:', error)
      return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
  }

  // ─── LOGIN ────────────────────────────────────────────────────────────────
  if (action === 'login') {
    try {
      const { email, password } = await request.json()

      if (!email || !password) {
        return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 })
      }

      const user = users.find(u => u.email === email)

      if (!user || !verifyPassword(password, user.passwordHash)) {
        return NextResponse.json({ error: 'Email o contraseña incorrectos' }, { status: 401 })
      }

      const token = await generateToken(user.id)

      return NextResponse.json({
        message: 'Login exitoso',
        user: { id: user.id, email: user.email, nombre: user.nombre, rol: user.rol },
        token
      })
    } catch (error) {
      console.error('Error en login:', error)
      return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
  }

  return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })
}
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/app/api/auth/route'
import { autos } from '@/lib/inMemoryDb'

function getAutos() {
  return autos
}

export async function GET(request: NextRequest) {
  try {
    // Verificar que es admin
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Se requiere autenticación' }, { status: 401 })
    }

    const userId = await verifyToken(token)
    if (!userId) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    // En producción, verificar que es admin
    // const user = getUserById(userId)
    // if (user?.rol !== 'admin') {
    //   return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    // }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'pendiente'

    // Obtener autos filtrados por estado de aprobación
    const autosEnRevision = getAutos().filter(a => a.aprobacion === status)

    return NextResponse.json({ autos: autosEnRevision })
  } catch (error) {
    console.error('Error fetching autos for review:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Se requiere autenticación' }, { status: 401 })
    }

    const userId = await verifyToken(token)
    if (!userId) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const { autoId, accion, razon } = await request.json()

    if (!autoId || !accion || !['aprobar', 'rechazar'].includes(accion)) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }

    // Buscar el auto
    const todoAutos = getAutos()
    const autoIndex = todoAutos.findIndex(a => a.id === autoId)

    if (autoIndex === -1) {
      return NextResponse.json({ error: 'Auto no encontrado' }, { status: 404 })
    }

    const auto = todoAutos[autoIndex]

    if (accion === 'aprobar') {
      auto.aprobacion = 'aprobado'
      auto.aprobadoEn = new Date().toISOString()
      auto.aprobadoPor = userId
    } else {
      auto.aprobacion = 'rechazado'
      auto.rechazadoEn = new Date().toISOString()
      auto.rechazadoPor = userId
      auto.razonRechazo = razon || 'Sin especificar'
    }

    return NextResponse.json({
      message: `Auto ${accion} correctamente`,
      auto
    })
  } catch (error) {
    console.error('Error updating auto status:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
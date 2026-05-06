import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/app/api/auth/route'
import { autos } from '@/lib/inMemoryDb'

export async function GET(request: NextRequest) {
  // Solo mostrar autos aprobados al público
  const autosAprobados = autos.filter(a => a.aprobacion === 'aprobado')
  return NextResponse.json({ autos: autosAprobados })
}

export async function POST(request: NextRequest) {
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

    const formData = await request.json()

    // Validar campos requeridos
    const requiredFields = ['marca', 'modelo', 'anio', 'kilometraje', 'combustible', 'transmision', 'precio_usd']
    for (const field of requiredFields) {
      if (!formData[field]) {
        return NextResponse.json({ error: `Campo requerido: ${field}` }, { status: 400 })
      }
    }

    // Crear nuevo auto en estado "pendiente_aprobacion"
    const nuevoAuto = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      marca: formData.marca,
      modelo: formData.modelo,
      version: formData.version || '',
      anio: parseInt(formData.anio),
      kilometraje: parseInt(formData.kilometraje),
      combustible: formData.combustible,
      transmision: formData.transmision,
      color: formData.color || '',
      precio_usd: parseInt(formData.precio_usd),
      estado: 'disponible',
      aprobacion: 'pendiente',
      descripcion: formData.descripcion || '',
      createdAt: new Date().toISOString()
    }

    autos.push(nuevoAuto)

    return NextResponse.json(
      {
        auto: nuevoAuto,
        message: 'Auto cargado. Esperando aprobación del administrador.'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating auto:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
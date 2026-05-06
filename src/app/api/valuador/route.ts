import { NextRequest, NextResponse } from 'next/server'

// Precios base por marca
const precios: { [key: string]: { base: number; factor: number } } = {
  Toyota: { base: 14000, factor: 1.15 },
  Volkswagen: { base: 11000, factor: 1.05 },
  Ford: { base: 10500, factor: 1.08 },
  Chevrolet: { base: 9500, factor: 1.0 },
  Renault: { base: 8500, factor: 0.95 },
  Peugeot: { base: 8800, factor: 0.97 },
  Honda: { base: 13500, factor: 1.12 },
  Fiat: { base: 8200, factor: 0.92 },
  Nissan: { base: 12000, factor: 1.08 },
  Jeep: { base: 19000, factor: 1.2 }
}

const anioActual = 2026

export async function POST(request: NextRequest) {
  try {
    const { marca, modelo, anio, km } = await request.json()

    if (!marca || !modelo || !anio || km === undefined) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    const p = precios[marca] || { base: 10000, factor: 1.0 }
    const edad = anioActual - anio
    const depreciacion = Math.max(0.35, 1 - edad * 0.07)
    const kmPenalty = 1 - (km * 0.002)
    const valorMid = Math.round(p.base * p.factor * depreciacion * kmPenalty)
    const valorMin = Math.round(valorMid * 0.88)
    const valorMax = Math.round(valorMid * 1.12)

    const fmt = (v: number) => 'USD $' + v.toLocaleString('es-AR')

    return NextResponse.json({
      rango: `${fmt(valorMin)} — ${fmt(valorMax)}`,
      fecha: new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }),
      meta: `Basado en ${marca} ${modelo} (${anio}) con ${km === 0 ? 'menos de 10.000 km' : 'más de ' + km + '.000 km'}. El valor final puede variar según estado, service al día y documentación completa.`
    })

  } catch (error) {
    console.error('Error in valuador API:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
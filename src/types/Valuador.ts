import { ValuadorResult } from '@/types'
import { createAdminClient } from '@/lib/supabase'

// ─── Precios base por marca (en USD) ─────────────────────────────────────────
const PRECIOS_BASE: Record<string, { base: number; factor: number; depreciacion_anual: number }> = {
  Toyota:     { base: 14000, factor: 1.15, depreciacion_anual: 0.06 },
  Volkswagen: { base: 11000, factor: 1.05, depreciacion_anual: 0.08 },
  Ford:       { base: 10500, factor: 1.08, depreciacion_anual: 0.08 },
  Chevrolet:  { base:  9500, factor: 1.00, depreciacion_anual: 0.09 },
  Renault:    { base:  8500, factor: 0.95, depreciacion_anual: 0.10 },
  Peugeot:    { base:  8800, factor: 0.97, depreciacion_anual: 0.10 },
  Honda:      { base: 13500, factor: 1.12, depreciacion_anual: 0.07 },
  Fiat:       { base:  8200, factor: 0.92, depreciacion_anual: 0.11 },
  Nissan:     { base: 12000, factor: 1.08, depreciacion_anual: 0.07 },
  Jeep:       { base: 19000, factor: 1.20, depreciacion_anual: 0.09 },
  Hyundai:    { base: 11500, factor: 1.03, depreciacion_anual: 0.08 },
  Kia:        { base: 11000, factor: 1.02, depreciacion_anual: 0.08 },
  Citroën:    { base:  8600, factor: 0.95, depreciacion_anual: 0.10 },
  Mercedes:   { base: 28000, factor: 1.30, depreciacion_anual: 0.10 },
  BMW:        { base: 26000, factor: 1.28, depreciacion_anual: 0.11 },
  Audi:       { base: 25000, factor: 1.25, depreciacion_anual: 0.11 },
}

// ─── Penalidad por kilometraje ────────────────────────────────────────────────
const KM_PENALTIES: Record<string, number> = {
  '0-10000':    0.00,
  '10001-30000': 0.05,
  '30001-60000': 0.12,
  '60001-90000': 0.20,
  '90001-120000': 0.28,
  '120001+':    0.38,
}

// ─── Margen del mercado (±%) ──────────────────────────────────────────────────
const MARGEN_INFERIOR = 0.88
const MARGEN_SUPERIOR = 1.12

export async function calcularValor(
  marca: string,
  modelo: string,
  anio: number,
  km_bucket: string
): Promise<ValuadorResult> {
  // 1. Intentar buscar en la base de datos primero
  try {
    const supabase = createAdminClient()
    const kmNumerico = km_bucket.split('-')[0].replace('+', '')
    const { data: dbPrice } = await supabase
      .from('precios_mercado')
      .select('*')
      .ilike('marca', marca)
      .lte('anio_desde', anio)
      .gte('anio_hasta', anio)
      .lte('km_desde', parseInt(kmNumerico))
      .gte('km_hasta', parseInt(kmNumerico) + 1)
      .order('actualizado_at', { ascending: false })
      .limit(1)
      .single()

    if (dbPrice) {
      return {
        marca,
        modelo,
        anio,
        km_bucket,
        precio_min: dbPrice.precio_min_usd,
        precio_max: dbPrice.precio_max_usd,
        precio_referencia: Math.round((dbPrice.precio_min_usd + dbPrice.precio_max_usd) / 2),
        fuente: 'base_datos',
        actualizado_at: dbPrice.actualizado_at,
        factores: {
          depreciacion_anual: 0,
          penalidad_km: 0,
          factor_marca: 0,
        },
      }
    }
  } catch {}

  // 2. Fallback al algoritmo
  const anioActual = new Date().getFullYear()
  const config = PRECIOS_BASE[marca] || { base: 10000, factor: 1.0, depreciacion_anual: 0.09 }
  const edad = anioActual - anio
  const depreciacion = Math.max(0.30, 1 - edad * config.depreciacion_anual)
  const penalidad_km = KM_PENALTIES[km_bucket] ?? 0.15
  const factor_km = 1 - penalidad_km

  const valorBase = config.base * config.factor * depreciacion * factor_km
  const precio_referencia = Math.round(valorBase / 100) * 100
  const precio_min = Math.round((precio_referencia * MARGEN_INFERIOR) / 100) * 100
  const precio_max = Math.round((precio_referencia * MARGEN_SUPERIOR) / 100) * 100

  return {
    marca,
    modelo,
    anio,
    km_bucket,
    precio_min,
    precio_max,
    precio_referencia,
    fuente: 'algoritmo',
    actualizado_at: new Date().toISOString(),
    factores: {
      depreciacion_anual: config.depreciacion_anual,
      penalidad_km,
      factor_marca: config.factor,
    },
  }
}

export function formatUSD(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}
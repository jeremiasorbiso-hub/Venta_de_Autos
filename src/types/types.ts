export interface ValuadorResult {
  marca: string
  modelo: string
  anio: number
  km_bucket: string
  precio_min: number
  precio_max: number
  precio_referencia: number
  fuente: 'base_datos' | 'algoritmo'
  actualizado_at: string
  factores: {
    depreciacion_anual: number
    penalidad_km: number
    factor_marca: number
  }
}

export interface Imagen {
  url: string
  alt?: string
  es_principal: boolean
}

export interface Auto {
  id: string
  marca: string
  modelo: string
  version?: string
  anio: number
  kilometraje: number
  combustible: string
  precio_usd: number
  estado: 'disponible' | 'reservado' | 'vendido'
  slug: string
  imagenes?: Imagen[]
  descripcion?: string
  informe_dominio_url?: string
  ficha_pdf_url?: string
  created_at: string
  updated_at: string
}
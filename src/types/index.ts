// ─── Database Types ───────────────────────────────────────────────────────────

export interface Auto {
  id: string
  created_at: string
  updated_at: string
  marca: string
  modelo: string
  version: string
  anio: number
  kilometraje: number
  combustible: 'nafta' | 'diesel' | 'gnc' | 'hibrido' | 'electrico'
  transmision: 'manual' | 'automatica' | 'cvt'
  color: string
  precio_usd: number
  precio_ars: number | null
  estado: 'disponible' | 'reservado' | 'vendido' | 'en_gestion'
  descripcion: string | null
  caracteristicas: string[]
  imagenes: AutoImagen[]
  checklist: ChecklistItem[]
  informe_dominio_url: string | null
  informe_infracciones_url: string | null
  ficha_pdf_url: string | null
  vendedor_id: string
  slug: string
  destacado: boolean
  vistas: number
  consultas_count: number
}

export interface AutoImagen {
  id: string
  auto_id: string
  url: string
  alt: string
  orden: number
  es_principal: boolean
}

export interface ChecklistItem {
  categoria: string
  item: string
  estado: 'ok' | 'observacion' | 'reparar'
  nota?: string
}

export interface Vendedor {
  id: string
  created_at: string
  nombre: string
  apellido: string
  telefono: string
  email: string
  panel_token: string
  autos?: Auto[]
}

export interface Consulta {
  id: string
  created_at: string
  auto_id: string
  nombre: string
  telefono: string
  mensaje: string
  leida: boolean
  auto?: Auto
}

export interface Vista {
  id: string
  created_at: string
  auto_id: string
  ip_hash: string
  user_agent: string | null
}

export interface BlogPost {
  id: string
  created_at: string
  titulo: string
  slug: string
  resumen: string
  contenido: string
  tag: string
  tiempo_lectura: number
  imagen_url: string | null
  publicado: boolean
  destacado: boolean
}

export interface PrecioMercado {
  id: string
  created_at: string
  marca: string
  modelo: string
  anio_desde: number
  anio_hasta: number
  km_desde: number
  km_hasta: number
  precio_min_usd: number
  precio_max_usd: number
  fuente: string
  actualizado_at: string
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

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

export interface PanelStats {
  auto: Auto
  vistas_total: number
  vistas_semana: number[]
  consultas_total: number
  consultas_recientes: Consulta[]
  interesados: number
}

// ─── Form Types ───────────────────────────────────────────────────────────────

export interface ValuadorForm {
  marca: string
  modelo: string
  anio: string
  km_bucket: string
  nombre?: string
  telefono?: string
}

export interface ContactoForm {
  nombre: string
  telefono: string
  mensaje: string
  auto_id: string
}

export interface PublicarAutoForm {
  nombre: string
  telefono: string
  email: string
  marca: string
  modelo: string
  anio: string
  kilometraje: string
  combustible: string
  precio_esperado: string
  descripcion: string
}

// ─── Component Props ──────────────────────────────────────────────────────────

export interface AutoCardProps {
  auto: Auto
  variant?: 'grid' | 'list' | 'featured'
}

export interface BadgeProps {
  estado: Auto['estado']
}
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, currency: 'USD' | 'ARS' = 'USD'): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-AR').format(value)
}

export function formatKm(km: number): string {
  return `${formatNumber(km)} km`
}

export function formatDate(date: string): string {
  return format(new Date(date), "d 'de' MMMM, yyyy", { locale: es })
}

export function formatRelativeDate(date: string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es })
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const clean = phone.replace(/\D/g, '')
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`
}

export function buildAutoWhatsApp(auto: { marca: string; modelo: string; anio: number; precio_usd: number }): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5493413000000'
  const msg = `Hola! Me interesa el ${auto.marca} ${auto.modelo} ${auto.anio} que está publicado en AutoGestión por USD ${formatNumber(auto.precio_usd)}. ¿Podemos coordinar para verlo?`
  return buildWhatsAppUrl(phone, msg)
}

export function getEstadoBadge(estado: string): { label: string; className: string } {
  const map: Record<string, { label: string; className: string }> = {
    disponible:  { label: 'Disponible',   className: 'badge-disponible' },
    reservado:   { label: 'Reservado',    className: 'badge-reservado' },
    vendido:     { label: 'Vendido',      className: 'badge-vendido' },
    en_gestion:  { label: 'Ingresó hoy',  className: 'badge-nuevo' },
  }
  return map[estado] || { label: estado, className: 'badge-disponible' }
}

export function generatePanelToken(vendedorId: string): string {
  const secret = process.env.PANEL_JWT_SECRET || 'fallback-secret'
  // Simple HMAC-like token (en producción usar jsonwebtoken)
  const payload = Buffer.from(JSON.stringify({ id: vendedorId, ts: Date.now() })).toString('base64url')
  return `${payload}.${Buffer.from(secret + vendedorId).toString('base64url').slice(0, 16)}`
}
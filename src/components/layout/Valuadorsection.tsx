'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { TrendingUp, Database, BarChart2, MessageCircle } from 'lucide-react'
import { ValuadorResult } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { buildWhatsAppUrl } from '@/lib/utils'

const schema = z.object({
  marca:     z.string().min(1, 'Seleccioná una marca'),
  modelo:    z.string().min(2, 'Ingresá el modelo'),
  anio:      z.string().min(1, 'Seleccioná el año'),
  km_bucket: z.string().min(1, 'Seleccioná el kilometraje'),
})

type FormData = z.infer<typeof schema>

const MARCAS = ['Toyota','Volkswagen','Ford','Chevrolet','Renault','Peugeot','Honda','Fiat','Nissan','Jeep','Hyundai','Kia','Citroën','Mercedes','BMW','Audi']
const ANIOS  = Array.from({ length: 15 }, (_, i) => 2024 - i)
const KM_BUCKETS = [
  { value: '0-10000',     label: '0 — 10.000 km' },
  { value: '10001-30000', label: '10.001 — 30.000 km' },
  { value: '30001-60000', label: '30.001 — 60.000 km' },
  { value: '60001-90000', label: '60.001 — 90.000 km' },
  { value: '90001-120000',label: '90.001 — 120.000 km' },
  { value: '120001+',     label: 'Más de 120.000 km' },
]

const HOW_ITEMS = [
  {
    num: '01',
    icon: Database,
    title: 'Datos de portales actualizados semanalmente',
    desc: 'Relevamos precios reales de Mercado Libre, Autocosmos y OLX cada semana para mantener el algoritmo calibrado.',
  },
  {
    num: '02',
    icon: TrendingUp,
    title: 'Variables de depreciación por marca',
    desc: 'No todos los autos deprecian igual. Consideramos historial de marca, consumo y demanda regional en Rosario.',
  },
  {
    num: '03',
    icon: BarChart2,
    title: 'Rango honesto, no promesa',
    desc: 'El precio final depende del estado del vehículo. El valuador te da el piso y techo del mercado real.',
  },
  {
    num: '04',
    icon: MessageCircle,
    title: 'Sin registro previo',
    desc: 'Si el resultado te convence y querés avanzar, ahí te pedimos el contacto. No antes.',
  },
]

export function ValuadorSection() {
  const [result, setResult] = useState<ValuadorResult | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const marca  = watch('marca')
  const modelo = watch('modelo')
  const anio   = watch('anio')

  async function onSubmit(data: FormData) {
    setLoading(true)
    try {
      const res = await fetch('/api/valuador', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      const json = await res.json()
      setResult(json.data)
    } catch {
      toast.error('No se pudo calcular. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  function buildWaMsg() {
    if (!result) return ''
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5493413000000'
    const msg = `Hola! Usé el valuador de AutoGestión y quiero que gestionen la venta de mi ${result.marca} ${result.modelo} ${result.anio}. El sistema me estimó entre ${formatCurrency(result.precio_min)} y ${formatCurrency(result.precio_max)}. ¿Podemos hablar?`
    return buildWhatsAppUrl(phone, msg)
  }

  return (
    <section id="valuador" className="py-24 px-6 bg-surface" style={{ borderTop: '0.5px solid rgba(200,168,75,0.15)', borderBottom: '0.5px solid rgba(200,168,75,0.15)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">

          {/* Form side */}
          <div>
            <div className="section-label">Herramienta de datos</div>
            <h2 className="font-display font-bold mb-3" style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)', lineHeight:1.1 }}>
              Valuador<br /><em className="not-italic text-gold">Inteligente</em>
            </h2>
            <p className="text-muted font-light leading-relaxed mb-8 max-w-[38ch]" style={{ fontSize:'0.9rem' }}>
              Ingresá los datos de tu vehículo y obtené un rango de precio de mercado actualizado. Sin registro, sin compromiso.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Marca</label>
                  <select className="form-input" {...register('marca')}>
                    <option value="">Seleccionar</option>
                    {MARCAS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  {errors.marca && <p className="text-rust text-xs mt-1">{errors.marca.message}</p>}
                </div>
                <div>
                  <label className="form-label">Modelo</label>
                  <input
                    className="form-input"
                    placeholder="Corolla, Gol, Tracker..."
                    {...register('modelo')}
                  />
                  {errors.modelo && <p className="text-rust text-xs mt-1">{errors.modelo.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Año</label>
                  <select className="form-input" {...register('anio')}>
                    <option value="">Seleccionar</option>
                    {ANIOS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  {errors.anio && <p className="text-rust text-xs mt-1">{errors.anio.message}</p>}
                </div>
                <div>
                  <label className="form-label">Kilometraje</label>
                  <select className="form-input" {...register('km_bucket')}>
                    <option value="">Seleccionar</option>
                    {KM_BUCKETS.map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
                  </select>
                  {errors.km_bucket && <p className="text-rust text-xs mt-1">{errors.km_bucket.message}</p>}
                </div>
              </div>

              <button type="submit" className="btn-primary mt-2 flex items-center justify-center gap-2" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block w-4 h-4 border border-dark border-t-transparent rounded-full animate-spin" />
                    Calculando...
                  </span>
                ) : (
                  'Calcular precio de mercado →'
                )}
              </button>
            </form>

            {/* Result card */}
            {result && (
              <div
                className="mt-6 p-6 bg-dark animate-fade-up"
                style={{ border: '0.5px solid var(--c-gold)' }}
              >
                <div className="text-[0.7rem] tracking-[0.15em] uppercase text-muted mb-1">
                  Rango estimado de mercado ·{' '}
                  {new Date(result.actualizado_at).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
                </div>
                <div className="font-display font-bold text-gold mb-4" style={{ fontSize: '1.8rem' }}>
                  {formatCurrency(result.precio_min)} — {formatCurrency(result.precio_max)}
                </div>
                <div
                  className="text-[0.8rem] text-muted font-light leading-relaxed pt-4 mb-4"
                  style={{ borderTop: '0.5px solid rgba(245,240,232,0.1)' }}
                >
                  <strong className="text-cream font-medium">Precio de referencia:</strong>{' '}
                  {formatCurrency(result.precio_referencia)}<br />
                  Basado en {result.marca} {result.modelo} ({result.anio}) —{' '}
                  {KM_BUCKETS.find(k => k.value === result.km_bucket)?.label}.<br />
                  {result.fuente === 'base_datos'
                    ? '✓ Precio extraído de nuestra base de datos de mercado.'
                    : 'Calculado con algoritmo de depreciación por marca y km.'}
                </div>
                <a
                  href={buildWaMsg()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold-outline w-full flex justify-center text-[0.78rem]"
                >
                  Quiero que gestionen mi venta → WhatsApp
                </a>
              </div>
            )}
          </div>

          {/* How it works */}
          <div className="pt-4">
            {HOW_ITEMS.map((item, i) => (
              <div
                key={i}
                className="flex gap-5 py-6"
                style={{ borderBottom: i < HOW_ITEMS.length - 1 ? '0.5px solid rgba(245,240,232,0.07)' : 'none' }}
              >
                <div
                  className="font-display font-extrabold text-[1.8rem] leading-none min-w-[2rem]"
                  style={{ color: 'rgba(200,168,75,0.2)' }}
                >
                  {item.num}
                </div>
                <div>
                  <h4 className="font-display font-semibold text-cream text-[0.95rem] mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-muted font-light leading-relaxed" style={{ fontSize: '0.85rem' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
'use client'
import Link from 'next/link'

const STATS = [
  { num: '94%',  label: 'Ventas concretadas' },
  { num: '18d',  label: 'Tiempo promedio de venta' },
  { num: '$0',   label: 'Comisión por adelantado' },
  { num: '237',  label: 'Operaciones realizadas' },
]

const TICKER_ITEMS = [
  'Toyota Corolla \'23 → USD 19.000',
  'VW Tiguan Allspace \'22 → USD 28.500',
  'Ford Ranger XLT \'21 → USD 32.000',
  'Honda HR-V EXL \'22 → USD 18.500',
  'Renault Duster 4x4 \'23 → USD 14.000',
  'Chevrolet Tracker \'22 → USD 21.000',
]

export function HeroSection() {
  return (
    <section className="min-h-screen grid md:grid-cols-2 pt-16">
      {/* Left */}
      <div
        className="flex flex-col justify-center px-6 md:px-10 py-20"
        style={{ borderRight: '0.5px solid rgba(200,168,75,0.15)' }}
      >
        <div className="section-label animate-fade-up">Intermediación premium · Rosario</div>

        <h1
          className="font-display font-extrabold leading-[1.04] mb-6 animate-fade-up delay-100"
          style={{ fontSize: 'clamp(2.8rem, 5vw, 4rem)' }}
        >
          Tu auto vale<br />más de lo que<br /><em className="not-italic text-gold">te ofrecieron.</em>
        </h1>

        <p className="text-muted font-light leading-relaxed mb-10 max-w-[36ch] animate-fade-up delay-200"
           style={{ fontSize: '1rem' }}>
          Sin precios de ojo. Sin regateo. Gestionamos la venta de tu vehículo con datos reales, transparencia total y seguimiento en tiempo real.
        </p>

        <div className="flex gap-4 flex-wrap animate-fade-up delay-300">
          <Link href="#valuador" className="btn-primary">
            Valuar mi auto gratis
          </Link>
          <Link href="/inventario" className="btn-ghost">
            Ver inventario
          </Link>
        </div>

        {/* Ticker */}
        <div
          className="mt-14 pt-6 overflow-hidden animate-fade-up delay-400"
          style={{ borderTop: '0.5px solid rgba(200,168,75,0.15)' }}
        >
          <div className="text-[0.65rem] tracking-[0.15em] uppercase text-muted mb-2">Últimas operaciones</div>
          <div className="overflow-hidden">
            <div className="ticker-track">
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                <span key={i} className="text-[0.78rem] text-cream/70 mr-8 font-light">
                  <span className="text-gold mr-2">·</span>{item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-col justify-end p-6 md:p-10 bg-surface relative overflow-hidden">
        {/* BG text */}
        <div
          className="absolute top-0 right-0 font-display font-extrabold pointer-events-none select-none leading-none"
          style={{
            fontSize: '14rem',
            color: 'rgba(200,168,75,0.04)',
            letterSpacing: '-0.05em',
            lineHeight: 1,
          }}
        >
          AUTO
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6 animate-fade-up delay-200">
          {STATS.map(stat => (
            <div
              key={stat.label}
              className="bg-dark p-5"
              style={{ border: '0.5px solid rgba(200,168,75,0.15)' }}
            >
              <div className="font-display text-[2rem] font-bold text-gold leading-none mb-1.5">
                {stat.num}
              </div>
              <div className="text-[0.72rem] tracking-[0.08em] uppercase text-muted">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Market pulse */}
        <div
          className="pt-5 animate-fade-up delay-300"
          style={{ borderTop: '0.5px solid rgba(200,168,75,0.15)' }}
        >
          <div className="text-[0.65rem] tracking-[0.15em] uppercase text-muted mb-3">
            Pulso del mercado — hoy
          </div>
          <div className="flex gap-6">
            <div className="flex flex-col gap-0.5">
              <span className="text-[0.68rem] text-muted uppercase tracking-wide">Usados +2.3%</span>
              <span className="text-sm text-cream font-medium">este mes en Rosario</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[0.68rem] text-muted uppercase tracking-wide">Tiempo prom.</span>
              <span className="text-sm text-cream font-medium">18 días hasta el cierre</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
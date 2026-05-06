import Link from 'next/link'
import { Auto } from '@/types'
import { AutoCard } from '@/components/ui/AutoCard'
import { createServerClientInstance } from '@/lib/supabase'

async function getAutos(): Promise<Auto[]> {
  try {
    const supabase = await createServerClientInstance()
    const { data, error } = await supabase
      .from('autos')
      .select('*, imagenes:auto_imagenes(*)')
      .neq('estado', 'vendido')
      .order('destacado', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(6)

    if (error) throw error
    return (data as Auto[]) ?? []
  } catch {
    return []
  }
}

export async function InventarioSection() {
  const autos = await getAutos()

  return (
    <section id="inventario" className="py-24 px-6 bg-dark">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="section-label">Dossier digital</div>
            <h2 className="font-display font-bold" style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)', lineHeight:1.1 }}>
              Vehículos en <em className="not-italic text-gold">Gestión</em>
            </h2>
          </div>
          <Link href="/inventario" className="btn-ghost text-[0.78rem]">
            Ver todos los autos →
          </Link>
        </div>

        {autos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {autos.map(auto => (
              <AutoCard key={auto.id} auto={auto} />
            ))}
          </div>
        ) : (
          /* Placeholder cards when no data */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {['VW Tiguan Allspace 2022','Toyota Corolla XEI 2023','Ford Ranger XLT 2021'].map((label, i) => (
              <PlaceholderCard key={i} label={label} index={i} />
            ))}
          </div>
        )}

        <div
          className="mt-12 pt-8 text-center"
          style={{ borderTop: '0.5px solid rgba(245,240,232,0.08)' }}
        >
          <p className="text-muted text-[0.8rem] mb-4 font-light">
            Cada auto incluye: informe de dominio · historial de infracciones · checklist técnico de 50 puntos · fotos en alta resolución
          </p>
          <Link href="/publicar" className="btn-primary">
            Publicar mi auto en AutoGestión
          </Link>
        </div>
      </div>
    </section>
  )
}

function PlaceholderCard({ label, index }: { label: string; index: number }) {
  const estados = ['disponible', 'en_gestion', 'reservado'] as const
  const precios = [28500, 19000, 32000]
  const kms = [42000, 18000, 67000]

  return (
    <div className="card overflow-hidden">
      <div
        className="relative flex items-center justify-center bg-mid"
        style={{ height: '180px' }}
      >
        <span className="font-display font-extrabold opacity-10 text-[5rem] text-gold leading-none">
          {['VW','TY','FD'][index]}
        </span>
        <div className={`badge absolute top-3 left-3 badge-${estados[index]}`}>
          {['Disponible','Ingresó hoy','Reservado'][index]}
        </div>
        <div
          className="absolute bottom-0 right-0 px-3 py-1.5"
          style={{ background: 'rgba(13,13,11,0.85)' }}
        >
          <span className="font-display font-bold text-gold text-base">
            USD {precios[index].toLocaleString('es-AR')}
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="text-[0.68rem] tracking-widest uppercase text-muted mb-1">
          {['Volkswagen','Toyota','Ford'][index]}
        </div>
        <div className="font-display font-bold text-cream text-[1.05rem] mb-3">{label}</div>
        <div className="flex gap-4 mb-4 text-muted text-[0.75rem]">
          <span>{kms[index].toLocaleString('es-AR')} km</span>
          <span>{['Nafta','Nafta','Diésel'][index]}</span>
          <span>{[2022,2023,2021][index]}</span>
        </div>
        <div className="flex gap-2">
          <button className="btn-gold-outline flex-1 text-[0.72rem]">Ver ficha + PDF</button>
          <button
            className="px-3"
            style={{
              background: 'rgba(37,211,102,0.1)',
              border: '0.5px solid rgba(37,211,102,0.3)',
              color: '#25D366',
            }}
          >📱</button>
        </div>
      </div>
    </div>
  )
}
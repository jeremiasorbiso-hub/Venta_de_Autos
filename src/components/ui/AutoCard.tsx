import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Auto } from '@/types'
import { formatCurrency, formatNumber, getEstadoBadge, buildAutoWhatsApp } from '@/lib/utils'
import { MessageCircle, FileText, Fuel, Gauge, CheckCircle2, AlertCircle, Wrench } from 'lucide-react'

interface AutoCardProps {
  auto: Auto
  variant?: 'grid' | 'featured'
}

export function AutoCard({ auto, variant = 'grid' }: AutoCardProps) {
  const [showChecklist, setShowChecklist] = useState(false)
  const badge = getEstadoBadge(auto.estado)
  const imagenPrincipal = auto.imagenes?.find(i => i.es_principal) ?? auto.imagenes?.[0]
  
  // Parse checklist status
  const checklistStats = auto.checklist ? {
    total: auto.checklist.length,
    ok: auto.checklist.filter(c => c.estado === 'ok').length,
    observacion: auto.checklist.filter(c => c.estado === 'observacion').length,
    reparar: auto.checklist.filter(c => c.estado === 'reparar').length,
  } : null
  
  const checklistPercent = checklistStats ? Math.round((checklistStats.ok / checklistStats.total) * 100) : 0

  const cardVariants = {
    rest: { y: 0 },
    hover: { y: -4 }
  }
  
  const checklistVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.3 } }
  }

  return (
    <motion.div
      className="card card-hover overflow-hidden flex flex-col h-full"
      initial="rest"
      whileHover="hover"
      variants={cardVariants}
      onMouseEnter={() => setShowChecklist(true)}
      onMouseLeave={() => setShowChecklist(false)}
    >
      {/* Image */}
      <div className="relative bg-mid overflow-hidden" style={{ height: variant === 'featured' ? '240px' : '180px' }}>
        {imagenPrincipal ? (
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
            <Image
              src={imagenPrincipal.url}
              alt={imagenPrincipal.alt || `${auto.marca} ${auto.modelo}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </motion.div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-display font-extrabold opacity-10"
              style={{ fontSize: '5rem', color: 'var(--c-gold)' }}
            >
              {auto.marca.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}

        {/* Badge */}
        <motion.div 
          className={`badge absolute top-3 left-3 ${badge.className}`}
          whileHover={{ scale: 1.1 }}
        >
          {badge.label}
        </motion.div>

        {/* Price overlay */}
        <div
          className="absolute bottom-0 right-0 px-3 py-1.5"
          style={{ background: 'rgba(13,13,11,0.85)' }}
        >
          <span className="font-display font-bold text-gold text-base">
            {formatCurrency(auto.precio_usd)}
          </span>
        </div>
        
        {/* Checklist indicator badge */}
        {checklistStats && (
          <motion.div
            className="absolute top-3 right-3 px-2 py-1 rounded-sm text-[0.65rem] font-medium"
            style={{ 
              background: `rgba(200, 168, 75, ${checklistPercent > 80 ? 0.2 : checklistPercent > 50 ? 0.15 : 0.1})`,
              color: checklistPercent > 80 ? '#C8A84B' : checklistPercent > 50 ? '#E8D08A' : '#8B6F47'
            }}
            whileHover={{ scale: 1.1 }}
          >
            {checklistPercent}% OK
          </motion.div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <div className="text-[0.68rem] tracking-[0.15em] uppercase text-muted mb-1">
          {auto.marca}
        </div>
        <div className="font-display font-bold text-cream text-[1.05rem] mb-3 leading-tight">
          {auto.modelo} {auto.version}
        </div>

        {/* Specs with icons */}
        <div className="flex gap-3 mb-4 flex-wrap">
          <motion.div 
            className="flex items-center gap-1.5 text-muted text-[0.75rem]"
            whileHover={{ scale: 1.05 }}
          >
            <Gauge size={13} className="text-gold/60" />
            {formatNumber(auto.kilometraje)} km
          </motion.div>
          <motion.div 
            className="flex items-center gap-1.5 text-muted text-[0.75rem]"
            whileHover={{ scale: 1.05 }}
          >
            <Fuel size={13} className="text-gold/60" />
            {auto.combustible.charAt(0).toUpperCase() + auto.combustible.slice(1)}
          </motion.div>
          <div className="text-muted text-[0.75rem] flex items-center gap-1.5">
            <span className="text-gold/60">📅</span>
            {auto.anio}
          </div>
        </div>

        {/* Checklist Preview on Hover */}
        {checklistStats && (
          <motion.div
            variants={checklistVariants}
            initial="hidden"
            animate={showChecklist ? 'visible' : 'hidden'}
            className="mb-4 p-3 rounded-sm"
            style={{ background: 'rgba(245,240,232,0.03)', border: '0.5px solid rgba(200,168,75,0.1)' }}
          >
            <div className="text-[0.65rem] font-medium text-gold mb-2 flex items-center gap-1">
              <Wrench size={12} /> Checklist Técnico (50 puntos)
            </div>
            <div className="grid grid-cols-3 gap-2 text-[0.65rem]">
              <div className="flex items-center gap-1">
                <CheckCircle2 size={10} className="text-green-400" />
                <span className="text-cream">{checklistStats.ok} OK</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertCircle size={10} className="text-yellow-400" />
                <span className="text-cream">{checklistStats.observacion} Obs</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertCircle size={10} className="text-red-400" />
                <span className="text-cream">{checklistStats.reparar} Rep</span>
              </div>
            </div>
            <div className="mt-2 w-full bg-dark rounded-full h-1 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-gold to-gold-light h-full"
                style={{ width: `${checklistPercent}%` }}
              />
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
            <Link
              href={`/inventario/${auto.slug}`}
              className="btn-gold-outline flex-1 text-center text-[0.72rem] flex items-center justify-center gap-1.5 py-2 px-3"
            >
              <FileText size={13} />
              Ver ficha
            </Link>
          </motion.div>
          {auto.estado !== 'vendido' && (
            <motion.a
              href={buildAutoWhatsApp(auto)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-3 py-2 rounded-sm transition-colors duration-200"
              style={{
                background: 'rgba(37,211,102,0.1)',
                border: '0.5px solid rgba(37,211,102,0.3)',
                color: '#25D366',
              }}
              aria-label="Consultar por WhatsApp"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(37,211,102,0.2)' }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle size={15} />
            </motion.a>
          )}
        </div>

        {/* Dossier indicator */}
        {(auto.informe_dominio_url || auto.ficha_pdf_url) && (
          <motion.div
            className="mt-3 pt-3 flex items-center gap-1.5 text-[0.68rem] text-muted"
            style={{ borderTop: '0.5px solid rgba(245,240,232,0.07)' }}
            initial={{ opacity: 0.7 }}
            whileHover={{ opacity: 1, color: 'var(--c-gold)' }}
          >
            <span className="text-gold text-xs">✓</span>
            <span>Dossier completo: Dominio • Técnico • PDF</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
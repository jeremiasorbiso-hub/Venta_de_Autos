'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

interface Auto {
  id: string
  marca: string
  modelo: string
  anio: number
  kilometraje: number
  precio_usd: number
  combustible: string
}

export default function InventarioPage() {
  const [autos, setAutos] = useState<Auto[]>([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    fetchAutos()
  }, [])

  const fetchAutos = async () => {
    try {
      const response = await fetch('/api/autos')
      const data = await response.json()
      setAutos(data.autos || [])
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al cargar vehículos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#0D0D0B', color: '#F5F0E8', fontFamily: 'Roboto, sans-serif', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: isMobile ? '1rem 1.5rem' : '1.25rem 2.5rem',
        borderBottom: '0.5px solid rgba(200, 168, 75, 0.2)',
        position: 'sticky',
        top: 0,
        background: 'rgba(13,13,11,0.95)',
        backdropFilter: 'blur(8px)',
        zIndex: 100
      }}>
        <Link href="/" style={{ fontSize: isMobile ? '0.95rem' : '1.1rem', fontWeight: 'bold', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', color: '#F5F0E8' }}>
          Auto<span style={{ color: '#C8A84B' }}>Gestión</span>
        </Link>
        <Link href="/inventario/cargar" style={{
          fontSize: isMobile ? '0.7rem' : '0.75rem',
          fontWeight: '500',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: isMobile ? '0.65rem 1rem' : '0.55rem 1.25rem',
          border: '0.5px solid #C8A84B',
          color: '#C8A84B',
          background: 'transparent',
          cursor: 'pointer',
          textDecoration: 'none',
          whiteSpace: 'nowrap'
        }}>
          Publicar
        </Link>
      </nav>

      {/* Header */}
      <section style={{ padding: isMobile ? '1.5rem 1rem' : '3rem 2.5rem', borderBottom: '0.5px solid rgba(200,168,75,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C8A84B', fontWeight: '500', marginBottom: isMobile ? '0.5rem' : '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ display: 'inline-block', width: '1.5rem', height: '0.5px', background: '#C8A84B' }}></span>
            Dossier digital
          </div>
          <h1 style={{ fontSize: isMobile ? 'clamp(1.4rem, 3vw, 1.8rem)' : 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: '700', lineHeight: '1.1', color: '#F5F0E8', marginBottom: '0.75rem' }}>
            Vehículos en <span style={{ color: '#C8A84B' }}>Gestión</span>
          </h1>
          <p style={{ color: '#6B6B5E', fontSize: isMobile ? '0.85rem' : '0.9rem', lineHeight: '1.7' }}>
            Todos los vehículos incluyen: informe de dominio · historial de infracciones · checklist técnico de 50 puntos · fotos en alta resolución
          </p>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: isMobile ? '1.5rem 1rem' : '3rem 2.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#6B6B5E' }}>Cargando vehículos...</p>
          ) : autos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: isMobile ? '2rem 1rem' : '3rem' }}>
              <p style={{ color: '#6B6B5E', marginBottom: '1.5rem', fontSize: isMobile ? '0.9rem' : '1rem' }}>Sin vehículos disponibles aún</p>
              <Link href="/inventario/cargar" style={{
                display: 'inline-block',
                padding: isMobile ? '1rem 1.5rem' : '0.8rem 1.75rem',
                background: '#C8A84B',
                color: '#0D0D0B',
                fontWeight: '500',
                fontSize: isMobile ? '0.85rem' : '0.82rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
                Cargar primer vehículo
              </Link>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: isMobile ? '1rem' : '1.5rem'
            }}>
              {autos.map(auto => (
                <div key={auto.id} style={{
                  background: '#1A1A16',
                  border: '0.5px solid rgba(245,240,232,0.08)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s'
                }}>
                  <div style={{
                    height: isMobile ? '140px' : '160px',
                    background: '#2A2A26',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isMobile ? '2.5rem' : '3rem',
                    color: 'rgba(200,168,75,0.15)',
                    fontWeight: '800',
                    letterSpacing: '-0.05em'
                  }}>
                    {auto.marca.substring(0, 2).toUpperCase()}
                  </div>
                  <div style={{ padding: isMobile ? '1rem' : '1.25rem' }}>
                    <div style={{ fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B6B5E', marginBottom: '0.25rem' }}>
                      {auto.marca}
                    </div>
                    <div style={{ fontSize: isMobile ? '1rem' : '1.05rem', fontWeight: '700', color: '#F5F0E8', marginBottom: '0.75rem' }}>
                      {auto.modelo}
                    </div>
                    <div style={{ display: 'flex', gap: isMobile ? '0.75rem' : '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ fontSize: '0.75rem', color: '#6B6B5E' }}>
                        <strong style={{ color: '#F5F0E8', display: 'block', fontSize: isMobile ? '0.8rem' : '0.85rem', fontWeight: '500' }}>{auto.anio}</strong>
                        Año
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6B6B5E' }}>
                        <strong style={{ color: '#F5F0E8', display: 'block', fontSize: isMobile ? '0.8rem' : '0.85rem', fontWeight: '500' }}>{auto.kilometraje.toLocaleString()}</strong>
                        Km
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6B6B5E' }}>
                        <strong style={{ color: '#F5F0E8', display: 'block', fontSize: isMobile ? '0.8rem' : '0.85rem', fontWeight: '500' }}>{auto.combustible}</strong>
                        Combustible
                      </div>
                    </div>
                    <div style={{ fontSize: isMobile ? '1.2rem' : '1.3rem', fontWeight: '700', color: '#C8A84B', marginBottom: isMobile ? '0.5rem' : '0.75rem' }}>
                      USD ${auto.precio_usd.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '0.5px solid rgba(200,168,75,0.15)',
        padding: isMobile ? '1.5rem 1rem' : '3rem 2.5rem',
        textAlign: 'center',
        background: '#0D0D0B',
        color: '#6B6B5E',
        fontSize: isMobile ? '0.85rem' : '0.9rem'
      }}>
        <p>© 2026 AutoGestión · Todos los derechos reservados</p>
      </footer>
    </div>
  )
}
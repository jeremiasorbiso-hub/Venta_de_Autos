'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Auto {
  id: string
  marca: string
  modelo: string
  anio: number
  kilometraje: number
  precio_usd: number
  aprobacion: 'pendiente' | 'aprobado' | 'rechazado'
  descripcion: string
  createdAt: string
  userId: string
}

export default function AdminPage() {
  const router = useRouter()
  const [autos, setAutos] = useState<Auto[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'pendiente' | 'aprobado' | 'rechazado'>('pendiente')
  const [user, setUser] = useState<any>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Verificar autenticación
    const userStr = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (!userStr || !token) {
      router.push('/auth')
      return
    }

    const userData = JSON.parse(userStr)
    if (userData.rol !== 'admin') {
      toast.error('Acceso denegado')
      router.push('/')
      return
    }

    setUser(userData)
    fetchAutos(token)
  }, [filter])

  const fetchAutos = async (token: string) => {
    try {
      const response = await fetch(`/api/admin/autos?status=${filter}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) {
        throw new Error('Error al cargar autos')
      }

      const data = await response.json()
      setAutos(data.autos)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al cargar autos')
    } finally {
      setLoading(false)
    }
  }

  const handleAprobacion = async (autoId: string, accion: 'aprobar' | 'rechazar', razon?: string) => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch('/api/admin/autos', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ autoId, accion, razon })
      })

      if (!response.ok) throw new Error('Error en la solicitud')

      toast.success(`Auto ${accion}do correctamente`)
      setAutos(autos.filter(a => a.id !== autoId))
    } catch (error) {
      console.error('Error:', error)
      toast.error(`Error al ${accion} auto`)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
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
        background: 'rgba(13,13,11,0.95)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <Link href="/admin" style={{ fontSize: isMobile ? '0.95rem' : '1.1rem', fontWeight: 'bold', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', color: '#F5F0E8', whiteSpace: 'nowrap' }}>
          Auto<span style={{ color: '#C8A84B' }}>Gestión</span> Admin
        </Link>
        <div style={{ display: 'flex', gap: isMobile ? '1rem' : '1.5rem', alignItems: 'center', marginLeft: 'auto', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: isMobile ? '0.85rem' : '0.9rem', color: '#6B6B5E', whiteSpace: 'nowrap' }}>👤 {user?.nombre || 'Admin'}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: isMobile ? '0.6rem 1.2rem' : '0.5rem 1rem',
              background: 'transparent',
              border: '0.5px solid #C8A84B',
              color: '#C8A84B',
              cursor: 'pointer',
              fontSize: isMobile ? '0.75rem' : '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              whiteSpace: 'nowrap'
            }}
          >
            Salir
          </button>
        </div>
      </nav>

      <section style={{ padding: isMobile ? '1.5rem 1rem' : '3rem 2.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', marginBottom: '0.5rem', color: '#F5F0E8' }}>Panel de Aprobación</h1>
          <p style={{ color: '#6B6B5E', marginBottom: '1.5rem', fontSize: isMobile ? '0.9rem' : '1rem' }}>Revisa y aprueba las publicaciones de vehículos</p>

          {/* Filtros */}
          <div style={{ display: 'flex', gap: isMobile ? '0.5rem' : '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {(['pendiente', 'aprobado', 'rechazado'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: isMobile ? '0.6rem 1rem' : '0.75rem 1.5rem',
                  background: filter === f ? '#C8A84B' : 'transparent',
                  color: filter === f ? '#0D0D0B' : '#C8A84B',
                  border: `0.5px solid #C8A84B`,
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.75rem' : '0.85rem',
                  textTransform: 'capitalize',
                  fontWeight: filter === f ? '600' : '400',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                {f === 'pendiente' ? `Pendientes (${autos.length})` : f === 'aprobado' ? 'Aprobados' : 'Rechazados'}
              </button>
            ))}
          </div>

          {/* Grid de autos */}
          {loading ? (
            <p style={{ color: '#6B6B5E', textAlign: 'center' }}>Cargando...</p>
          ) : autos.length === 0 ? (
            <p style={{ color: '#6B6B5E', textAlign: 'center', padding: '2rem' }}>
              {filter === 'pendiente' ? 'No hay autos pendientes de aprobación' : `No hay autos ${filter}`}
            </p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: isMobile ? '1rem' : '1.5rem'
            }}>
              {autos.map(auto => (
                <div
                  key={auto.id}
                  style={{
                    background: '#1A1A16',
                    border: `0.5px solid ${auto.aprobacion === 'pendiente' ? 'rgba(200,168,75,0.5)' : auto.aprobacion === 'aprobado' ? 'rgba(76,175,80,0.5)' : 'rgba(244,67,54,0.5)'}`,
                    padding: isMobile ? '1.25rem' : '1.5rem',
                    borderRadius: '4px'
                  }}
                >
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', gap: '0.5rem' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: '700', color: '#F5F0E8', margin: '0 0 0.25rem 0' }}>
                          {auto.marca} {auto.modelo}
                        </h3>
                        <p style={{ fontSize: isMobile ? '0.8rem' : '0.85rem', color: '#6B6B5E', margin: 0 }}>
                          {auto.anio} · {auto.kilometraje.toLocaleString()} km
                        </p>
                      </div>
                      <span style={{
                        fontSize: '0.65rem',
                        padding: '0.3rem 0.6rem',
                        background: auto.aprobacion === 'pendiente' ? 'rgba(200,168,75,0.2)' : auto.aprobacion === 'aprobado' ? 'rgba(76,175,80,0.2)' : 'rgba(244,67,54,0.2)',
                        color: auto.aprobacion === 'pendiente' ? '#C8A84B' : auto.aprobacion === 'aprobado' ? '#4CB050' : '#F44336',
                        textTransform: 'uppercase',
                        fontWeight: '600',
                        letterSpacing: '0.1em',
                        whiteSpace: 'nowrap'
                      }}>
                        {auto.aprobacion}
                      </span>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '0.5px solid rgba(200,168,75,0.1)' }}>
                    <p style={{ fontSize: isMobile ? '0.85rem' : '0.9rem', color: '#F5F0E8', margin: '0 0 0.5rem 0' }}>
                      <strong>Precio:</strong> USD ${auto.precio_usd.toLocaleString()}
                    </p>
                    <p style={{ fontSize: isMobile ? '0.8rem' : '0.85rem', color: '#6B6B5E', margin: 0, lineHeight: '1.4' }}>
                      {auto.descripcion}
                    </p>
                    <p style={{ fontSize: isMobile ? '0.75rem' : '0.75rem', color: '#6B6B5E', margin: '0.5rem 0 0 0' }}>
                      Publicado: {new Date(auto.createdAt).toLocaleDateString('es-AR')}
                    </p>
                  </div>

                  {auto.aprobacion === 'pendiente' && (
                    <div style={{ display: 'flex', gap: isMobile ? '0.5rem' : '0.75rem', flexDirection: isMobile ? 'column' : 'row' }}>
                      <button
                        onClick={() => handleAprobacion(auto.id, 'aprobar')}
                        style={{
                          flex: 1,
                          padding: isMobile ? '0.85rem' : '0.75rem',
                          background: '#4CB050',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: isMobile ? '0.85rem' : '0.8rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em'
                        }}
                      >
                        ✓ Aprobar
                      </button>
                      <button
                        onClick={() => {
                          const razon = prompt('¿Razón del rechazo?')
                          if (razon !== null) {
                            handleAprobacion(auto.id, 'rechazar', razon)
                          }
                        }}
                        style={{
                          flex: 1,
                          padding: isMobile ? '0.85rem' : '0.75rem',
                          background: '#F44336',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: isMobile ? '0.85rem' : '0.8rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em'
                        }}
                      >
                        ✗ Rechazar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
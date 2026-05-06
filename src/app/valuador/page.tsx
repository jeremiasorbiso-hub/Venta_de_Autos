'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ValuadorPage() {
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    anio: '',
    km: ''
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/valuador', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marca: formData.marca,
          modelo: formData.modelo,
          anio: parseInt(formData.anio),
          km: parseInt(formData.km.split(' ')[0])
        })
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: 'Error al calcular precio' })
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
        background: 'rgba(13,13,11,0.95)',
        backdropFilter: 'blur(8px)',
        zIndex: 100
      }}>
        <Link href="/" style={{ fontSize: isMobile ? '0.95rem' : '1.1rem', fontWeight: 'bold', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', color: '#F5F0E8', whiteSpace: 'nowrap' }}>
          Auto<span style={{ color: '#C8A84B' }}>Gestión</span>
        </Link>
        <div style={{ display: 'flex', gap: isMobile ? '0.5rem' : '1rem', alignItems: 'center' }}>
          <Link href="/" style={{
            padding: isMobile ? '0.6rem 1.2rem' : '0.5rem 1rem',
            background: 'transparent',
            border: '0.5px solid #C8A84B',
            color: '#C8A84B',
            cursor: 'pointer',
            fontSize: isMobile ? '0.75rem' : '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            textDecoration: 'none',
            display: 'inline-block',
            borderRadius: '2px',
            whiteSpace: 'nowrap'
          }}>
            Volver
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <section style={{ padding: isMobile ? '1.5rem 1rem' : '3rem 2.5rem' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', marginBottom: '0.5rem', color: '#F5F0E8' }}>Valuador Inteligente</h1>
          <p style={{ color: '#6B6B5E', marginBottom: '2rem', fontSize: isMobile ? '0.9rem' : '1rem' }}>Ingresá los datos de tu vehículo y obtené un rango de precio de mercado actualizado.</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Marca */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: isMobile ? '0.9rem' : '0.95rem', color: '#C8A84B', fontWeight: '600' }}>
                Marca
              </label>
              <select
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: isMobile ? '0.75rem' : '0.85rem',
                  background: '#1A1A16',
                  border: '0.5px solid rgba(200,168,75,0.3)',
                  color: '#F5F0E8',
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '1rem',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="">Seleccionar marca</option>
                <option value="Toyota">Toyota</option>
                <option value="Volkswagen">Volkswagen</option>
                <option value="Ford">Ford</option>
                <option value="Chevrolet">Chevrolet</option>
                <option value="Renault">Renault</option>
                <option value="Peugeot">Peugeot</option>
                <option value="Honda">Honda</option>
                <option value="Fiat">Fiat</option>
                <option value="Nissan">Nissan</option>
                <option value="Jeep">Jeep</option>
              </select>
            </div>

            {/* Modelo */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: isMobile ? '0.9rem' : '0.95rem', color: '#C8A84B', fontWeight: '600' }}>
                Modelo
              </label>
              <input
                type="text"
                name="modelo"
                placeholder="Corolla, Gol, Tracker..."
                value={formData.modelo}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: isMobile ? '0.75rem' : '0.85rem',
                  background: '#1A1A16',
                  border: '0.5px solid rgba(200,168,75,0.3)',
                  color: '#F5F0E8',
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '1rem',
                  borderRadius: '2px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Año */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: isMobile ? '0.9rem' : '0.95rem', color: '#C8A84B', fontWeight: '600' }}>
                Año
              </label>
              <select
                name="anio"
                value={formData.anio}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: isMobile ? '0.75rem' : '0.85rem',
                  background: '#1A1A16',
                  border: '0.5px solid rgba(200,168,75,0.3)',
                  color: '#F5F0E8',
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '1rem',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="">Seleccionar año</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
                <option value="2018">2018</option>
                <option value="2017">2017</option>
                <option value="2016">2016</option>
                <option value="2015">2015</option>
                <option value="2014">2014</option>
                <option value="2013">2013</option>
              </select>
            </div>

            {/* Kilometraje */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: isMobile ? '0.9rem' : '0.95rem', color: '#C8A84B', fontWeight: '600' }}>
                Kilometraje
              </label>
              <select
                name="km"
                value={formData.km}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: isMobile ? '0.75rem' : '0.85rem',
                  background: '#1A1A16',
                  border: '0.5px solid rgba(200,168,75,0.3)',
                  color: '#F5F0E8',
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '1rem',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="">Seleccionar rango</option>
                <option value="0">0 — 10.000 km</option>
                <option value="10">10.001 — 30.000 km</option>
                <option value="30">30.001 — 60.000 km</option>
                <option value="60">60.001 — 90.000 km</option>
                <option value="90">90.001 — 120.000 km</option>
                <option value="120">Más de 120.000 km</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: isMobile ? '0.85rem' : '0.95rem',
                background: loading ? '#999' : '#C8A84B',
                color: '#0D0D0B',
                fontWeight: '600',
                fontSize: isMobile ? '0.9rem' : '0.95rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                marginTop: '1rem',
                borderRadius: '2px'
              }}
            >
              {loading ? 'Calculando...' : 'Calcular precio de mercado →'}
            </button>
          </form>

          {/* Resultado */}
          {result && (
            <div style={{
              marginTop: '2.5rem',
              padding: isMobile ? '1.25rem' : '1.5rem',
              background: '#1A1A16',
              border: result.error ? '0.5px solid rgba(244,67,54,0.3)' : '0.5px solid rgba(76,175,80,0.3)',
              borderRadius: '4px'
            }}>
              {result.error ? (
                <div>
                  <p style={{ margin: 0, color: '#F44336', fontSize: isMobile ? '0.9rem' : '1rem' }}>❌ {result.error}</p>
                </div>
              ) : (
                <div>
                  <p style={{ margin: '0 0 1rem 0', fontSize: isMobile ? '1rem' : '1.1rem', color: '#4CB050', fontWeight: '600' }}>
                    ✓ Rango estimado: {result.rango}
                  </p>
                  <p style={{ margin: '0.5rem 0', fontSize: isMobile ? '0.85rem' : '0.9rem', color: '#6B6B5E' }}>
                    <strong>Fecha:</strong> {result.fecha}
                  </p>
                  <p style={{ margin: '0.5rem 0', fontSize: isMobile ? '0.85rem' : '0.9rem', color: '#6B6B5E', lineHeight: '1.5' }}>
                    {result.meta}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
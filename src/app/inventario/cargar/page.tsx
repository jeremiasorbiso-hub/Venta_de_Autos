'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

export default function CargarVehiculoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isAuthed, setIsAuthed] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    version: '',
    anio: '',
    kilometraje: '',
    combustible: 'nafta',
    transmision: 'automatica',
    color: '',
    precio_usd: '',
    descripcion: ''
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')

    if (!token || !userStr) {
      router.push('/auth')
      return
    }

    setIsAuthed(true)
    setUser(JSON.parse(userStr))
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth')
        return
      }

      const response = await fetch('/api/autos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(`Error: ${data.error}`)
        return
      }

      toast.success('✅ Auto cargado correctamente!\nEsta esperando aprobación del administrador.')

      // Limpiar formulario
      setFormData({
        marca: '',
        modelo: '',
        version: '',
        anio: '',
        kilometraje: '',
        combustible: 'nafta',
        transmision: 'automatica',
        color: '',
        precio_usd: '',
        descripcion: ''
      })

      setTimeout(() => router.push('/inventario'), 2000)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al cargar el vehículo')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthed) {
    return <div style={{ minHeight: '100vh', background: '#0D0D0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#F5F0E8' }}>Redireccionando...</p>
    </div>
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0D0D0B',
      color: '#F5F0E8',
      padding: '3rem 2rem',
      fontFamily: 'Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Cargar Vehículo</h1>
            <p style={{ color: '#6B6B5E', margin: 0 }}>👤 {user?.nombre || 'Usuario'}</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              router.push('/')
            }}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: '0.5px solid #C8A84B',
              color: '#C8A84B',
              cursor: 'pointer',
              fontSize: '0.75rem',
              textTransform: 'uppercase'
            }}
          >
            Salir
          </button>
        </div>

        <div style={{ background: '#1A1A16', border: '0.5px solid rgba(200,168,75,0.15)', padding: '1.5rem', marginBottom: '2rem', borderRadius: '4px' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#C8A84B' }}>
            ⏳ Tu publicación será revisada por el administrador antes de aparecer en el catálogo.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B5E' }}>
                Marca *
              </label>
              <select
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#1A1A16',
                  border: '0.5px solid rgba(245,240,232,0.15)',
                  color: '#F5F0E8',
                  fontFamily: 'Roboto, sans-serif',
                  outline: 'none'
                }}
              >
                <option value="">Seleccionar</option>
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

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B5E' }}>
                Modelo *
              </label>
              <input
                type="text"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                placeholder="Corolla, Gol..."
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#1A1A16',
                  border: '0.5px solid rgba(245,240,232,0.15)',
                  color: '#F5F0E8',
                  fontFamily: 'Roboto, sans-serif',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B5E' }}>
              Versión
            </label>
            <input
              type="text"
              name="version"
              value={formData.version}
              onChange={handleChange}
              placeholder="2.0 TSI Highline, XEI CVT..."
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#1A1A16',
                border: '0.5px solid rgba(245,240,232,0.15)',
                color: '#F5F0E8',
                fontFamily: 'Roboto, sans-serif',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B5E' }}>
                Año *
              </label>
              <input
                type="number"
                name="anio"
                value={formData.anio}
                onChange={handleChange}
                placeholder="2022"
                min="1990"
                max="2030"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#1A1A16',
                  border: '0.5px solid rgba(245,240,232,0.15)',
                  color: '#F5F0E8',
                  fontFamily: 'Roboto, sans-serif',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B5E' }}>
                Kilometraje *
              </label>
              <input
                type="number"
                name="kilometraje"
                value={formData.kilometraje}
                onChange={handleChange}
                placeholder="42000"
                min="0"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#1A1A16',
                  border: '0.5px solid rgba(245,240,232,0.15)',
                  color: '#F5F0E8',
                  fontFamily: 'Roboto, sans-serif',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B5E' }}>
                Combustible *
              </label>
              <select
                name="combustible"
                value={formData.combustible}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#1A1A16',
                  border: '0.5px solid rgba(245,240,232,0.15)',
                  color: '#F5F0E8',
                  fontFamily: 'Roboto, sans-serif',
                  outline: 'none'
                }}
              >
                <option value="nafta">Nafta</option>
                <option value="diesel">Diésel</option>
                <option value="gnc">GNC</option>
                <option value="hibrido">Híbrido</option>
                <option value="electrico">Eléctrico</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B5E' }}>
                Transmisión *
              </label>
              <select
                name="transmision"
                value={formData.transmision}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#1A1A16',
                  border: '0.5px solid rgba(245,240,232,0.15)',
                  color: '#F5F0E8',
                  fontFamily: 'Roboto, sans-serif',
                  outline: 'none'
                }}
              >
                <option value="manual">Manual</option>
                <option value="automatica">Automática</option>
                <option value="cvt">CVT</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B5E' }}>
                Color
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="Blanco, Negro..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#1A1A16',
                  border: '0.5px solid rgba(245,240,232,0.15)',
                  color: '#F5F0E8',
                  fontFamily: 'Roboto, sans-serif',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B5E' }}>
                Precio USD *
              </label>
              <input
                type="number"
                name="precio_usd"
                value={formData.precio_usd}
                onChange={handleChange}
                placeholder="28500"
                min="0"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#1A1A16',
                  border: '0.5px solid rgba(245,240,232,0.15)',
                  color: '#F5F0E8',
                  fontFamily: 'Roboto, sans-serif',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B5E' }}>
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Información adicional del vehículo..."
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#1A1A16',
                border: '0.5px solid rgba(245,240,232,0.15)',
                color: '#F5F0E8',
                fontFamily: 'Roboto, sans-serif',
                outline: 'none',
                minHeight: '100px',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '1rem',
              background: loading ? '#999' : '#C8A84B',
              color: '#0D0D0B',
              fontWeight: '600',
              fontSize: '0.9rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              marginTop: '1rem'
            }}
          >
            {loading ? 'Cargando...' : 'Cargar vehículo'}
          </button>
        </form>
      </div>
    </div>
  )
}
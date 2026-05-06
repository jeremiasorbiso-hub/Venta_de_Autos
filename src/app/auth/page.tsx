'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const action = isLogin ? 'login' : 'register'
      const body = isLogin
        ? { email: formData.email, password: formData.password }
        : formData

      const response = await fetch(`/api/auth?action=${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Error en la solicitud')
        return
      }

      // Guardar token
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      toast.success(data.message)

      // Redirigir según rol
      if (data.user.rol === 'admin') {
        router.push('/admin')
      } else {
        router.push('/inventario/cargar')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error en la solicitud')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0D0D0B',
      color: '#F5F0E8',
      fontFamily: 'Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: '#1A1A16',
        border: '0.5px solid rgba(200,168,75,0.2)',
        padding: '2rem',
        borderRadius: '4px'
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1 style={{ fontSize: '1.2rem', marginBottom: '2rem', textAlign: 'center', color: '#F5F0E8' }}>
            Auto<span style={{ color: '#C8A84B' }}>Gestión</span>
          </h1>
        </Link>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'center', color: '#F5F0E8' }}>
          {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {!isLogin && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#C8A84B', fontWeight: '600' }}>
                Nombre completo
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#0D0D0B',
                  border: '0.5px solid rgba(200,168,75,0.3)',
                  color: '#F5F0E8',
                  fontFamily: 'Roboto, sans-serif',
                  outline: 'none'
                }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#C8A84B', fontWeight: '600' }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#0D0D0B',
                border: '0.5px solid rgba(200,168,75,0.3)',
                color: '#F5F0E8',
                fontFamily: 'Roboto, sans-serif',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#C8A84B', fontWeight: '600' }}>
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={isLogin ? '••••••••' : 'Mínimo 8 caracteres'}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#0D0D0B',
                border: '0.5px solid rgba(200,168,75,0.3)',
                color: '#F5F0E8',
                fontFamily: 'Roboto, sans-serif',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.9rem',
              background: loading ? '#999' : '#C8A84B',
              color: '#0D0D0B',
              fontWeight: '600',
              fontSize: '0.95rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              marginTop: '1rem'
            }}
          >
            {loading ? 'Procesando...' : isLogin ? 'Ingresar' : 'Registrarse'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6B6B5E', fontSize: '0.9rem' }}>
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setFormData({ email: '', password: '', nombre: '' })
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#C8A84B',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: 'inherit'
            }}
          >
            {isLogin ? 'Registrate' : 'Inicia sesión'}
          </button>
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', background: '#0D0D0B', border: '0.5px solid rgba(200,168,75,0.15)', fontSize: '0.8rem', color: '#6B6B5E' }}>
          <p style={{ margin: '0 0 0.5rem 0' }}>👤 <strong>Credenciales de prueba (Admin):</strong></p>
          <p style={{ margin: '0.25rem 0', fontFamily: 'monospace' }}>Email: admin@autogestion.com</p>
          <p style={{ margin: '0.25rem 0', fontFamily: 'monospace' }}>Pass: Admin123!</p>
        </div>
      </div>
    </div>
  )
}
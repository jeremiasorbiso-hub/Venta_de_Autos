'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [scroll, setScroll] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{ background: '#0D0D0B', color: '#F5F0E8', fontFamily: 'Roboto, sans-serif', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 2.5rem',
        borderBottom: '0.5px solid rgba(200, 168, 75, 0.2)',
        position: 'sticky',
        top: 0,
        background: 'rgba(13,13,11,0.95)',
        backdropFilter: 'blur(8px)',
        zIndex: 100
      }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Auto<span style={{ color: '#C8A84B' }}>Gestión</span>
        </div>
        <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none' }}>
          <li><Link href="#valuador" style={{ color: '#6B6B5E', textDecoration: 'none', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Valuador</Link></li>
          <li><Link href="/inventario" style={{ color: '#6B6B5E', textDecoration: 'none', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Inventario</Link></li>
          <li><Link href="#panel" style={{ color: '#6B6B5E', textDecoration: 'none', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Vendedores</Link></li>
        </ul>
        <Link href="/inventario/cargar" style={{
          fontSize: '0.75rem',
          fontWeight: '500',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '0.55rem 1.25rem',
          border: '0.5px solid #C8A84B',
          color: '#C8A84B',
          background: 'transparent',
          cursor: 'pointer',
          textDecoration: 'none',
          transition: 'all 0.2s',
          display: 'inline-block'
        }}>
          Publicar mi auto
        </Link>
        <Link href="/auth" style={{
          fontSize: '0.75rem',
          fontWeight: '500',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '0.55rem 1.25rem',
          border: '0.5px solid rgba(245,240,232,0.3)',
          color: '#F5F0E8',
          background: 'transparent',
          cursor: 'pointer',
          textDecoration: 'none',
          transition: 'all 0.2s',
          display: 'inline-block',
          marginLeft: '0.5rem'
        }}>
          Ingresar / Registrarse
        </Link>
      </nav>

      {/* Hero */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '88vh',
        padding: 0
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '5rem 3rem 5rem 2.5rem',
          borderRight: '0.5px solid rgba(200,168,75,0.15)'
        }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C8A84B', fontWeight: '500', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ display: 'inline-block', width: '2rem', height: '0.5px', background: '#C8A84B' }}></span>
            Intermediación premium · Rosario
          </div>
          <h1 style={{ fontSize: 'clamp(2.8rem, 5vw, 4rem)', fontWeight: '800', lineHeight: '1.05', marginBottom: '1.5rem', color: '#F5F0E8' }}>
            Tu auto vale<br />más de lo que<br /><span style={{ color: '#C8A84B' }}>te ofrecieron.</span>
          </h1>
          <p style={{ fontSize: '1rem', lineHeight: '1.7', color: '#6B6B5E', maxWidth: '36ch', marginBottom: '2.5rem', fontWeight: '300' }}>
            Sin precios de ojo. Sin regateo. Gestionamos la venta de tu vehículo con datos reales, transparencia total y seguimiento en tiempo real.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/valuador" style={{
              padding: '0.8rem 1.75rem',
              background: '#C8A84B',
              color: '#0D0D0B',
              fontWeight: '500',
              fontSize: '0.82rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}>
              Valuar mi auto gratis
            </Link>
            <Link href="/inventario" style={{
              padding: '0.8rem 1.75rem',
              background: 'transparent',
              color: '#F5F0E8',
              fontWeight: '400',
              fontSize: '0.82rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              border: '0.5px solid rgba(245,240,232,0.3)',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}>
              Ver inventario
            </Link>
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '2.5rem',
          background: '#1A1A16',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-1rem',
            right: '-1rem',
            fontSize: '12rem',
            fontWeight: '800',
            color: 'rgba(200,168,75,0.04)',
            letterSpacing: '-0.05em',
            pointerEvents: 'none'
          }}>
            AUTO
          </div>
          <p style={{ fontSize: '0.9rem', color: '#6B6B5E', fontWeight: '300' }}>
            <strong style={{ color: '#F5F0E8' }}>✅ Sistema totalmente funcional</strong><br />
            Valuador inteligente · Carga de vehículos · Base de datos conectada
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '0.5px solid rgba(200,168,75,0.15)',
        padding: '3rem 2.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#0D0D0B'
      }}>
        <div>
          <div style={{ fontWeight: '800', fontSize: '0.9rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Auto<span style={{ color: '#C8A84B' }}>Gestión</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#6B6B5E', marginTop: '0.4rem' }}>Rosario, Santa Fe · Argentina</p>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link href="/valuador" style={{ fontSize: '0.72rem', color: '#6B6B5E', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'color 0.2s' }}>
            Valuador
          </Link>
          <Link href="/inventario" style={{ fontSize: '0.72rem', color: '#6B6B5E', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'color 0.2s' }}>
            Inventario
          </Link>
          <Link href="/inventario/cargar" style={{ fontSize: '0.72rem', color: '#6B6B5E', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'color 0.2s' }}>
            Cargar auto
          </Link>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#6B6B5E' }}>© 2026 AutoGestión · Todos los derechos reservados</p>
      </footer>
    </div>
  )
}
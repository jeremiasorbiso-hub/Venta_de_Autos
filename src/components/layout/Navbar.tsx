'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/#valuador',   label: 'Valuador' },
  { href: '/inventario',  label: 'Inventario' },
  { href: '/#panel',      label: 'Para Vendedores' },
  { href: '/blog',        label: 'Mercado' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-dark/95 backdrop-blur-sm border-b border-gold/10'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-display font-extrabold text-[1.05rem] tracking-[0.12em] uppercase">
          Auto<span className="text-gold">Gestión</span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[0.78rem] tracking-[0.1em] uppercase text-muted hover:text-cream transition-colors duration-200"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/publicar" className="btn-gold-outline text-[0.75rem]">
            Publicar mi auto
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-cream p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-surface border-t border-gold/10 px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[0.82rem] tracking-[0.1em] uppercase text-muted hover:text-cream transition-colors"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/publicar" className="btn-primary text-center mt-2" onClick={() => setOpen(false)}>
            Publicar mi auto
          </Link>
        </div>
      )}
    </nav>
  )
}
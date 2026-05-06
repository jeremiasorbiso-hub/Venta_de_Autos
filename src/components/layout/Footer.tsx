import Link from 'next/link'
import { MapPin, Phone, Instagram } from 'lucide-react'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-gold/10 bg-dark">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="font-display font-extrabold text-lg tracking-[0.12em] uppercase mb-4">
              Auto<span className="text-gold">Gestión</span>
            </div>
            <p className="text-muted text-sm leading-relaxed max-w-xs font-light">
              Intermediación premium de vehículos en Rosario. Datos reales, transparencia total, sin sorpresas.
            </p>
            <div className="flex flex-col gap-2 mt-6">
              <div className="flex items-center gap-2 text-muted text-sm">
                <MapPin size={14} className="text-gold flex-shrink-0" />
                Rosario, Santa Fe, Argentina
              </div>
              <div className="flex items-center gap-2 text-muted text-sm">
                <Phone size={14} className="text-gold flex-shrink-0" />
                <a
                  href="https://wa.me/5493413000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cream transition-colors"
                >
                  +54 9 341 300-0000
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted text-sm">
                <Instagram size={14} className="text-gold flex-shrink-0" />
                <a
                  href="https://instagram.com/autogestion_rosario"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cream transition-colors"
                >
                  @autogestion_rosario
                </a>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[0.68rem] tracking-[0.18em] uppercase text-gold font-medium mb-4">
              Servicios
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { href: '/#valuador', label: 'Valuador inteligente' },
                { href: '/inventario', label: 'Ver inventario' },
                { href: '/publicar', label: 'Publicar mi auto' },
                { href: '/#panel', label: 'Panel del vendedor' },
              ].map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted hover:text-cream transition-colors font-light"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[0.68rem] tracking-[0.18em] uppercase text-gold font-medium mb-4">
              Información
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { href: '/blog', label: 'Blog de mercado' },
                { href: '/blog/como-funciona', label: '¿Cómo funciona?' },
                { href: '/blog/preguntas-frecuentes', label: 'Preguntas frecuentes' },
                { href: '/contacto', label: 'Contacto' },
              ].map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted hover:text-cream transition-colors font-light"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="divider-gold mt-12 mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[0.72rem] text-muted tracking-wide">
            © {year} AutoGestión · Todos los derechos reservados
          </p>
          <p className="text-[0.72rem] text-muted">
            Precios en USD · Operaciones bajo ley argentina
          </p>
        </div>
      </div>
    </footer>
  )
}
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AutoGestión - Intermediación Premium de Autos',
  description: 'Vende tu auto sin regateo. Valuación online, transparencia total, seguimiento en tiempo real.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#0D0D0B" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-dark text-cream">
        {children}
      </body>
    </html>
  )
}

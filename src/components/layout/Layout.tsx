import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import '@/app/globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'AutoGestión — Intermediación Premium de Autos en Rosario',
    template: '%s | AutoGestión',
  },
  description:
    'Vendé tu auto al mejor precio con datos reales de mercado. Sin comisión por adelantado, con seguimiento transparente en tiempo real. Rosario, Santa Fe.',
  keywords: ['autos usados rosario', 'vender auto rosario', 'intermediacion autos', 'compra venta autos santa fe'],
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'AutoGestión',
    title: 'AutoGestión — Intermediación Premium',
    description: 'Vendé tu auto al mejor precio con datos reales de mercado.',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="bg-dark text-cream antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1A1A16',
              color: '#F5F0E8',
              border: '0.5px solid rgba(200,168,75,0.3)',
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '0.875rem',
            },
            success: { iconTheme: { primary: '#C8A84B', secondary: '#0D0D0B' } },
          }}
        />
      </body>
    </html>
  )
}
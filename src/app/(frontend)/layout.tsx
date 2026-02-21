import React from 'react'
import { Inter, Montserrat, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['400', '500', '600'],
})

export const metadata = {
  description:
    'ROEX — UK-based manufacturer of premium 360° audio systems for retail, hospitality & commercial spaces. Founded in 2015.',
  title: 'ROEX | Premium 360° Audio Systems — We Make Your Business Sound',
  metadataBase: new URL('https://roexaudios.com'),
  openGraph: {
    title: 'ROEX | Premium 360° Audio Systems — We Make Your Business Sound',
    description:
      'ROEX designs and manufactures high-performance 360° audio systems, speakers, cables, and components for retail, hospitality & commercial environments worldwide.',
    type: 'website',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} ${spaceGrotesk.variable}`}>
      <head />
      <body className="font-sans bg-white text-gray-900 antialiased">{children}</body>
    </html>
  )
}

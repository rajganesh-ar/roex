'use client'

import { MegaMenuHeader } from '@/components/MegaMenuHeader'
import { Footer } from '@/components/Footer'

export interface MegaMenuColumn {
  id: string
  name: string
  slug: string
  image: string | null
  children: Array<{ id: string; name: string; slug: string }>
}

export interface FeaturedProduct {
  id: string
  name: string
  slug: string
  availability: 'available' | 'unavailable'
  category: string
  image: string
}

interface TemplateClientProps {
  children: React.ReactNode
  megaMenuColumns: MegaMenuColumn[]
  featuredProducts: FeaturedProduct[]
}

export function TemplateClient({
  children,
  megaMenuColumns,
  featuredProducts,
}: TemplateClientProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <MegaMenuHeader megaMenuColumns={megaMenuColumns} featuredProducts={featuredProducts} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}


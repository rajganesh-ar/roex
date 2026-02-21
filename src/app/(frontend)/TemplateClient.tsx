'use client'

import { MegaMenuHeader } from '@/components/MegaMenuHeader'
import { Footer } from '@/components/Footer'

interface TemplateClientProps {
  children: React.ReactNode
  menuItems: any[]
  categories: Array<{
    id: string
    name: string
    slug: string
    image: string | null
    parentId: string | null
    parentName: string | null
  }>
  featuredProducts: Array<{
    id: string
    name: string
    slug: string
    availability: 'available' | 'unavailable'
    category: string
    image: string
  }>
}

export function TemplateClient({
  children,
  menuItems,
  categories,
  featuredProducts,
}: TemplateClientProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <MegaMenuHeader
        initialMenuItems={menuItems}
        initialCategories={categories}
        initialFeaturedProducts={featuredProducts}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

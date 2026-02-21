import { Suspense } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import ShopPageClient from './ShopPageClient'

export const dynamic = 'force-dynamic'

const getShopData = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const [categoriesResult, productsResult] = await Promise.all([
      payload
        .find({
          collection: 'categories',
          limit: 100,
          depth: 1,
          select: { name: true, slug: true, parent: true },
        })
        .catch(() => ({ docs: [] as any[] })),
      payload
        .find({ collection: 'products', sort: '-featured', limit: 50, depth: 1 })
        .catch(() => ({ docs: [] as any[] })),
    ])
    return { categoriesResult, productsResult }
  },
  ['shop-page-data'],
  { revalidate: 60 },
)

export default async function ShopPage() {
  const { categoriesResult, productsResult } = await getShopData()

  const categories = categoriesResult.docs.map((cat: any) => ({
    id: String(cat.id),
    name: cat.name,
    slug: cat.slug,
    parentId: cat.parent
      ? typeof cat.parent === 'object'
        ? String(cat.parent.id)
        : String(cat.parent)
      : null,
    parentName: cat.parent && typeof cat.parent === 'object' ? cat.parent.name : null,
    count: 0,
  }))

  const products = productsResult.docs.map((product: any) => ({
    id: String(product.id),
    name: product.name,
    slug: product.slug,
    category:
      Array.isArray(product.categories) && product.categories.length > 0
        ? typeof product.categories[0] === 'object'
          ? product.categories[0].name
          : product.categories[0]
        : '',
    categoryId:
      Array.isArray(product.categories) && product.categories.length > 0
        ? typeof product.categories[0] === 'object'
          ? String(product.categories[0].id)
          : String(product.categories[0])
        : '',
    image:
      product.images?.[0]?.image?.url ||
      (product.images?.[0]?.image?.filename
        ? `/api/media/file/${product.images[0].image.filename}`
        : '/images/category-card-speaker.avif'),
    availability: (product.availability as 'available' | 'unavailable') || 'available',
    featured: product.featured,
  }))

  // Count products per category
  for (const cat of categories) {
    cat.count = products.filter(
      (p: any) => p.categoryId === cat.id || p.category === cat.name,
    ).length
  }

  return (
    <Suspense>
      <ShopPageClient initialCategories={categories} initialProducts={products} />
    </Suspense>
  )
}

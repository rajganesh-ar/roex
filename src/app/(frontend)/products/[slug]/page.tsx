import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import ProductDetailClient from './ProductDetailClient'

export const revalidate = 60

const getProductBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config })
      const result = await payload.find({
        collection: 'products',
        where: { slug: { equals: slug } },
        depth: 2,
        limit: 1,
      })
      return result
    },
    [`product-${slug}`],
    { revalidate: 60 },
  )()

const getRelatedProducts = (catId: string | null, excludeId: string) =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config })
      return payload.find({
        collection: 'products',
        where: {
          ...(catId ? { categories: { in: [catId] } } : {}),
          id: { not_equals: excludeId },
        },
        limit: 4,
        depth: 1,
      })
    },
    [`related-${catId}-${excludeId}`],
    { revalidate: 60 },
  )()

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const productsResult = await getProductBySlug(slug)

  if (!productsResult.docs || productsResult.docs.length === 0) {
    notFound()
  }

  const raw = productsResult.docs[0] as any

  // Get first category id for related products query
  const firstCatId =
    Array.isArray(raw.categories) && raw.categories.length > 0
      ? typeof raw.categories[0] === 'object'
        ? raw.categories[0].id
        : raw.categories[0]
      : null

  const relatedResult = await getRelatedProducts(firstCatId, String(raw.id))

  // Transform product
  const product = {
    id: String(raw.id),
    name: raw.name || '',
    slug: raw.slug || '',
    description: raw.description || '',
    longDescription: raw.longDescription || '',
    category:
      Array.isArray(raw.categories) && raw.categories.length > 0
        ? typeof raw.categories[0] === 'object'
          ? raw.categories[0].name
          : raw.categories[0]
        : '',
    categoryId: firstCatId ? String(firstCatId) : '',
    images: raw.images?.map((img: any) => {
      return (
        img.image?.url ||
        (img.image?.filename
          ? `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/media/${img.image.filename}`
          : '/images/category-card-speaker.avif')
      )
    }) || ['/images/category-card-speaker.avif'],
    availability: (raw.availability as 'available' | 'unavailable') || 'available',
    sku: raw.sku || '',
    specifications: raw.specifications || [],
  }

  // Transform related products
  const relatedProducts = relatedResult.docs.map((p: any) => ({
    id: String(p.id),
    name: p.name || '',
    slug: p.slug || '',
    category:
      Array.isArray(p.categories) && p.categories.length > 0
        ? typeof p.categories[0] === 'object'
          ? p.categories[0].name
          : p.categories[0]
        : '',
    image:
      p.images?.[0]?.image?.url ||
      (p.images?.[0]?.image?.filename
        ? `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/media/${p.images[0].image.filename}`
        : '/images/category-card-speaker.avif'),
    availability: (p.availability as 'available' | 'unavailable') || 'available',
  }))

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />
}

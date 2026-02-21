import { getPayload } from 'payload'
import config from '@payload-config'
import { TemplateClient } from './TemplateClient'

// Force dynamic rendering - DB (Railway internal) is only reachable at runtime, not build time
export const dynamic = 'force-dynamic'

const getHeaderData = async () => {
  try {
    const payload = await getPayload({ config })
    const [menuResult, categoriesResult, featuredResult] = await Promise.all([
      payload
        .find({
          collection: 'menu-items',
          sort: 'order',
          depth: 1,
          limit: 20,
        })
        .catch(() => ({ docs: [] as any[] })),
      payload
        .find({
          collection: 'categories',
          limit: 100,
          depth: 1,
          select: { name: true, slug: true, parent: true, image: true },
        })
        .catch(() => ({ docs: [] as any[] })),
      payload
        .find({
          collection: 'products',
          sort: '-featured',
          limit: 4,
          depth: 1,
        })
        .catch(() => ({ docs: [] as any[] })),
    ])
    return { menuResult, categoriesResult, featuredResult }
  } catch {
    return {
      menuResult: { docs: [] as any[] },
      categoriesResult: { docs: [] as any[] },
      featuredResult: { docs: [] as any[] },
    }
  }
}

export default async function Template({ children }: { children: React.ReactNode }) {
  const { menuResult, categoriesResult, featuredResult } = await getHeaderData()

  const categories = categoriesResult.docs.map((cat: any) => {
    const imageUrl =
      cat.image?.url ||
      (cat.image?.filename
        ? `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/media/${cat.image.filename}`
        : null)
    return {
      id: String(cat.id),
      name: cat.name,
      slug: cat.slug,
      image: imageUrl,
      parentId: cat.parent
        ? typeof cat.parent === 'object'
          ? String(cat.parent.id)
          : String(cat.parent)
        : null,
      parentName: cat.parent && typeof cat.parent === 'object' ? cat.parent.name : null,
    }
  })

  // Ensure "Speakers" parent category exists with subcategories
  const speakersParent = categories.find((c: any) => c.slug === 'speakers' && !c.parentId)
  if (!speakersParent) {
    // Create a virtual "Speakers" parent
    categories.unshift({
      id: 'speakers',
      name: 'Speakers',
      slug: 'speakers',
      image: '/images/menu-speakers.avif',
      parentId: null,
      parentName: null,
    })
  }
  const speakersId = speakersParent?.id || 'speakers'

  // Move "Cabled Speakers" and "Wireless Smart Speakers" under Speakers
  for (const cat of categories) {
    const lower = cat.name?.toLowerCase() || ''
    if (
      !cat.parentId &&
      cat.id !== speakersId &&
      ((lower.includes('cabled') && lower.includes('speaker')) ||
        (lower.includes('wireless') && lower.includes('speaker')))
    ) {
      cat.parentId = speakersId
      cat.parentName = 'Speakers'
    }
  }

  const featuredProducts = featuredResult.docs.map((product: any) => ({
    id: String(product.id),
    name: product.name,
    slug: product.slug,
    availability: (product.availability as 'available' | 'unavailable') || 'available',
    category:
      Array.isArray(product.categories) && product.categories.length > 0
        ? typeof product.categories[0] === 'object'
          ? product.categories[0].name
          : product.categories[0]
        : '',
    image:
      product.images?.[0]?.image?.url ||
      (product.images?.[0]?.image?.filename
        ? `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/media/${product.images[0].image.filename}`
        : '/images/category-card-speaker.avif'),
  }))

  return (
    <TemplateClient
      menuItems={menuResult.docs}
      categories={categories}
      featuredProducts={featuredProducts}
    >
      {children}
    </TemplateClient>
  )
}

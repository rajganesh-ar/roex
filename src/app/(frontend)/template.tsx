import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { TemplateClient } from './TemplateClient'
import type { MegaMenuColumn, FeaturedProduct } from './TemplateClient'

// Force dynamic rendering - DB (Railway internal) is only reachable at runtime, not build time
export const dynamic = 'force-dynamic'

/** Image to use in the mega-menu for each top-level category slug */
const CATEGORY_IMAGES: Record<string, string> = {
  speakers: '/images/menu-speakers.avif',
  components: '/images/menu-components.avif',
  cables: '/images/menu-cables.avif',
}

/**
 * Fallback columns used when the CMS returns no categories.
 * Matches the required category structure exactly.
 */
const FALLBACK_COLUMNS: MegaMenuColumn[] = [
  {
    id: 'speakers',
    name: 'Speakers',
    slug: 'speakers',
    image: '/images/menu-speakers.avif',
    children: [
      { id: 'cabled-speakers', name: 'Cabled Speakers', slug: 'cabled-speakers' },
      {
        id: 'wireless-smart-speakers',
        name: 'Wireless Smart Speakers',
        slug: 'wireless-smart-speakers',
      },
    ],
  },
  {
    id: 'components',
    name: 'Components',
    slug: 'components',
    image: '/images/menu-components.avif',
    children: [],
  },
  {
    id: 'cables',
    name: 'Cables',
    slug: 'cables',
    image: '/images/menu-cables.avif',
    children: [],
  },
]

const getHeaderData = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config })
      const [categoriesResult, featuredResult] = await Promise.all([
        payload
          .find({
            collection: 'categories',
            limit: 100,
            // depth:1 populates the `children` join field and the `image` upload
            depth: 1,
          })
          .catch(() => ({ docs: [] as any[] })),
        payload
          .find({
            collection: 'products',
            sort: '-featured',
            limit: 4,
            depth: 1,
            where: { availability: { equals: 'available' } },
            select: { name: true, slug: true, availability: true, images: true, categories: true },
          })
          .catch(() => ({ docs: [] as any[] })),
      ])
      return { categoriesResult, featuredResult }
    } catch {
      return {
        categoriesResult: { docs: [] as any[] },
        featuredResult: { docs: [] as any[] },
      }
    }
  },
  ['header-data'],
  { revalidate: 120 },
)

/** Resolve a category's image URL, falling back to a static asset by slug */
function resolveCategoryImage(cat: any): string {
  if (cat.image?.url) return cat.image.url
  if (cat.image?.filename) return `/api/media/file/${cat.image.filename}`
  return CATEGORY_IMAGES[cat.slug as string] ?? '/images/menu-speakers.avif'
}

export default async function Template({ children }: { children: React.ReactNode }) {
  const { categoriesResult, featuredResult } = await getHeaderData()

  const allDocs: any[] = categoriesResult.docs

  // --- Build MegaMenuColumn[] from CMS categories ---

  // Top-level = no parent
  const topLevel = allDocs.filter((c) => !c.parent)

  let megaMenuColumns: MegaMenuColumn[] = topLevel.map((cat) => {
    // The `children` join field is populated at depth:1 as `{ docs: [...] }`
    // or may already be a plain array depending on adapter version
    let childDocs: any[] = []
    if (Array.isArray(cat.children?.docs)) {
      childDocs = cat.children.docs
    } else if (Array.isArray(cat.children)) {
      childDocs = cat.children.filter((c: any) => typeof c === 'object' && c.id)
    }

    // If the join field returned nothing, find children manually
    if (childDocs.length === 0) {
      childDocs = allDocs.filter((c) => {
        const parentRef = c.parent
        const parentId = typeof parentRef === 'object' ? parentRef?.id : parentRef
        return parentId !== undefined && parentId !== null && String(parentId) === String(cat.id)
      })
    }

    return {
      id: String(cat.id),
      name: cat.name as string,
      slug: cat.slug as string,
      image: resolveCategoryImage(cat),
      children: childDocs.map((child) => ({
        id: String(child.id),
        name: child.name as string,
        slug: child.slug as string,
      })),
    }
  })

  // Use the static fallback when the CMS has no categories at all
  if (megaMenuColumns.length === 0) {
    megaMenuColumns = FALLBACK_COLUMNS
  }

  // --- Build FeaturedProduct[] ---
  const featuredProducts: FeaturedProduct[] = featuredResult.docs.map((product: any) => ({
    id: String(product.id),
    name: product.name as string,
    slug: product.slug as string,
    availability: (product.availability as 'available' | 'unavailable') || 'available',
    category:
      Array.isArray(product.categories) && product.categories.length > 0
        ? typeof product.categories[0] === 'object'
          ? (product.categories[0].name as string)
          : String(product.categories[0])
        : '',
    image:
      product.images?.[0]?.image?.url ||
      (product.images?.[0]?.image?.filename
        ? `/api/media/file/${product.images[0].image.filename}`
        : '/images/category-card-speaker.avif'),
  }))

  return (
    <TemplateClient megaMenuColumns={megaMenuColumns} featuredProducts={featuredProducts}>
      {children}
    </TemplateClient>
  )
}

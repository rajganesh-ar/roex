import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { TemplateClient } from './TemplateClient'
import type { MegaMenuColumn, FeaturedProduct } from './TemplateClient'

// Force dynamic rendering — DB (Railway internal) is only reachable at runtime
export const dynamic = 'force-dynamic'

// ─── Anchor columns that must ALWAYS appear in the mega menu ────────────────
const ANCHORS: Array<{
  slug: string
  name: string
  fallbackImage: string
  childKeywords: string[]
}> = [
  {
    slug: 'speakers',
    name: 'Speakers',
    fallbackImage: '/images/menu-speakers.avif',
    childKeywords: ['speaker'],
  },
  {
    slug: 'cables',
    name: 'Cables',
    fallbackImage: '/images/category-card-cable.avif',
    childKeywords: ['cable', 'wire'],
  },
  {
    slug: 'components',
    name: 'Components',
    fallbackImage: '/images/category-card-components.avif',
    childKeywords: ['component', 'accessory', 'accessorie'],
  },
]

type RawCat = {
  id: string
  name: string
  slug: string
  image: string | null
  parentId: string | null
}

function resolveImage(cat: any): string | null {
  if (!cat.image) return null
  if (typeof cat.image === 'object') {
    return cat.image.url || (cat.image.filename ? `/api/media/file/${cat.image.filename}` : null)
  }
  return null
}

// React cache() deduplicates within a single request (replaces unstable_cache)
const getHeaderData = cache(async () => {
  try {
    const payload = await getPayload({ config })

    const [catResult, featuredResult] = await Promise.all([
      payload
        .find({
          collection: 'categories',
          limit: 200,
          depth: 1, // populates the `parent` relationship field
          select: { name: true, slug: true, parent: true, image: true },
        })
        .catch(() => ({ docs: [] as any[] })),
      payload
        .find({
          collection: 'products',
          sort: '-featured',
          limit: 4,
          depth: 1,
          select: { name: true, slug: true, availability: true, images: true, categories: true },
        })
        .catch(() => ({ docs: [] as any[] })),
    ])

    // ── 1. Normalise all CMS categories into flat RawCat array ──────────────
    const allCats: RawCat[] = catResult.docs.map((cat: any) => ({
      id: String(cat.id),
      name: String(cat.name || ''),
      slug: String(cat.slug || ''),
      image: resolveImage(cat),
      parentId: cat.parent
        ? typeof cat.parent === 'object'
          ? String(cat.parent.id)
          : String(cat.parent)
        : null,
    }))

    // ── 2. Ensure all 3 anchor top-level categories exist in CMS ────────────
    // We try to create any that are missing; if it fails (already exists /
    // concurrent request), we just continue — the find pass picks it up.
    const ensurePromises = ANCHORS.map(async (anchor) => {
      const exists = allCats.find((c) => c.slug === anchor.slug && !c.parentId)
      if (exists) return
      try {
        const created = await payload.create({
          collection: 'categories',
          data: { name: anchor.name, slug: anchor.slug },
        })
        allCats.push({
          id: String(created.id),
          name: anchor.name,
          slug: anchor.slug,
          image: null,
          parentId: null,
        })
      } catch {
        // Duplicate or DB error — a subsequent request will find it
      }
    })
    await Promise.allSettled(ensurePromises)

    // ── 3. Re-parent orphan categories that clearly belong under an anchor ───
    // (handles the case where CMS was seeded without parent relationships)
    const anchorsInCats = ANCHORS.map((a) => allCats.find((c) => c.slug === a.slug && !c.parentId))

    for (const cat of allCats) {
      if (cat.parentId) continue // already has a parent
      const lower = (cat.name + ' ' + cat.slug).toLowerCase()

      for (let i = 0; i < ANCHORS.length; i++) {
        const anchor = ANCHORS[i]!
        const anchorCat = anchorsInCats[i]
        if (!anchorCat) continue
        if (cat.id === anchorCat.id) continue // don't self-parent

        const isChild = anchor.childKeywords.some((kw) => lower.includes(kw))
        if (isChild) {
          cat.parentId = anchorCat.id
          break
        }
      }
    }

    // ── 4. Build the 3 guaranteed MegaMenuColumn objects ────────────────────
    const megaMenuColumns: MegaMenuColumn[] = ANCHORS.map((anchor) => {
      const parent = allCats.find((c) => c.slug === anchor.slug && !c.parentId)
      const children = parent ? allCats.filter((c) => c.parentId === parent.id) : []

      return {
        id: parent?.id ?? anchor.slug,
        name: anchor.name,
        slug: anchor.slug,
        image: parent?.image ?? anchor.fallbackImage,
        children: children.map((ch) => ({
          id: ch.id,
          name: ch.name,
          slug: ch.slug,
        })),
      }
    })

    // ── 5. Featured products ─────────────────────────────────────────────────
    const featuredProducts: FeaturedProduct[] = featuredResult.docs.map((product: any) => ({
      id: String(product.id),
      name: String(product.name || ''),
      slug: String(product.slug || ''),
      availability: (product.availability as 'available' | 'unavailable') || 'available',
      category:
        Array.isArray(product.categories) && product.categories.length > 0
          ? typeof product.categories[0] === 'object'
            ? String(product.categories[0].name)
            : String(product.categories[0])
          : '',
      image:
        product.images?.[0]?.image?.url ||
        (product.images?.[0]?.image?.filename
          ? `/api/media/file/${product.images[0].image.filename}`
          : '/images/category-card-speaker.avif'),
    }))

    return { megaMenuColumns, featuredProducts }
  } catch {
    // Full fallback — CMS unreachable
    const megaMenuColumns: MegaMenuColumn[] = ANCHORS.map((anchor) => ({
      id: anchor.slug,
      name: anchor.name,
      slug: anchor.slug,
      image: anchor.fallbackImage,
      children: [],
    }))
    return { megaMenuColumns, featuredProducts: [] as FeaturedProduct[] }
  }
})

export default async function Template({ children }: { children: React.ReactNode }) {
  const { megaMenuColumns, featuredProducts } = await getHeaderData()

  return (
    <TemplateClient megaMenuColumns={megaMenuColumns} featuredProducts={featuredProducts}>
      {children}
    </TemplateClient>
  )
}

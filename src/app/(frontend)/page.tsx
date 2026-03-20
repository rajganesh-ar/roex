import { Suspense } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import nextDynamic from 'next/dynamic'
import HeroCarousel from './HeroCarousel'
import type { HeroSlide } from './HeroCarousel'
import type { BlogPostData } from './HomePageClient'

// Lazy-load the heavy below-fold component into a separate JS chunk (reduces initial TBT)
const HomePage = nextDynamic(() => import('./HomePageClient'), { ssr: true })

// Force dynamic - DB only reachable at runtime (Railway internal network)
export const dynamic = 'force-dynamic'

// Hero skeleton: shown only until hero-sections query resolves (usually <200ms)
function HeroSkeleton() {
  return <div className="h-screen bg-[#111]" />
}

// Resolve a Payload media object to a URL
function resolveMedia(media: any): string | null {
  if (!media || typeof media !== 'object') return null
  if (media.filename) return `/api/media/file/${media.filename}`
  if (media.url) return media.url
  return null
}

// Transform raw hero docs to HeroSlide[]
function transformHeroSlides(docs: any[]): HeroSlide[] {
  return docs
    .filter((hero: any) => {
      if (hero.mediaType === 'image' && hero.backgroundImage) return true
      if (hero.mediaType === 'video' && (hero.backgroundVideo || hero.backgroundVideoUrl))
        return true
      return false
    })
    .map((hero: any) => {
      let image: string | null = null
      let video: string | null = null
      if (hero.mediaType === 'image') {
        image = resolveMedia(hero.backgroundImage)
      } else if (hero.mediaType === 'video') {
        video = hero.backgroundVideo
          ? resolveMedia(hero.backgroundVideo)
          : hero.backgroundVideoUrl || null
      }
      if (!image && !video) return null
      return {
        image: image || '',
        video,
        mediaType: (hero.mediaType as 'image' | 'video') || 'image',
        title: hero.title || '',
        subtitle: hero.subtitle || '',
        cta: {
          label: hero.ctaButtons?.[0]?.label || 'DISCOVER MORE',
          href: hero.ctaButtons?.[0]?.link || '/shop',
        },
      }
    })
    .filter((s) => s !== null) as HeroSlide[]
}

// ── Fast path: only fetches hero-sections (single query, typically <200ms) ──
async function HeroData() {
  const payload = await getPayload({ config })
  const heroResult = await payload
    .find({
      collection: 'hero-sections',
      where: { active: { equals: true } },
      sort: 'order',
      depth: 2,
      limit: 10,
    })
    .catch(() => ({ docs: [] as any[] }))
  const heroSlides = transformHeroSlides(heroResult.docs)
  return <HeroCarousel slides={heroSlides} />
}

// ── Slow path: products + categories + blog (can take 1–3s) ──
async function BelowFoldData() {
  const payload = await getPayload({ config })
  const [productsResult, categoriesResult, blogResult] = await Promise.all([
    payload
      .find({
        collection: 'products',
        sort: '-featured',
        limit: 8,
        depth: 1,
        select: { name: true, slug: true, availability: true, categories: true, images: true },
      })
      .catch(() => ({ docs: [] as any[] })),
    payload
      .find({
        collection: 'categories',
        limit: 100,
        depth: 1,
        select: { name: true, slug: true, image: true },
      })
      .catch(() => ({ docs: [] as any[] })),
    payload
      .find({
        collection: 'blog-posts',
        where: { status: { equals: 'published' } },
        sort: '-publishedDate',
        limit: 3,
        depth: 1,
        select: {
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          categories: true,
          publishedDate: true,
          readTime: true,
          featured: true,
        },
      })
      .catch(() => ({ docs: [] as any[] })),
  ])

  // Transform products to match client expected format
  const products = productsResult.docs.map((product: any) => ({
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
        ? `/api/media/file/${product.images[0].image.filename}`
        : '/images/category-card-speaker.avif'),
  }))

  // Transform categories
  const categories = categoriesResult.docs.map((cat: any) => ({
    id: String(cat.id),
    name: cat.name,
    slug: cat.slug,
    image:
      cat.image?.url || (cat.image?.filename ? `/api/media/file/${cat.image.filename}` : undefined),
  }))

  // Transform blog posts
  const blogPosts: BlogPostData[] = blogResult.docs.map((post: any) => {
    // featuredImage can be a populated object or a bare ID
    const img = post.featuredImage
    const imageUrl =
      img && typeof img === 'object' && img.filename ? `/api/media/file/${img.filename}` : null

    // categories is a relationship array; pick the first populated name
    const firstCat = Array.isArray(post.categories) ? post.categories[0] : null
    const categoryName =
      typeof firstCat === 'object' && firstCat !== null
        ? firstCat.name || firstCat.slug || 'General'
        : 'General'

    return {
      image: imageUrl || '',
      category: categoryName,
      title: post.title,
      excerpt: post.excerpt || '',
      date: post.publishedDate
        ? new Date(post.publishedDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : '',
      readTime: post.readingTime ? `${post.readingTime} min read` : '',
      slug: post.slug,
    }
  })

  return (
    <HomePage
      initialProducts={products}
      initialCategories={categories}
      initialBlogPosts={blogPosts}
    />
  )
}

// ── Page root: hero streams in fast, below-fold streams in independently ──
export default function HomePageServer() {
  return (
    <>
      {/* Hero renders as soon as hero-sections query completes — unblocked from products/blog */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroData />
      </Suspense>
      {/* Below-fold loads independently; fallback reserves layout space */}
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <BelowFoldData />
      </Suspense>
    </>
  )
}

import { Suspense } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import HomePage from './HomePageClient'
import type { BlogPostData, HeroSlide } from './HomePageClient'

// Force dynamic - DB only reachable at runtime (Railway internal network)
export const dynamic = 'force-dynamic'

// Skeleton shown immediately while CMS queries run — mirrors the dark full-screen hero
function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-[#111] flex items-end pb-24 sm:pb-28 md:pb-32">
      <div className="max-w-[1800px] mx-auto w-full px-6 lg:px-12">
        <div className="max-w-4xl space-y-4">
          {/* Eyebrow */}
          <div className="h-2.5 w-28 bg-white/15 rounded animate-pulse" />
          {/* Headline line 1 */}
          <div className="h-10 sm:h-14 md:h-16 w-3/4 bg-white/15 rounded animate-pulse" />
          {/* Headline line 2 */}
          <div className="h-10 sm:h-14 md:h-16 w-1/2 bg-white/15 rounded animate-pulse" />
          {/* Subtitle */}
          <div className="h-3 w-72 bg-white/10 rounded animate-pulse mt-2" />
          {/* CTA */}
          <div className="h-10 w-36 bg-white/10 rounded animate-pulse mt-6" />
        </div>
      </div>
    </div>
  )
}

async function getHomePageData() {
  const payload = await getPayload({ config })
  const [productsResult, categoriesResult, blogResult, heroResult] = await Promise.all([
    payload
      .find({ collection: 'products', sort: '-featured', limit: 8, depth: 1 })
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
        depth: 2,
      })
      .catch(() => ({ docs: [] as any[] })),
    payload
      .find({
        collection: 'hero-sections',
        where: { active: { equals: true } },
        sort: 'order',
        depth: 2,
        limit: 10,
      })
      .catch(() => ({ docs: [] as any[] })),
  ])
  return { productsResult, categoriesResult, blogResult, heroResult }
}

async function HomePageData() {
  const { productsResult, categoriesResult, blogResult, heroResult } = await getHomePageData()

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

  // Transform hero sections
  const heroSlides = heroResult.docs
    .filter((hero: any) => {
      if (hero.mediaType === 'image' && hero.backgroundImage) return true
      if (hero.mediaType === 'video' && (hero.backgroundVideo || hero.backgroundVideoUrl))
        return true
      return false
    })
    .map((hero: any) => {
      let image: string | null = null
      let video: string | null = null

      // Prefer filename-based path over absolute url
      const resolveMedia = (media: any): string | null => {
        if (!media || typeof media !== 'object') return null
        if (media.filename) return `/api/media/file/${media.filename}`
        if (media.url) return media.url
        return null
      }

      if (hero.mediaType === 'image') {
        image = resolveMedia(hero.backgroundImage)
      } else if (hero.mediaType === 'video') {
        if (hero.backgroundVideo) {
          video = resolveMedia(hero.backgroundVideo)
        } else if (hero.backgroundVideoUrl) {
          video = hero.backgroundVideoUrl
        }
        // Don't set image for video slides — avoids poster flash
      }

      // Skip if we couldn't resolve any media
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

  return (
    <HomePage
      initialProducts={products}
      initialCategories={categories}
      initialBlogPosts={blogPosts}
      initialHeroSlides={heroSlides.length > 0 ? heroSlides : undefined}
    />
  )
}

// Outer wrapper renders immediately, streams HomePageData in
export default function HomePageServer() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomePageData />
    </Suspense>
  )
}

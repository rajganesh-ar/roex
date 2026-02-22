import { getPayload } from 'payload'
import config from '@payload-config'
import HomePage from './HomePageClient'
import type { BlogPostData } from './HomePageClient'

// Force dynamic - DB only reachable at runtime (Railway internal network)
export const dynamic = 'force-dynamic'

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

export default async function HomePageServer() {
  const { productsResult, categoriesResult, blogResult, heroResult } = await getHomePageData()

  // Debug: log raw blog/hero data so we can see what Payload actually returns
  console.log('[HomePage] blog docs count:', blogResult.docs.length)
  blogResult.docs.forEach((post: any, i: number) => {
    console.log(`[HomePage] blog[${i}] FULL:`, JSON.stringify(post, null, 2))
  })
  console.log('[HomePage] hero docs count:', heroResult.docs.length)
  heroResult.docs.forEach((hero: any, i: number) => {
    console.log(`[HomePage] hero[${i}] FULL:`, JSON.stringify(hero, null, 2))
  })

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
    .filter(Boolean)

  return (
    <HomePage
      initialProducts={products}
      initialCategories={categories}
      initialBlogPosts={blogPosts}
      initialHeroSlides={heroSlides.length > 0 ? heroSlides : undefined}
    />
  )
}

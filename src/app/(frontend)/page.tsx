import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import HomePage from './HomePageClient'
import type { BlogPostData } from './HomePageClient'

// Force dynamic - DB only reachable at runtime (Railway internal network)
export const dynamic = 'force-dynamic'

const getHomePageData = unstable_cache(
  async () => {
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
          depth: 1,
        })
        .catch(() => ({ docs: [] as any[] })),
      payload
        .find({
          collection: 'hero-sections',
          where: { active: { equals: true } },
          depth: 1,
          limit: 10,
        })
        .catch(() => ({ docs: [] as any[] })),
    ])
    return { productsResult, categoriesResult, blogResult, heroResult }
  },
  ['home-page-data'],
  { revalidate: 60 },
)

export default async function HomePageServer() {
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
        ? `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/media/${product.images[0].image.filename}`
        : '/images/category-card-speaker.avif'),
  }))

  // Transform categories
  const categories = categoriesResult.docs.map((cat: any) => ({
    id: String(cat.id),
    name: cat.name,
    slug: cat.slug,
    image:
      cat.image?.url ||
      (cat.image?.filename
        ? `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/media/${cat.image.filename}`
        : undefined),
  }))

  // Transform blog posts
  const blogPosts: BlogPostData[] = blogResult.docs.map((post: any) => ({
    image:
      post.featuredImage?.url ||
      (post.featuredImage?.filename
        ? `/media/${post.featuredImage.filename}`
        : '/images/hero-background-2.avif'),
    category:
      post.category?.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) ||
      'General',
    title: post.title,
    excerpt: post.excerpt || '',
    date: post.publishedDate
      ? new Date(post.publishedDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '',
    readTime: post.readTime ? `${post.readTime} min read` : '',
    slug: post.slug,
  }))

  // Transform hero sections
  const heroSlides = heroResult.docs
    .filter((hero: any) => {
      // Only include hero sections that have actual media
      if (hero.mediaType === 'image' && hero.backgroundImage) return true
      if (hero.mediaType === 'video' && (hero.backgroundVideo || hero.backgroundVideoUrl))
        return true
      return false
    })
    .map((hero: any) => {
      let image = '/images/hero-background-1.avif'
      let video: string | null = null

      if (hero.mediaType === 'image' && hero.backgroundImage) {
        image =
          hero.backgroundImage?.url ||
          (hero.backgroundImage?.filename
            ? `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/media/${hero.backgroundImage.filename}`
            : '/images/hero-background-1.avif')
      } else if (hero.mediaType === 'video') {
        // Get video URL from uploaded file or external URL
        if (hero.backgroundVideo?.url) {
          video = hero.backgroundVideo.url
        } else if (hero.backgroundVideo?.filename) {
          video = `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/media/${hero.backgroundVideo.filename}`
        } else if (hero.backgroundVideoUrl) {
          video = hero.backgroundVideoUrl
        }
        // Also get a poster image if backgroundImage is set
        if (hero.backgroundImage) {
          image =
            hero.backgroundImage?.url ||
            (hero.backgroundImage?.filename
              ? `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/media/${hero.backgroundImage.filename}`
              : '/images/hero-background-1.avif')
        }
      }

      return {
        image,
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

  return (
    <HomePage
      initialProducts={products}
      initialCategories={categories}
      initialBlogPosts={blogPosts}
      initialHeroSlides={heroSlides.length > 0 ? heroSlides : undefined}
    />
  )
}

import { getPayload } from 'payload'
import config from '@payload-config'
import BlogPageClient from './BlogPageClient'

export const dynamic = 'force-dynamic'

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  technology: '/images/SMARTAudio-App-retuschiert.avif',
  lifestyle: '/images/elegent-spa.avif',
  'behind-the-sound': '/images/menu-speakers.avif',
  'product-news': '/images/category-card-speaker.avif',
  partnerships: '/images/elegent-retail.avif',
  events: '/images/elegent-resturant.avif',
}
const DEFAULT_BLOG_IMAGE = '/images/hero-background-2.avif'

export default async function BlogPage() {
  const payload = await getPayload({ config })

  const postsResult = await payload
    .find({
      collection: 'blog-posts',
      where: { status: { equals: 'published' } },
      sort: '-publishedDate',
      limit: 50,
      depth: 1,
    })
    .catch(() => ({ docs: [] as any[] }))

  const posts = postsResult.docs.map((post: any) => ({
    id: String(post.id),
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    featuredImage:
      post.featuredImage?.url ||
      (post.featuredImage?.filename ? `/api/media/file/${post.featuredImage.filename}` : null) ||
      CATEGORY_FALLBACK_IMAGES[post.category] ||
      DEFAULT_BLOG_IMAGE,
    category: post.category || '',
    author: post.author
      ? {
          name: post.author.name,
          role: post.author.role,
          avatar: post.author.avatar?.url || null,
        }
      : null,
    publishedDate: post.publishedDate || null,
    readTime: post.readTime || null,
    featured: post.featured || false,
  }))

  return <BlogPageClient initialPosts={posts} />
}

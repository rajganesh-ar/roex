import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import BlogPostClient from './BlogPostClient'

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

function formatPost(post: any) {
  return {
    id: String(post.id),
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    featuredImage:
      post.featuredImage?.url ||
      (post.featuredImage?.filename ? `/media/${post.featuredImage.filename}` : null) ||
      CATEGORY_FALLBACK_IMAGES[post.category] ||
      DEFAULT_BLOG_IMAGE,
    content: post.content || null,
    category: post.category || '',
    author: post.author
      ? {
          name: post.author.name,
          role: post.author.role,
          avatar: post.author.avatar?.url || null,
        }
      : null,
    tags: post.tags?.map((t: any) => t.tag) || [],
    publishedDate: post.publishedDate || null,
    readTime: post.readTime || null,
    featured: post.featured || false,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const postsResult = await payload.find({
    collection: 'blog-posts',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    depth: 2,
    limit: 1,
  })

  if (!postsResult.docs || postsResult.docs.length === 0) {
    notFound()
  }

  const post = formatPost(postsResult.docs[0])

  // Fetch related posts from same category
  const relatedResult = await payload
    .find({
      collection: 'blog-posts',
      where: {
        category: { equals: post.category },
        slug: { not_equals: slug },
        status: { equals: 'published' },
      },
      limit: 3,
      depth: 1,
    })
    .catch(() => ({ docs: [] as any[] }))

  const relatedPosts = relatedResult.docs.map(formatPost).slice(0, 2)

  return <BlogPostClient post={post} relatedPosts={relatedPosts} />
}

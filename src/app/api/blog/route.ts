import { NextResponse, NextRequest } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const { searchParams } = new URL(req.url)

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category') || ''
    const featured = searchParams.get('featured') === 'true'
    const slug = searchParams.get('slug') || ''

    // Single post by slug
    if (slug) {
      const posts = await payload.find({
        collection: 'blog-posts',
        where: {
          slug: { equals: slug },
          status: { equals: 'published' },
        },
        depth: 2,
        limit: 1,
      })

      if (posts.docs.length === 0) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      }

      return NextResponse.json({ post: formatPost(posts.docs[0]) })
    }

    // Build where query
    const where: any = {
      status: { equals: 'published' },
    }

    if (category) {
      where.category = { equals: category }
    }

    if (featured) {
      where.featured = { equals: true }
    }

    const posts = await payload.find({
      collection: 'blog-posts',
      where,
      sort: '-publishedDate',
      limit,
      page,
      depth: 1,
    })

    return NextResponse.json(
      {
        posts: posts.docs.map(formatPost),
        totalDocs: posts.totalDocs,
        totalPages: posts.totalPages,
        page: posts.page,
        hasNextPage: posts.hasNextPage,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
        },
      },
    )
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 })
  }
}

function formatPost(post: any) {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    featuredImage:
      post.featuredImage?.url || post.featuredImage?.filename
        ? post.featuredImage.url || `/api/media/file/${post.featuredImage.filename}`
        : null,
    content: post.content,
    category: post.category,
    author: post.author
      ? {
          name: post.author.name,
          role: post.author.role,
          avatar: post.author.avatar?.url || null,
        }
      : null,
    tags: post.tags?.map((t: any) => t.tag) || [],
    publishedDate: post.publishedDate,
    readTime: post.readTime,
    featured: post.featured,
  }
}

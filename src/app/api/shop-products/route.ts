import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const categories = searchParams.get('categories')?.split(',').filter(Boolean) || []
    const sortBy = searchParams.get('sortBy') || 'featured'
    const limit = parseInt(searchParams.get('limit') || '50')
    const availabilityFilter = searchParams.get('availability') || ''

    const payload = await getPayloadClient()

    // Build the where clause
    const where: any = {}

    // Search by name
    if (search) {
      where.name = {
        contains: search,
      }
    }

    // Filter by categories — resolve names/slugs to IDs first
    if (categories.length > 0) {
      // Check if values are numeric IDs already
      const areIds = categories.every((c) => /^\d+$/.test(c))
      if (areIds) {
        where.categories = { in: categories.map(Number) }
      } else {
        // Look up category IDs by slug or name
        const catResult = await payload.find({
          collection: 'categories',
          where: {
            or: [{ slug: { in: categories } }, { name: { in: categories } }],
          },
          limit: 100,
        })
        const catIds = catResult.docs.map((c: any) => c.id)
        if (catIds.length > 0) {
          where.categories = { in: catIds }
        } else {
          // No matching categories, return empty
          return NextResponse.json({ products: [], total: 0, page: 1, totalPages: 0 })
        }
      }
    }

    // Filter by availability
    if (availabilityFilter === 'available' || availabilityFilter === 'unavailable') {
      where.availability = { equals: availabilityFilter }
    }

    // Determine sort
    let sort: string = '-createdAt'
    switch (sortBy) {
      case 'name':
        sort = 'name'
        break
      case 'newest':
        sort = '-createdAt'
        break
      case 'featured':
        sort = '-featured'
        break
    }

    const products = await payload.find({
      collection: 'products',
      where,
      sort,
      limit,
      depth: 1, // Only 1 level needed for category name and image URL
    })

    // Transform products to include image URL
    const transformedProducts = products.docs.map((product: any) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      category:
        Array.isArray(product.categories) && product.categories.length > 0
          ? typeof product.categories[0] === 'object'
            ? product.categories[0].name
            : product.categories[0]
          : '',
      categoryId:
        Array.isArray(product.categories) && product.categories.length > 0
          ? typeof product.categories[0] === 'object'
            ? product.categories[0].id
            : product.categories[0]
          : '',
      image:
        product.images?.[0]?.image?.url || product.images?.[0]?.image?.filename
          ? `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/media/${product.images[0].image.filename}`
          : '/images/category-card-speaker.avif',
      availability: product.availability || 'available',
      featured: product.featured,
    }))

    return NextResponse.json(
      {
        products: transformedProducts,
        total: products.totalDocs,
        page: products.page,
        totalPages: products.totalPages,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      },
    )
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

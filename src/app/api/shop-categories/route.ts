import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function GET() {
  try {
    const payload = await getPayloadClient()

    const categories = await payload.find({
      collection: 'categories',
      limit: 100,
      depth: 0, // No need to populate relationships
      select: {
        name: true,
        slug: true,
      },
    })

    const categoriesData = categories.docs.map((category: any) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
    }))

    return NextResponse.json(
      { categories: categoriesData },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      },
    )
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

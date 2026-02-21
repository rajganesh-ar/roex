import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const payload = await getPayloadClient()

    // Fetch the product by slug
    const productsResult = await payload.find({
      collection: 'products',
      where: {
        slug: {
          equals: slug,
        },
      },
      depth: 2,
      limit: 1,
    })

    if (!productsResult.docs || productsResult.docs.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const product = productsResult.docs[0] as any

    // Fetch related products from the same categories
    const firstCatId =
      Array.isArray(product.categories) && product.categories.length > 0
        ? typeof product.categories[0] === 'object'
          ? product.categories[0].id
          : product.categories[0]
        : null
    const relatedProductsResult = await payload.find({
      collection: 'products',
      where: {
        ...(firstCatId ? { categories: { in: [firstCatId] } } : {}),
        id: {
          not_equals: product.id,
        },
      },
      limit: 3,
      depth: 2,
    })

    // Transform product data
    const transformedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      description: product.description,
      longDescription: product.longDescription,
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
      images: product.images?.map((img: any) => {
        const imageUrl =
          img.image?.url ||
          (img.image?.filename
            ? `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/media/${img.image.filename}`
            : '/images/category-card-speaker.avif')
        return imageUrl
      }) || ['/images/category-card-speaker.avif'],
      stock: product.stock,
      sku: product.sku,
      rating: 4.8, // Default rating - you could add this field to the schema
      reviewCount: 0, // Default review count - you could add this field to the schema
      specifications: product.specifications || [],
    }

    // Transform related products
    const transformedRelatedProducts = relatedProductsResult.docs.map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      category:
        Array.isArray(p.categories) && p.categories.length > 0
          ? typeof p.categories[0] === 'object'
            ? p.categories[0].name
            : p.categories[0]
          : '',
      image:
        p.images?.[0]?.image?.url ||
        (p.images?.[0]?.image?.filename
          ? `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/media/${p.images[0].image.filename}`
          : '/images/category-card-speaker.avif'),
      inStock: p.stock > 0,
    }))

    return NextResponse.json({
      product: transformedProduct,
      relatedProducts: transformedRelatedProducts,
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

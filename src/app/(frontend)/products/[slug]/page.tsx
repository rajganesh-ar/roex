import { getPayloadClient } from '@/lib/payload'
import { notFound } from 'next/navigation'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const payload = await getPayloadClient()
  const { slug } = await params

  const result = await payload.find({
    collection: 'products',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const product = result.docs[0]

  if (!product) return notFound()

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-4xl font-bold">{product.name}</h1>

      <p className="text-2xl text-gray-600 mt-4">
        ₹{product.price}
      </p>

      <p className="mt-6">
        {product.description}
      </p>
    </div>
  )
}

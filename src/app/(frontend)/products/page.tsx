import { getPayloadClient } from '@/lib/payload'

export default async function ProductsPage() {
  const payload = await getPayloadClient()

  const products = await payload.find({
    collection: 'products',
  })

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-4xl font-bold mb-6">Products</h1>

      <div className="grid grid-cols-3 gap-6">
        {products.docs.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600">₹{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

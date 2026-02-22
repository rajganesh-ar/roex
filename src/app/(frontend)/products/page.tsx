import { redirect } from 'next/navigation'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      qs.append(key, Array.isArray(value) ? (value[0] ?? '') : value)
    }
  })
  const queryString = qs.toString()
  redirect(queryString ? `/shop?${queryString}` : '/shop')
}

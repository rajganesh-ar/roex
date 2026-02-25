import { getPayload } from 'payload'
import config from '../src/payload.config'

async function main() {
  const payload = await getPayload({ config })

  const cats = await payload.find({ collection: 'categories', limit: 100, depth: 1 })
  console.log('=== CATEGORIES ===')
  for (const c of cats.docs) {
    const parent = (c as any).parent
    const parentName = parent && typeof parent === 'object' ? parent.name : 'none'
    console.log(`  id=${c.id}  name="${c.name}"  slug="${c.slug}"  parent="${parentName}"`)
  }

  const prods = await payload.find({ collection: 'products', limit: 100, depth: 1 })
  console.log('\n=== PRODUCTS ===')
  for (const p of prods.docs) {
    const catNames =
      (p as any).categories?.map((c: any) => (typeof c === 'object' ? c.name : c)) || []
    console.log(`  id=${p.id}  name="${p.name}"  cats=[${catNames.join(', ')}]`)
  }

  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

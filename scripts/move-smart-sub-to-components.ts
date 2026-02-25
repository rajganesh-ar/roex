/**
 * Move SMART & SUB products to the "Components" category.
 *
 * Usage: npx cross-env NODE_OPTIONS="--no-deprecation --import=tsx/esm" tsx scripts/move-smart-sub-to-components.ts
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function main() {
  const payload = await getPayload({ config })

  // Find the Components category
  const componentsCat = await payload.find({
    collection: 'categories',
    where: { slug: { equals: 'components' } },
    limit: 1,
  })

  if (!componentsCat.docs.length) {
    console.error('Components category not found!')
    process.exit(1)
  }

  const componentsId = componentsCat.docs[0].id
  console.log(`Components category id: ${componentsId}`)

  // Find all products whose name starts with "SMART " or "SUB "
  const products = await payload.find({
    collection: 'products',
    limit: 100,
    depth: 0,
  })

  const targets = products.docs.filter(
    (p) => p.name.startsWith('SMART ') || p.name.startsWith('SUB '),
  )

  console.log(`Found ${targets.length} SMART/SUB products to move:\n`)

  for (const product of targets) {
    console.log(`  Moving "${product.name}" (id=${product.id}) → Components`)
    await payload.update({
      collection: 'products',
      id: product.id,
      data: {
        categories: [componentsId],
      },
    })
  }

  console.log(`\nDone. Moved ${targets.length} products to Components.`)
  process.exit(0)
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})

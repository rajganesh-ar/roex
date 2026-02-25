/**
 * One-off script to update product names and descriptions in the database:
 * - Replace "NewTec" (any casing) with "ROEX"
 * - Transform camelCase product names: "SMARTconnect" → "SMART Connect"
 *
 * Usage: npx tsx scripts/fix-product-names.ts
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

function formatProductName(name: string): string {
  if (!name) return name

  // Replace NewTec / Newtec / NEWTEC with ROEX
  let formatted = name.replace(/new\s*tec/gi, 'ROEX')

  // Split known uppercase prefixes from lowercase model name
  // e.g. "SMARTconnect" → "SMART Connect", "CONOpendo" → "CONO Pendo"
  formatted = formatted.replace(
    /^(SMART|CONO|PRO|NT)([a-z])/,
    (_, prefix: string, firstChar: string) => `${prefix} ${firstChar.toUpperCase()}`,
  )

  return formatted
}

function replaceInText(text: string): string {
  if (!text) return text
  return text.replace(/new\s*tec/gi, 'ROEX')
}

async function main() {
  const payload = await getPayload({ config })

  const allProducts = await payload.find({
    collection: 'products',
    limit: 500,
    depth: 0,
  })

  console.log(`Found ${allProducts.docs.length} products to scan`)

  let updated = 0

  for (const product of allProducts.docs) {
    const newName = formatProductName(product.name)
    const newDesc = product.description ? replaceInText(product.description) : product.description

    const nameChanged = newName !== product.name
    const descChanged = newDesc !== product.description

    if (nameChanged || descChanged) {
      const updateData: Record<string, any> = {}
      if (nameChanged) updateData.name = newName
      if (descChanged) updateData.description = newDesc

      console.log(
        `Updating: "${product.name}" → "${newName}"${descChanged ? ' (+ description)' : ''}`,
      )

      await payload.update({
        collection: 'products',
        id: product.id,
        data: updateData,
      })
      updated++
    }
  }

  console.log(`\nDone. Updated ${updated} of ${allProducts.docs.length} products.`)
  process.exit(0)
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})

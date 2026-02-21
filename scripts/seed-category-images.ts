/**
 * Seed Category Images
 * ─────────────────────
 * Uploads local images from public/images/ to Payload's media collection
 * and links each category to the correct image.
 *
 * Usage:
 *   pnpm seed:category-images
 *
 * Prerequisites:
 *   - DATABASE_URL and PAYLOAD_SECRET set in .env
 *   - Dev server does NOT need to be running
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Map category slugs → local image filename
const CATEGORY_IMAGE_MAP: Record<string, string> = {
  speakers: 'menu-speakers.jpg',
  'cabled-speakers': 'category-card-cabledspeakers.jpg',
  'wireless-smart-speakers': 'category-card-wirelesspeakers.jpg',
  components: 'category-card-components.jpg',
  cables: 'category-card-cable.jpg',
  'ceiling-speakers': 'category-card-speaker.jpg',
  'track-speakers': 'category-card-cabledspeakers.jpg',
  'pendant-speakers': 'category-card-wirelesspeakers.jpg',
  'smart-audio': 'SMARTAudio-App-retuschiert.png',
}

// Additional name-based matching for slugs not in the map
function getImageFilename(slug: string, name: string): string | null {
  if (CATEGORY_IMAGE_MAP[slug]) return CATEGORY_IMAGE_MAP[slug]
  const lower = name.toLowerCase()
  if (lower.includes('cabled') || lower.includes('cable')) return 'category-card-cabledspeakers.jpg'
  if (lower.includes('wireless')) return 'category-card-wirelesspeakers.jpg'
  if (lower.includes('component')) return 'category-card-components.jpg'
  if (lower.includes('ceiling')) return 'category-card-speaker.jpg'
  if (lower.includes('track')) return 'category-card-cabledspeakers.jpg'
  if (lower.includes('pendant')) return 'category-card-wirelesspeakers.jpg'
  if (lower.includes('smart')) return 'SMARTAudio-App-retuschiert.png'
  if (lower.includes('speaker')) return 'menu-speakers.jpg'
  return null
}

async function run() {
  // Dynamically import config to avoid ESM/CJS issues
  const { default: config } = await import('../src/payload.config.js')
  const payload = await getPayload({ config })

  const imagesDir = path.resolve(__dirname, '../public/images')

  // Fetch all categories
  const { docs: categories } = await payload.find({
    collection: 'categories',
    limit: 200,
    depth: 0,
  })

  console.log(`Found ${categories.length} categories`)

  // Cache: filename → media ID (avoid duplicate uploads)
  const uploadedMedia: Record<string, number> = {}

  for (const cat of categories) {
    const slug = (cat as any).slug as string
    const name = (cat as any).name as string
    const existingImage = (cat as any).image

    if (existingImage) {
      console.log(`  ✓ ${name} — already has image, skipping`)
      continue
    }

    const filename = getImageFilename(slug, name)
    if (!filename) {
      console.warn(`  ⚠ ${name} (${slug}) — no matching image, skipping`)
      continue
    }

    const imagePath = path.join(imagesDir, filename)
    if (!fs.existsSync(imagePath)) {
      console.warn(`  ⚠ ${name} — file not found: ${imagePath}`)
      continue
    }

    // Upload media if not already uploaded in this run
    if (!uploadedMedia[filename]) {
      // Reuse existing media with same filename if present
      try {
        const existing = await payload.find({
          collection: 'media',
          where: { filename: { equals: filename } },
          limit: 1,
        })
        if (existing.docs.length > 0) {
          uploadedMedia[filename] = existing.docs[0].id as number
          console.log(`  ✓ Reusing media #${existing.docs[0].id} for ${filename}`)
        }
      } catch { /* ignore */ }
    }

    if (!uploadedMedia[filename]) {
      try {
        const fileBuffer = fs.readFileSync(imagePath)
        const ext = path.extname(filename).slice(1).toLowerCase()
        const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg'

        const media = await payload.create({
          collection: 'media',
          data: { alt: name },
          file: {
            data: fileBuffer,
            name: filename,
            size: fileBuffer.length,
            mimetype: mimeType,
          },
        })
        uploadedMedia[filename] = media.id as number
        console.log(`  ↑ Uploaded ${filename} → media #${media.id}`)
      } catch (err: any) {
        console.error(`  ✗ Failed to upload ${filename}:`, err.message)
        continue
      }
    }

    const mediaId = uploadedMedia[filename]

    // Update category with media reference
    try {
      await payload.update({
        collection: 'categories',
        id: (cat as any).id,
        data: { image: mediaId },
      })
      console.log(`  ✓ ${name} (${slug}) → linked to media #${mediaId}`)
    } catch (err: any) {
      console.error(`  ✗ Failed to update category ${name}:`, err.message)
    }
  }

  console.log('\nDone.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})

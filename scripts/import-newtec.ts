/**
 * NewTec Audio Product Importer
 * ──────────────────────────────
 * Scrapes products from https://www.newtec-audio.com and imports them
 * into Payload CMS via the Local API.
 *
 * Usage:
 *   pnpm import:products          # full import
 *   pnpm import:products -- --dry # dry-run (no writes)
 *
 * Prerequisites:
 *   - DATABASE_URL and PAYLOAD_SECRET set in .env
 *   - The Payload server does NOT need to be running
 */

import 'dotenv/config'
import { getPayload, type Payload } from 'payload'
import * as cheerio from 'cheerio'
import path from 'path'
import { pathToFileURL } from 'url'

// ─── Constants ───────────────────────────────────────────────────────────────
const BASE = 'https://www.newtec-audio.com/en'
const LISTING_PAGES = [`${BASE}/products/smart-speakers`, `${BASE}/products/speakers`]
const CATEGORY_MAP: Record<string, string> = {
  'smart-speakers': 'Wireless Smart Speakers',
  speakers: 'Cabled Speakers',
}
const DRY_RUN = process.argv.includes('--dry')
const DELAY_MS = 800 // polite delay between fetches

// ─── Types ───────────────────────────────────────────────────────────────────
interface ScrapedProduct {
  name: string
  slug: string
  sourceUrl: string
  subtitle: string
  shortDescription: string
  longDescription: string
  colors: string[]
  applications: string[]
  productType: string // SPEAKERS, SUBWOOFER, CONTROL UNIT
  categoryKey: string // smart-speakers | speakers
  specifications: { label: string; value: string }[]
  imageUrls: string[]
  downloadLinks: { title: string; url: string }[]
  dimensions: string
  material: string
}

// ─── Utilities ───────────────────────────────────────────────────────────────
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[™®©]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function fetchHtml(url: string): Promise<string> {
  console.log(`  ↓ Fetching: ${url}`)
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml',
    },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.text()
}

async function downloadFile(
  url: string,
): Promise<{ buffer: Buffer; name: string; mime: string } | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    })
    if (!res.ok) return null
    const arrayBuf = await res.arrayBuffer()
    const buffer = Buffer.from(arrayBuf)
    const filename = path.basename(new URL(url).pathname)
    const ext = path.extname(filename).toLowerCase()
    const mimeMap: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.zip': 'application/zip',
    }
    return { buffer, name: filename, mime: mimeMap[ext] || 'application/octet-stream' }
  } catch (e) {
    console.warn(`  ⚠ Failed to download file: ${url}`, (e as Error).message)
    return null
  }
}

// Backward-compat alias
const downloadImage = downloadFile

// ─── Step 1: Discover product URLs from listing pages ────────────────────────
async function discoverProductUrls(): Promise<
  { url: string; categoryKey: string; productType: string }[]
> {
  const products: { url: string; categoryKey: string; productType: string }[] = []

  for (const listingUrl of LISTING_PAGES) {
    const categoryKey = listingUrl.includes('smart-speakers') ? 'smart-speakers' : 'speakers'
    const html = await fetchHtml(listingUrl)
    const $ = cheerio.load(html)

    // Find product links — they follow the pattern /en/product/[slug]/
    const seen = new Set<string>()
    $('a[href*="/en/product/"]').each((_, el) => {
      const href = $(el).attr('href')
      if (!href) return
      // Normalize URL
      const fullUrl = href.startsWith('http') ? href : `${BASE}${href}`
      if (seen.has(fullUrl)) return
      seen.add(fullUrl)

      // Try to get product type from nearby text
      const parent = $(el).closest('[class]')
      const typeText = parent.find('*').first().text().trim().toUpperCase()
      let productType = 'SPEAKERS'
      if (typeText.includes('SUBWOOFER')) productType = 'SUBWOOFER'
      else if (typeText.includes('CONTROL')) productType = 'CONTROL UNIT'

      products.push({ url: fullUrl, categoryKey, productType })
    })

    await sleep(DELAY_MS)
  }

  // Deduplicate by URL
  const unique = new Map<string, (typeof products)[0]>()
  for (const p of products) unique.set(p.url, p)
  return Array.from(unique.values())
}

// ─── Step 2: Scrape an individual product page ───────────────────────────────
async function scrapeProduct(
  url: string,
  categoryKey: string,
  productType: string,
): Promise<ScrapedProduct | null> {
  try {
    const html = await fetchHtml(url)
    const $ = cheerio.load(html)

    // Name (h1)
    const name = $('h1').first().text().trim()
    if (!name) {
      console.warn(`  ⚠ No product name found at ${url}, skipping`)
      return null
    }

    // Slug from URL
    const urlPath = new URL(url).pathname
    const slug = urlPath.split('/').filter(Boolean).pop() || slugify(name)

    // Subtitle (h2 right after h1, or .subtitle class)
    const subtitle = $('h1').next('h2').text().trim() || $('h2').first().text().trim() || ''

    // Short description — first <p> with substantial text in the main content
    let shortDescription = ''
    $('p').each((_, el) => {
      const text = $(el).text().trim()
      if (text.length > 30 && !shortDescription) {
        shortDescription = text
      }
    })

    // Long description — collect all descriptive paragraphs
    const descParagraphs: string[] = []
    $('p').each((_, el) => {
      const text = $(el).text().trim()
      if (text.length > 40 && !text.includes('©') && !text.includes('Cookie')) {
        descParagraphs.push(text)
      }
    })
    const longDescription = descParagraphs.join('\n\n')

    // Colors
    const colors: string[] = []
    const colorSection = $('*:contains("Colours available")').first().parent()
    const colorText =
      colorSection.text() || $('td:contains("Colour"), td:contains("Color")').next('td').text()
    if (colorText) {
      const colorMatches = colorText.match(
        /\b(white|black|silver|grey|gray|red|blue|green|gold|bronze|anthracite|wood)\b/gi,
      )
      if (colorMatches) {
        const seen = new Set<string>()
        colorMatches.forEach((c) => {
          const normalized = c.charAt(0).toUpperCase() + c.slice(1).toLowerCase()
          if (!seen.has(normalized)) {
            seen.add(normalized)
            colors.push(normalized)
          }
        })
      }
    }

    // Applications (Ceiling, Wall, Pendant, etc.)
    const applications: string[] = []
    const appSeen = new Set<string>()
    $('a[href*="application="]').each((_, el) => {
      const text = $(el).text().trim()
      if (text && !appSeen.has(text)) {
        appSeen.add(text)
        applications.push(text)
      }
    })

    // Technical specifications
    const specifications: { label: string; value: string }[] = []
    // Look for table rows in Technical Data section
    $('table tr, .tech-data tr').each((_, row) => {
      const cells = $(row).find('td, th')
      if (cells.length >= 2) {
        const label = $(cells[0]).text().trim()
        const value = $(cells[1]).text().trim()
        if (label && value && label.length < 60 && value.length < 200) {
          specifications.push({ label, value })
        }
      }
    })

    // Also extract from key-value pairs in the page
    const dimMatch = html.match(/Dimensions[^<]*?<[^>]*>([^<]+)/i)
    const dimensions = dimMatch
      ? dimMatch[1].trim()
      : specifications.find((s) => s.label.toLowerCase().includes('dimension'))?.value || ''

    const matMatch = html.match(/Material[^<]*?<[^>]*>([^<]+)/i)
    const material = matMatch
      ? matMatch[1].trim()
      : specifications.find((s) => s.label.toLowerCase().includes('material'))?.value || ''

    // Images — collect full-resolution image URLs
    const imageUrls: string[] = []
    const imgSeen = new Set<string>()
    $('img').each((_, el) => {
      let src = $(el).attr('src') || ''
      if (!src) return
      // Skip tiny thumbnails, logos, icons
      if (src.includes('logo') || src.includes('icon') || src.includes('flag')) return
      // Prefer full-size over thumbnails
      src = src.replace(/-\d+x\d+\./, '.') // Remove WP thumbnail suffix
      if (!src.startsWith('http')) src = `https://www.newtec-audio.com${src}`
      if (
        !imgSeen.has(src) &&
        (src.includes('.jpg') ||
          src.includes('.jpeg') ||
          src.includes('.png') ||
          src.includes('.webp'))
      ) {
        imgSeen.add(src)
        imageUrls.push(src)
      }
    })

    // Also check link hrefs (lightbox galleries)
    $('a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"], a[href$=".webp"]').each((_, el) => {
      let href = $(el).attr('href') || ''
      if (!href.startsWith('http')) href = `https://www.newtec-audio.com${href}`
      href = href.replace(/-\d+x\d+\./, '.')
      if (!imgSeen.has(href)) {
        imgSeen.add(href)
        imageUrls.push(href)
      }
    })

    // Downloads (PDFs)
    const downloadLinks: { title: string; url: string }[] = []
    $('a[href$=".pdf"], a[href$=".zip"]').each((_, el) => {
      const href = $(el).attr('href')
      const title = $(el).text().trim() || 'Document'
      if (href) {
        downloadLinks.push({
          title: title.replace(/^\s*[\s\S]*$/, title),
          url: href.startsWith('http') ? href : `https://www.newtec-audio.com${href}`,
        })
      }
    })

    return {
      name,
      slug,
      sourceUrl: url,
      subtitle,
      shortDescription: shortDescription || subtitle,
      longDescription,
      colors,
      applications,
      productType,
      categoryKey,
      specifications,
      imageUrls: imageUrls.slice(0, 8), // Cap at 8 images
      downloadLinks,
      dimensions,
      material,
    }
  } catch (e) {
    console.error(`  ✗ Error scraping ${url}:`, (e as Error).message)
    return null
  }
}

// ─── Step 3: Import into Payload ─────────────────────────────────────────────

// Caches to avoid duplicate lookups/creates
const categoryCache = new Map<string, number>()
const tagCache = new Map<string, number>()
const colorCache = new Map<string, number>()
const specDefCache = new Map<string, number>()
const mediaCache = new Map<string, number>()

async function ensureCategory(payload: Payload, name: string): Promise<number> {
  const slug = slugify(name)
  if (categoryCache.has(slug)) return categoryCache.get(slug)!

  const existing = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  if (existing.docs.length) {
    const id = existing.docs[0].id as number
    categoryCache.set(slug, id)
    return id
  }

  const created = await payload.create({
    collection: 'categories',
    data: { name, slug },
  })
  const id = created.id as number
  categoryCache.set(slug, id)
  console.log(`    ✓ Created category: ${name}`)
  return id
}

async function ensureTag(payload: Payload, name: string): Promise<number> {
  const slug = slugify(name)
  if (tagCache.has(slug)) return tagCache.get(slug)!

  const existing = await payload.find({
    collection: 'tags',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  if (existing.docs.length) {
    const id = existing.docs[0].id as number
    tagCache.set(slug, id)
    return id
  }

  const created = await payload.create({
    collection: 'tags',
    data: { name, slug },
  })
  const id = created.id as number
  tagCache.set(slug, id)
  console.log(`    ✓ Created tag: ${name}`)
  return id
}

async function ensureColor(payload: Payload, name: string): Promise<number> {
  const key = name.toLowerCase()
  if (colorCache.has(key)) return colorCache.get(key)!

  const hexMap: Record<string, string> = {
    white: '#FFFFFF',
    black: '#000000',
    silver: '#C0C0C0',
    grey: '#808080',
    gray: '#808080',
    red: '#FF0000',
    blue: '#0000FF',
    green: '#008000',
    gold: '#FFD700',
    bronze: '#CD7F32',
    anthracite: '#293133',
    wood: '#DEB887',
  }

  const existing = await payload.find({
    collection: 'colors',
    where: { name: { equals: name } },
    limit: 1,
  })
  if (existing.docs.length) {
    const id = existing.docs[0].id as number
    colorCache.set(key, id)
    return id
  }

  const created = await payload.create({
    collection: 'colors',
    data: { name, hex: hexMap[key] || '' },
  })
  const id = created.id as number
  colorCache.set(key, id)
  console.log(`    ✓ Created color: ${name}`)
  return id
}

async function ensureSpecDefinition(payload: Payload, label: string): Promise<number> {
  const key = label.toLowerCase()
  if (specDefCache.has(key)) return specDefCache.get(key)!

  const existing = await payload.find({
    collection: 'specification-definitions',
    where: { label: { contains: label } },
    limit: 1,
  })
  if (existing.docs.length) {
    const id = existing.docs[0].id as number
    specDefCache.set(key, id)
    return id
  }

  // Determine group by label
  let group: 'general' | 'electrical' | 'physical' | 'performance' = 'general'
  const lbl = label.toLowerCase()
  if (lbl.includes('dimension') || lbl.includes('weight') || lbl.includes('material'))
    group = 'physical'
  else if (
    lbl.includes('impedance') ||
    lbl.includes('power') ||
    lbl.includes('voltage') ||
    lbl.includes('watt')
  )
    group = 'electrical'
  else if (
    lbl.includes('frequency') ||
    lbl.includes('spl') ||
    lbl.includes('sensitivity') ||
    lbl.includes('range')
  )
    group = 'performance'

  const created = await payload.create({
    collection: 'specification-definitions',
    data: { label, group },
  })
  const id = created.id as number
  specDefCache.set(key, id)
  console.log(`    ✓ Created spec definition: ${label}`)
  return id
}

async function uploadMedia(
  payload: Payload,
  imageUrl: string,
  altText: string,
): Promise<number | null> {
  if (mediaCache.has(imageUrl)) return mediaCache.get(imageUrl)!

  const img = await downloadImage(imageUrl)
  if (!img) return null

  try {
    const created = await payload.create({
      collection: 'media',
      data: { alt: altText || 'Product image' },
      file: {
        data: img.buffer,
        name: img.name,
        mimetype: img.mime,
        size: img.buffer.length,
      },
    })
    const id = created.id as number
    mediaCache.set(imageUrl, id)
    return id
  } catch (e) {
    console.warn(`  ⚠ Failed to upload media: ${imageUrl}`, (e as Error).message)
    return null
  }
}

async function importProduct(payload: Payload, product: ScrapedProduct): Promise<void> {
  console.log(`\n  ▸ Importing: ${product.name}`)

  // Check if already imported (by sourceUrl)
  const existing = await payload.find({
    collection: 'products',
    where: { sourceUrl: { equals: product.sourceUrl } },
    limit: 1,
  })
  if (existing.docs.length) {
    console.log(`    ↳ Already imported, skipping`)
    return
  }

  // 1. Ensure categories
  const categoryName = CATEGORY_MAP[product.categoryKey] || 'Uncategorized'
  const categoryId = await ensureCategory(payload, categoryName)
  // Also create a sub-category for the product type
  const typeCategory = await ensureCategory(payload, product.productType)

  // 2. Ensure tags (from applications)
  const tagIds: number[] = []
  for (const app of product.applications) {
    const tagId = await ensureTag(payload, app)
    tagIds.push(tagId)
  }

  // 3. Upload images
  const images: { image: number; alt: string; caption?: string }[] = []
  for (let i = 0; i < product.imageUrls.length; i++) {
    const mediaId = await uploadMedia(
      payload,
      product.imageUrls[i],
      `${product.name} - Image ${i + 1}`,
    )
    if (mediaId) {
      images.push({
        image: mediaId,
        alt: `${product.name}${i === 0 ? '' : ` - view ${i + 1}`}`,
      })
    }
    await sleep(300) // Be polite to their server
  }

  // If no images were downloaded, create a placeholder
  if (images.length === 0) {
    console.log(`    ⚠ No images downloaded, creating placeholder`)
    const placeholderData = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64',
    )
    const created = await payload.create({
      collection: 'media',
      data: { alt: `${product.name} - placeholder` },
      file: {
        data: placeholderData,
        name: 'placeholder.png',
        mimetype: 'image/png',
        size: placeholderData.length,
      },
    })
    images.push({ image: created.id as number, alt: `${product.name} - placeholder` })
  }

  // 4. Create color-based variants
  const colorIds: number[] = []
  for (const colorName of product.colors) {
    colorIds.push(await ensureColor(payload, colorName))
  }
  const variants = colorIds.map((colorId, idx) => ({
    sku: `${slugify(product.name)}-${product.colors[idx].toLowerCase()}`,
    color: colorId,
    stock: 0,
  }))

  // 5. Build specifications — always include label text for readability
  const specifications: { definition?: number; label: string; value: string }[] = []
  for (const spec of product.specifications) {
    try {
      const defId = await ensureSpecDefinition(payload, spec.label)
      specifications.push({ definition: defId, label: spec.label, value: spec.value })
    } catch {
      specifications.push({ label: spec.label, value: spec.value })
    }
  }

  // Add dimensions and material as specs if available
  if (product.dimensions && !specifications.some((s) => s.label?.includes('Dimension'))) {
    specifications.push({ label: 'Dimensions', value: product.dimensions })
  }
  if (product.material && !specifications.some((s) => s.label?.includes('Material'))) {
    specifications.push({ label: 'Material', value: product.material })
  }

  // 6. Download and upload PDFs/documents
  const documents: { title: string; file: number }[] = []
  for (const dl of product.downloadLinks) {
    console.log(`    ↓ Downloading document: ${dl.title}`)
    const fileData = await downloadFile(dl.url)
    if (fileData) {
      try {
        const created = await payload.create({
          collection: 'media',
          data: { alt: `${product.name} - ${dl.title}` },
          file: {
            data: fileData.buffer,
            name: fileData.name,
            mimetype: fileData.mime,
            size: fileData.buffer.length,
          },
        })
        documents.push({ title: dl.title, file: created.id as number })
        console.log(`    ✓ Uploaded document: ${dl.title}`)
      } catch (e) {
        console.warn(`    ⚠ Failed to upload document: ${dl.title}`, (e as Error).message)
      }
    }
    await sleep(300)
  }

  // 7. Create the product
  const productData: Record<string, unknown> = {
    name: product.name,
    // slug is auto-generated by the beforeValidate hook
    description: product.shortDescription || product.subtitle || product.name,
    price: 0, // B2B products — no public pricing, set manually later
    stock: 0,
    active: true,
    featured: false,
    newArrival: false,
    bestSeller: false,
    sourceUrl: product.sourceUrl,
    categories: [categoryId, typeCategory],
    tags: tagIds,
    images,
    documents: documents.length > 0 ? documents : undefined,
    variants: variants.length > 0 ? variants : undefined,
    specifications: specifications.length > 0 ? specifications : undefined,
    seo: {
      metaTitle: product.name,
      metaDescription: product.shortDescription?.slice(0, 160) || product.subtitle,
      keywords: [
        ...product.applications,
        product.productType.toLowerCase(),
        'audio',
        'newtec',
      ].join(', '),
    },
  }

  if (DRY_RUN) {
    console.log(`    [DRY RUN] Would create product:`, JSON.stringify(productData, null, 2))
    return
  }

  try {
    const created = await payload.create({
      collection: 'products',
      data: productData as any,
    })
    console.log(`    ✓ Created product: ${created.name} (id: ${created.id})`)
  } catch (e) {
    console.error(`    ✗ Failed to create product: ${product.name}`, (e as Error).message)
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('═══════════════════════════════════════════')
  console.log(' NewTec Audio → Payload CMS Product Import')
  console.log('═══════════════════════════════════════════')
  if (DRY_RUN) console.log(' ⚡ DRY RUN MODE — no data will be written\n')

  // Initialize Payload
  console.log('\n1. Initializing Payload...')
  const configPath = path.resolve(process.cwd(), 'src/payload.config.ts')
  const configUrl = pathToFileURL(configPath).href
  const { default: config } = await import(configUrl)
  const payload = await getPayload({ config })
  console.log('   ✓ Payload initialized\n')

  // Discover product URLs
  console.log('2. Discovering products from listing pages...')
  const productEntries = await discoverProductUrls()
  console.log(`   ✓ Found ${productEntries.length} products\n`)

  if (productEntries.length === 0) {
    console.log('   No products found. Check the website structure.')
    process.exit(1)
  }

  // Scrape each product
  console.log('3. Scraping product details...')
  const scrapedProducts: ScrapedProduct[] = []
  for (const entry of productEntries) {
    const product = await scrapeProduct(entry.url, entry.categoryKey, entry.productType)
    if (product) {
      scrapedProducts.push(product)
      console.log(
        `   ✓ ${product.name} — ${product.imageUrls.length} images, ${product.specifications.length} specs`,
      )
    }
    await sleep(DELAY_MS)
  }
  console.log(`\n   ✓ Scraped ${scrapedProducts.length} products total\n`)

  // Import into Payload
  console.log('4. Importing into Payload CMS...')
  let imported = 0
  let failed = 0
  for (const product of scrapedProducts) {
    try {
      await importProduct(payload, product)
      imported++
    } catch (e) {
      console.error(`   ✗ ${product.name}: ${(e as Error).message}`)
      failed++
    }
  }

  console.log('\n═══════════════════════════════════════════')
  console.log(` Import complete: ${imported} imported, ${failed} failed`)
  console.log('═══════════════════════════════════════════')
  console.log('\nNext steps:')
  console.log('  • Set prices for each product in the admin panel')
  console.log('  • Review and update product descriptions')
  console.log('  • Add stock quantities')
  console.log('  • Run: pnpm generate:types')

  process.exit(0)
}

main().catch((e) => {
  console.error('Fatal error:', e)
  process.exit(1)
})

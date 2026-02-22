import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import fs from 'fs'
import path from 'path'

// Helper: find-or-create a tag by slug, return its id
async function ensureTag(payload: any, name: string): Promise<number> {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  const existing = await payload.find({
    collection: 'tags',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  if (existing.docs.length) return existing.docs[0].id as number
  const created = await payload.create({ collection: 'tags', data: { name, slug } })
  return created.id as number
}

// Helper: find-or-create a blog tag by slug, return its id
async function ensureBlogTag(payload: any, name: string): Promise<number> {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  const existing = await payload.find({
    collection: 'blog-tags',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  if (existing.docs.length) return existing.docs[0].id as number
  const created = await payload.create({ collection: 'blog-tags', data: { name, slug } })
  return created.id as number
}

// Helper: ensure a placeholder media record exists, return its id
async function ensurePlaceholderMedia(payload: any): Promise<number> {
  const existing = await payload.find({
    collection: 'media',
    where: { alt: { equals: 'Placeholder image' } },
    limit: 1,
  })
  if (existing.docs.length) return existing.docs[0].id as number

  // Find an existing image file in the media directory to use
  const mediaDir = path.resolve(process.cwd(), 'media')
  const files = fs.existsSync(mediaDir) ? fs.readdirSync(mediaDir) : []
  const imageFile = files.find((f: string) => /\.(jpg|jpeg|png|webp)$/i.test(f))

  if (imageFile) {
    const filePath = path.join(mediaDir, imageFile)
    const fileBuffer = fs.readFileSync(filePath)
    const created = await payload.create({
      collection: 'media',
      data: { alt: 'Placeholder image' },
      file: {
        data: fileBuffer,
        name: imageFile,
        mimetype: imageFile.endsWith('.png') ? 'image/png' : 'image/jpeg',
        size: fileBuffer.length,
      },
    })
    return created.id as number
  }

  // If no local file, create a minimal media record (will show as broken image but satisfies FK)
  const created = await payload.create({
    collection: 'media',
    data: { alt: 'Placeholder image' },
    file: {
      data: Buffer.from('placeholder'),
      name: 'placeholder.txt',
      mimetype: 'application/pdf',
      size: 11,
    },
  })
  return created.id as number
}

export async function POST() {
  if (process.env.NODE_ENV === 'production' && !process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const payload = await getPayloadClient()

    // ═══════════════════════════════════════════
    // 1. Seed Categories: Speakers & Cables
    // ═══════════════════════════════════════════
    const existingCats = await payload.find({ collection: 'categories', limit: 100 })
    const existingSlugs = existingCats.docs.map((c: any) => c.slug)

    let speakersId: number | null = null
    let cablesId: number | null = null

    if (!existingSlugs.includes('speakers')) {
      const speakers = await payload.create({
        collection: 'categories',
        data: {
          name: 'Speakers',
          slug: 'speakers',
          description:
            'Premium loudspeakers and monitors engineered for audiophile-grade performance',
          featured: true,
        },
      })
      speakersId = speakers.id as number
    } else {
      speakersId = existingCats.docs.find((c: any) => c.slug === 'speakers')?.id as number
    }

    if (!existingSlugs.includes('cables')) {
      const cables = await payload.create({
        collection: 'categories',
        data: {
          name: 'Cables',
          slug: 'cables',
          description: 'Premium interconnects designed for uncompromising signal purity',
          featured: true,
        },
      })
      cablesId = cables.id as number
    } else {
      cablesId = existingCats.docs.find((c: any) => c.slug === 'cables')?.id as number
    }

    let componentsId: number | null = null
    if (!existingSlugs.includes('components')) {
      const components = await payload.create({
        collection: 'categories',
        data: {
          name: 'Components',
          slug: 'components',
          description: 'Amplifiers, DACs, and audio electronics for the discerning audiophile',
          featured: true,
        },
      })
      componentsId = components.id as number
    } else {
      componentsId = existingCats.docs.find((c: any) => c.slug === 'components')?.id as number
    }

    // Seed Speakers subcategories
    if (!existingSlugs.includes('cabled-speakers')) {
      await payload.create({
        collection: 'categories',
        data: {
          name: 'Cabled Speakers',
          slug: 'cabled-speakers',
          description: 'Passive and powered wired loudspeakers for home and studio',
          parent: speakersId!,
        } as any,
      })
    }

    if (!existingSlugs.includes('wireless-smart-speakers')) {
      await payload.create({
        collection: 'categories',
        data: {
          name: 'Wireless Smart Speakers',
          slug: 'wireless-smart-speakers',
          description: 'Wi-Fi and Bluetooth enabled smart speakers with app control',
          parent: speakersId!,
        } as any,
      })
    }

    // ═══════════════════════════════════════════
    // 2. Ensure placeholder media for seeded content
    // ═══════════════════════════════════════════
    const placeholderMediaId = await ensurePlaceholderMedia(payload)

    // ═══════════════════════════════════════════
    // 3. Seed Tags used by products
    // ═══════════════════════════════════════════
    const tagMonitor = await ensureTag(payload, 'monitor')
    const tagStudio = await ensureTag(payload, 'studio')
    const tagReference = await ensureTag(payload, 'reference')
    const tagFloorstanding = await ensureTag(payload, 'floorstanding')
    const tagHiFi = await ensureTag(payload, 'hi-fi')
    const tagFlagship = await ensureTag(payload, 'flagship')
    const tagXlr = await ensureTag(payload, 'xlr')
    const tagBalanced = await ensureTag(payload, 'balanced')
    const tagSilver = await ensureTag(payload, 'silver')
    const tagSpeakerCable = await ensureTag(payload, 'speaker-cable')
    const tagCarbon = await ensureTag(payload, 'carbon')
    const tagAudiophile = await ensureTag(payload, 'audiophile')

    // ═══════════════════════════════════════════
    // 4. Seed Products (2 per category)
    // ═══════════════════════════════════════════
    const existingProducts = await payload.find({ collection: 'products', limit: 100 })
    const existingProductSlugs = existingProducts.docs.map((p: any) => p.slug)

    const productsToSeed = [
      {
        name: 'ROEX Reference Monitor S1',
        slug: 'roex-reference-monitor-s1',
        description:
          'Studio-grade reference monitor with custom-designed 6.5" woofer and 1" beryllium dome tweeter. Delivers uncolored, accurate sound reproduction for critical listening and professional mixing.',
        price: 1299,
        compareAtPrice: 1499,
        categories: [speakersId!],
        stock: 25,
        sku: 'ROEX-SPK-S1',
        featured: true,
        active: true,
        images: [{ image: placeholderMediaId, alt: 'ROEX Reference Monitor S1' }],
        specifications: [
          { label: 'Driver Size', value: '6.5" Woofer + 1" Tweeter' },
          { label: 'Frequency Response', value: '35Hz - 40kHz' },
          { label: 'Impedance', value: '8 Ohm' },
          { label: 'Sensitivity', value: '89dB' },
          { label: 'Weight', value: '12.5 kg' },
        ],
        tags: [tagMonitor, tagStudio, tagReference],
      },
      {
        name: 'ROEX Floorstanding Tower F3',
        slug: 'roex-floorstanding-tower-f3',
        description:
          'Flagship three-way floorstanding speaker with dual 8" woofers, dedicated midrange driver and air-motion transformer tweeter. Room-filling sound with breathtaking dynamics.',
        price: 3499,
        compareAtPrice: 3999,
        categories: [speakersId!],
        stock: 12,
        sku: 'ROEX-SPK-F3',
        featured: true,
        active: true,
        images: [{ image: placeholderMediaId, alt: 'ROEX Floorstanding Tower F3' }],
        specifications: [
          { label: 'Configuration', value: '3-Way Floorstanding' },
          { label: 'Drivers', value: '2x 8" + 5" Mid + AMT Tweeter' },
          { label: 'Frequency Response', value: '22Hz - 50kHz' },
          { label: 'Power Handling', value: '250W' },
          { label: 'Height', value: '110 cm' },
        ],
        tags: [tagFloorstanding, tagHiFi, tagFlagship],
      },
      {
        name: 'ROEX Silver Reference XLR Cable',
        slug: 'roex-silver-reference-xlr',
        description:
          'Hand-terminated balanced XLR interconnect featuring 6N OCC silver-plated copper conductors with triple-layer shielding. Delivers exceptional clarity and detail resolution.',
        price: 449,
        compareAtPrice: 549,
        categories: [cablesId!],
        stock: 50,
        sku: 'ROEX-CBL-XLR1',
        featured: true,
        active: true,
        images: [{ image: placeholderMediaId, alt: 'ROEX Silver Reference XLR Cable' }],
        specifications: [
          { label: 'Conductor', value: '6N OCC Silver-Plated Copper' },
          { label: 'Shielding', value: 'Triple-Layer (Foil + Braid + Foil)' },
          { label: 'Connector', value: 'Neutrik Gold-Plated XLR' },
          { label: 'Length', value: '1.5m (custom available)' },
          { label: 'Impedance', value: '110 Ohm' },
        ],
        tags: [tagXlr, tagBalanced, tagSilver],
      },
      {
        name: 'ROEX Carbon Speaker Cable',
        slug: 'roex-carbon-speaker-cable',
        description:
          'Audiophile-grade speaker cable with carbon-polymer hybrid conductors and locking banana plug terminals. Engineered for minimal signal loss over long runs.',
        price: 299,
        compareAtPrice: 379,
        categories: [cablesId!],
        stock: 75,
        sku: 'ROEX-CBL-SPK1',
        featured: true,
        active: true,
        images: [{ image: placeholderMediaId, alt: 'ROEX Carbon Speaker Cable' }],
        specifications: [
          { label: 'Conductor', value: 'Carbon-Polymer Hybrid' },
          { label: 'Gauge', value: '12 AWG' },
          { label: 'Connector', value: 'Gold-Plated Locking Banana Plugs' },
          { label: 'Length', value: '3m pair' },
          { label: 'Capacitance', value: '12 pF/ft' },
        ],
        tags: [tagSpeakerCable, tagCarbon, tagAudiophile],
      },
    ]

    const seededProducts = []
    for (const product of productsToSeed) {
      if (!existingProductSlugs.includes(product.slug)) {
        try {
          const created = await payload.create({
            collection: 'products',
            data: {
              ...product,
            } as any,
          })
          seededProducts.push(created.slug)
        } catch (e: any) {
          console.warn(`Skipped product ${product.slug}:`, e.message)
        }
      }
    }

    // ═══════════════════════════════════════════
    // 5. Seed Blog Posts
    // ═══════════════════════════════════════════
    const existingPosts = await payload.find({ collection: 'blog-posts', limit: 100 })
    const existingPostSlugs = existingPosts.docs.map((p: any) => p.slug)

    // Get the first user as the author
    const users = await payload.find({ collection: 'users', limit: 1 })
    const authorId = users.docs[0]?.id as number

    // Ensure blog tags
    const blogTagSpeakers = await ensureBlogTag(payload, 'Speakers')
    const blogTagEngineering = await ensureBlogTag(payload, 'Engineering')
    const blogTagAcoustic = await ensureBlogTag(payload, 'Acoustic')
    const blogTagLifestyle = await ensureBlogTag(payload, 'Lifestyle')
    const blogTagMusic = await ensureBlogTag(payload, 'Music')
    const blogTagBehindTheScenes = await ensureBlogTag(payload, 'Behind the Scenes')
    const blogTagTesting = await ensureBlogTag(payload, 'Testing')
    const blogTagCables = await ensureBlogTag(payload, 'Cables')
    const blogTagProductLaunch = await ensureBlogTag(payload, 'Product Launch')
    const blogTagPartnerships = await ensureBlogTag(payload, 'Partnerships')
    const blogTagEvents = await ensureBlogTag(payload, 'Events')

    const blogPostsToSeed = [
      {
        title: 'The Science Behind Our New Reference Speakers',
        slug: 'science-behind-reference-speakers',
        excerpt:
          'A deep dive into the acoustic engineering and material science that makes our Reference Series speakers deliver unmatched clarity and depth.',
        featuredImage: placeholderMediaId,
        author: authorId,
        publishedDate: '2026-02-10',
        featured: true,
        status: 'published' as const,
        tags: [blogTagSpeakers, blogTagEngineering, blogTagAcoustic],
      },
      {
        title: 'Sound of Life: How Music Shapes Our Daily Rituals',
        slug: 'sound-of-life-daily-rituals',
        excerpt:
          'Exploring the profound connection between our listening habits and our daily rituals, from morning routines to evening wind-downs.',
        featuredImage: placeholderMediaId,
        author: authorId,
        publishedDate: '2026-02-05',
        featured: true,
        status: 'published' as const,
        tags: [blogTagLifestyle, blogTagMusic],
      },
      {
        title: 'Inside the ROEX Sound Lab',
        slug: 'inside-roex-sound-lab',
        excerpt:
          'Take a virtual tour of our state-of-the-art listening room and learn how we test every product before it reaches your home.',
        featuredImage: placeholderMediaId,
        author: authorId,
        publishedDate: '2026-01-28',
        featured: false,
        status: 'published' as const,
        tags: [blogTagBehindTheScenes, blogTagTesting],
      },
      {
        title: 'Introducing the Carbon Speaker Cable Series',
        slug: 'carbon-speaker-cable-series',
        excerpt:
          "Our latest cable series uses advanced carbon-fiber shielding for the purest signal transmission we've ever achieved.",
        featuredImage: placeholderMediaId,
        author: authorId,
        publishedDate: '2026-01-20',
        featured: false,
        status: 'published' as const,
        tags: [blogTagCables, blogTagProductLaunch],
      },
      {
        title: 'KEF x ROEX: A Partnership Built on Sound',
        slug: 'kef-roex-partnership',
        excerpt:
          "How our collaboration with KEF is pushing the boundaries of what's possible in high-fidelity audio reproduction.",
        featuredImage: placeholderMediaId,
        author: authorId,
        publishedDate: '2026-01-15',
        featured: false,
        status: 'published' as const,
        tags: [blogTagPartnerships],
      },
      {
        title: 'Journey Through Sound: Our 2026 Listening Events',
        slug: 'journey-through-sound-2026',
        excerpt:
          'Join us for an immersive series of listening events around the world, featuring live demonstrations of our latest products.',
        featuredImage: placeholderMediaId,
        author: authorId,
        publishedDate: '2026-01-10',
        featured: false,
        status: 'published' as const,
        tags: [blogTagEvents],
      },
    ]

    const seededPosts = []
    for (const post of blogPostsToSeed) {
      if (!existingPostSlugs.includes(post.slug)) {
        try {
          const created = await payload.create({
            collection: 'blog-posts',
            data: {
              ...post,
              content: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'paragraph',
                      children: [
                        {
                          type: 'text',
                          text:
                            post.excerpt +
                            ' This is placeholder content — edit this post in the Payload CMS admin panel to add your full article.',
                        },
                      ],
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  version: 1,
                },
              },
            } as any,
          })
          seededPosts.push(created.slug)
        } catch (e: any) {
          console.warn(`Skipped blog post ${post.slug}:`, e.message)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Seed completed',
      categories: { speakersId, cablesId, componentsId },
      seededProducts,
      seededPosts,
    })
  } catch (error: any) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

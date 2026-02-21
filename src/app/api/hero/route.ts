import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function GET() {
  try {
    const payload = await getPayloadClient()

    const heroSections = await payload.find({
      collection: 'hero-sections',
      where: {
        active: {
          equals: true,
        },
      },
      depth: 1,
      limit: 1,
    })

    if (!heroSections.docs || heroSections.docs.length === 0) {
      return NextResponse.json({ hero: null })
    }

    const hero = heroSections.docs[0] as any

    // Resolve video source: uploaded file takes priority, then external URL
    let videoSrc: string | null = null
    if (hero.mediaType === 'video') {
      if (hero.backgroundVideo?.url) {
        videoSrc = hero.backgroundVideo.url
      } else if (hero.backgroundVideo?.filename) {
        videoSrc = `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/media/${hero.backgroundVideo.filename}`
      } else if (hero.backgroundVideoUrl) {
        videoSrc = hero.backgroundVideoUrl
      }
    }

    return NextResponse.json({
      hero: {
        title: hero.title,
        subtitle: hero.subtitle,
        mediaType: hero.mediaType,
        backgroundImage:
          hero.backgroundImage?.url || hero.backgroundImage?.filename
            ? hero.backgroundImage?.url ||
              `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/media/${hero.backgroundImage.filename}`
            : null,
        backgroundVideo: videoSrc,
        overlayOpacity: hero.overlayOpacity || 40,
        textAlignment: hero.textAlignment || 'center',
        ctaButtons: hero.ctaButtons || [],
        height: hero.height || 'full',
      },
    })
  } catch (error) {
    console.error('Error fetching hero section:', error)
    return NextResponse.json({ error: 'Failed to fetch hero section' }, { status: 500 })
  }
}

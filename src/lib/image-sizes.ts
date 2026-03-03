/**
 * Centralised Next.js <Image> sizes & dimension values used across the site.
 *
 * Usage:
 *   import { IMAGE_SIZES, IMAGE_DIMENSIONS, LOGO_SIZES } from '@/lib/image-sizes'
 *   <Image sizes={IMAGE_SIZES.menuCategory} ... />
 *
 * IMAGE_DIMENSIONS contains the recommended pixel size to use when CREATING
 * new image files (export from Figma / Photoshop / AI etc.).
 * All dimensions are at 1× – multiply by 2 for @2x / Retina exports.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Logo
// ─────────────────────────────────────────────────────────────────────────────

/** Fixed width / height passed directly to <Image width={} height={} /> */
export const LOGO_SIZES = {
  /** Desktop header – rendered at h-[28px] via CSS */
  headerDesktop: { width: 96, height: 34 },
  /** Mobile header – rendered at h-7 via CSS */
  headerMobile: { width: 90, height: 32 },
  /** Footer – rendered at h-7 via CSS */
  footer: { width: 88, height: 32 },
} as const

// ─────────────────────────────────────────────────────────────────────────────
// `sizes` strings (passed to the Next.js Image `sizes` prop)
// ─────────────────────────────────────────────────────────────────────────────

export const IMAGE_SIZES = {
  /** Mega-menu category portrait cards  (aspect 3:4) */
  menuCategory: '(max-width: 1400px) 20vw, 280px',

  /** Mega-menu "Featured" product thumbnails – w-14 h-14 box */
  menuFeaturedThumb: '56px',

  /** Search overlay result thumbnails – w-14 h-14 box */
  searchResultThumb: '56px',

  /** ProductCard landscape grid card (aspect 3:2) */
  productCard: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',

  /** ElegantCarousel slide (aspect 16:10 on mobile, fills height on desktop) */
  elegantCarousel: '(max-width: 1024px) 100vw, 50vw',

  /** Full-bleed hero / section backgrounds */
  fullBleed: '100vw',

  /** Split-layout right-side panel (~55 vw on large screens) */
  splitRight: '(max-width: 1024px) 100vw, 55vw',

  /** Home-page carousel cards – landscape 3:2 variant */
  homeCarouselCardLandscape:
    '(max-width: 640px) 85vw, (max-width: 768px) 50vw, (max-width: 1024px) 36vw, 22vw',

  /** Home-page carousel cards – portrait 3:4 variant */
  homeCarouselCardPortrait:
    '(max-width: 640px) 85vw, (max-width: 768px) 50vw, (max-width: 1024px) 36vw, 22vw',

  /** Blog post card (aspect 16:10) */
  blogCard: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',

  /** Product detail hero banner (40–48 vh full-width) */
  productDetailHero: '100vw',

  /** Product detail main gallery image (aspect 1:1 / square) */
  productDetailGallery: '(max-width: 1024px) 100vw, 50vw',

  /** Solutions page 4:3 section images */
  solutionsSection: '100vw',

  /** Solutions page 21:8 wide banner */
  solutionsBanner: '100vw',
} as const

export type ImageSizeKey = keyof typeof IMAGE_SIZES

// ─────────────────────────────────────────────────────────────────────────────
// Recommended source-image dimensions for CREATING new images
// ─────────────────────────────────────────────────────────────────────────────
// Each entry has:
//   w  – width  in px (1×)
//   h  – height in px (1×)
//   ratio – named aspect ratio
//   note  – where / how the image is used
//
// Export at 2× (double w & h) for crisp Retina / HiDPI displays.
// ─────────────────────────────────────────────────────────────────────────────

export const IMAGE_DIMENSIONS = {
  /** Mega-menu category card – portrait */
  menuCategory: { w: 280, h: 373, ratio: '3:4', note: 'Mega-menu category card (portrait)' },

  /** Featured / search thumbnail – small square */
  thumb56: { w: 112, h: 112, ratio: '1:1', note: 'Featured & search thumbnails (56 px box @2×)' },

  /** ProductCard – landscape */
  productCard: {
    w: 768,
    h: 512,
    ratio: '3:2',
    note: 'ProductCard & home carousel card (landscape)',
  },

  /** ElegantCarousel slide */
  elegantCarousel: { w: 1280, h: 800, ratio: '16:10', note: 'ElegantCarousel slide image' },

  /** Full-bleed hero / background */
  heroFullBleed: { w: 1920, h: 1080, ratio: '16:9', note: 'Full-bleed hero & section backgrounds' },

  /** Split-layout right panel */
  splitRight: { w: 1200, h: 900, ratio: '4:3', note: 'Split-layout editorial / about panel' },

  /** Home carousel card – portrait */
  homeCarouselCardPortrait: { w: 480, h: 640, ratio: '3:4', note: 'Home carousel portrait card' },

  /** Blog post card */
  blogCard: { w: 800, h: 500, ratio: '16:10', note: 'Blog card thumbnail' },

  /** Product detail hero banner */
  productDetailHero: {
    w: 1920,
    h: 800,
    ratio: '~12:5',
    note: 'Product detail top hero banner (40–48 vh)',
  },

  /** Product detail gallery (main viewer) */
  productDetailGallery: {
    w: 1024,
    h: 1024,
    ratio: '1:1',
    note: 'Product detail gallery image (square)',
  },

  /** Solutions 4:3 section */
  solutionsSection: { w: 1920, h: 1440, ratio: '4:3', note: 'Solutions page section image' },

  /** Solutions 21:8 wide banner */
  solutionsBanner: { w: 1920, h: 731, ratio: '21:8', note: 'Solutions page wide cinematic banner' },

  /** Shop / cables hero – cable-hero.avif (used in ShopPageClient) */
  shopCableHero: { w: 1920, h: 800, ratio: '~12:5', note: 'Shop page hero – cable-hero.avif' },

  /** Components category hero – components-hero.avif */
  componentsHero: {
    w: 1920,
    h: 1080,
    ratio: '16:9',
    note: 'Components section hero – components-hero.avif',
  },

  /** Logo SVG reference size */
  logo: {
    w: 192,
    h: 68,
    ratio: 'N/A',
    note: 'Logo (SVG; these are the @2× reference px for raster fallback)',
  },
} as const

export type ImageDimensionKey = keyof typeof IMAGE_DIMENSIONS

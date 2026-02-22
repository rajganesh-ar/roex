'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Play, Star, Quote, Volume2, Pause } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from '@/components/ui/carousel'
import { AnimatedSection } from '@/components/AnimatedSection'
import ElegantCarousel from '@/components/elegant-carousel'
import dynamic from 'next/dynamic'

const ShaderBackground = dynamic(() => import('@/components/ui/shader-background'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" />,
})

interface Product {
  id: string
  name: string
  slug: string
  availability: 'available' | 'unavailable'
  image: string
  category: string
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
}

export interface HeroSlide {
  image: string
  video?: string | null
  mediaType?: 'image' | 'video'
  title: string
  subtitle: string
  cta: { label: string; href: string }
}

/* ─── Hero Slides — populated from CMS (hero-sections collection) ─── */

/* ─── Testimonials ─── */
const defaultTestimonials = [
  {
    quote:
      'The music lured me in. Even though I was actually on my way home. The sound quality made the entire shopping experience feel premium.',
    author: 'Laura Becker',
    role: 'Boutique Owner, Munich',
    rating: 5,
  },
  {
    quote:
      "We installed ROEX speakers across our hotel lobby, spa and restaurant. Guests constantly comment on the atmosphere — it's become our signature.",
    author: 'Marco Benedetti',
    role: 'General Manager, Grand Hotel Tyrol',
    rating: 5,
  },
  {
    quote:
      'After switching to ROEX 360° Sound, we noticed customers staying longer and spending more. The system paid for itself within months.',
    author: 'Sophie Kramer',
    role: 'Retail Operations Director',
    rating: 5,
  },
  {
    quote:
      "The compatible third-party control app makes managing sound across all our zones effortless. One app, complete control — it's been a game-changer for our restaurant group.",
    author: 'David Park',
    role: 'Restaurant Group CEO',
    rating: 5,
  },
]

/* ─── Stats ─── */
const defaultStats = [
  { value: '50K+', label: 'Installations Worldwide' },
  { value: '40%', label: 'Fewer Speakers Needed' },
  { value: '2015', label: 'Founded in Scotland, UK' },
  { value: '80+', label: 'Countries Served' },
]

/* ─── Inspiration Items ─── */
const defaultInspirationItems = [
  {
    image: '/images/elegent-retail.avif',
    title: 'Retail Spaces',
    subtitle:
      'Sound sells. Background music increases dwell time by 18% and spending by 37%. Create the perfect shopping atmosphere.',
    cta: 'EXPLORE RETAIL',
  },
  {
    image: '/images/elegent-hotel.avif',
    title: 'Hotels & Hospitality',
    subtitle:
      'From lobby to spa, bar to restaurant — elegant sound that makes guests feel at home and stay longer.',
    cta: 'EXPLORE HOSPITALITY',
  },
  {
    image: '/images/elegent-resturant.avif',
    title: 'Restaurants & Gastro',
    subtitle:
      "Guests who feel comfortable don't whisper. Balanced, even sound that complements culinary enjoyment.",
    cta: 'EXPLORE GASTRO',
  },
  {
    image: '/images/elegent-office.avif',
    title: 'Offices & Workspaces',
    subtitle:
      'A high-quality audio concept increases productivity by 48%. Music that works as hard as your team.',
    cta: 'EXPLORE OFFICE',
  },
  {
    image: '/images/elegent-shopping.avif',
    title: 'Shopping Centres',
    subtitle:
      'Size does not matter. From small boutiques to large malls, 360° Sound reaches every corner evenly.',
    cta: 'EXPLORE MALLS',
  },
  {
    image: '/images/elegent-spa.avif',
    title: 'Wellness & Spa',
    subtitle:
      'Create serene soundscapes that enhance relaxation. Unobtrusive speakers, immersive acoustic experiences.',
    cta: 'EXPLORE WELLNESS',
  },
]

/* ─── Category Cards ─── */
/* ─── Image map: keyed by slug keywords → resolves any CMS category to a unique image ─── */
const categoryImageMap: Record<string, string> = {
  speakers: '/images/menu-speakers.avif',
  'cabled-speakers': '/images/category-card-cabledspeakers.avif',
  'wireless-smart-speakers': '/images/category-card-wirelesspeakers.avif',
  components: '/images/category-card-components.avif',
  cables: '/images/category-card-cable.avif',
  'ceiling-speakers': '/images/category-card-speaker.avif',
  'track-speakers': '/images/category-card-cable.avif',
  'pendant-speakers': '/images/category-card-components.avif',
  'smart-audio': '/images/SMARTAudio-App-retuschiert.avif',
}

function getCategoryImage(name: string, slug?: string | null): string {
  // 1. Try exact slug match
  if (slug && categoryImageMap[slug]) return categoryImageMap[slug]
  // 2. Try slug keyword match (longest key first to avoid 'speakers' matching before 'cabled-speakers')
  if (slug) {
    const sortedKeys = Object.keys(categoryImageMap).sort((a, b) => b.length - a.length)
    const match = sortedKeys.find((k) => slug.includes(k))
    if (match) return categoryImageMap[match]
  }
  // 3. Try name-based keyword match (longest key first)
  const nameLower = name.toLowerCase()
  const sortedKeys = Object.keys(categoryImageMap).sort((a, b) => b.length - a.length)
  const nameMatch = sortedKeys.find((k) => nameLower.includes(k.replace(/-/g, ' ')))
  if (nameMatch) return categoryImageMap[nameMatch]
  // 4. Final fallback
  return '/images/category-card-speaker.avif'
}

/* ─── Animated Counter Hook ─── */
function useCounter(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [end, duration, start])
  return count
}

export interface BlogPostData {
  image: string
  category: string
  title: string
  excerpt: string
  date: string
  readTime: string
  slug: string
}

export interface HomePageProps {
  initialProducts?: Product[]
  initialCategories?: Category[]
  initialBlogPosts?: BlogPostData[]
  initialHeroSlides?: HeroSlide[]
}

export default function HomePage({
  initialProducts,
  initialCategories,
  initialBlogPosts,
  initialHeroSlides,
}: HomePageProps) {
  const hasInitialData = !!(initialProducts || initialCategories || initialBlogPosts)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slideProgress, setSlideProgress] = useState(0)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(initialProducts || [])
  const [categories, setCategories] = useState<Category[]>(initialCategories || [])
  const [blogPosts, setBlogPosts] = useState<BlogPostData[]>(initialBlogPosts || [])
  const [loading, setLoading] = useState(!hasInitialData)
  const [testimonialApi, setTestimonialApi] = useState<CarouselApi>()
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [statsVisible, setStatsVisible] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const SLIDE_DURATION = 6000

  const heroSlides = initialHeroSlides && initialHeroSlides.length > 0 ? initialHeroSlides : []
  const testimonials = defaultTestimonials
  const stats = defaultStats
  const inspirationItems = defaultInspirationItems

  // Parallax scroll
  const { scrollY } = useScroll()
  const heroParallax = useTransform(scrollY, [0, 800], [0, 80])
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0.3])
  const fullWidthParallax = useTransform(scrollY, [2500, 4500], [0, 150])

  // Stats counter
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true)
      },
      { threshold: 0.3 },
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  // Fetch products & categories (skip if server-provided initial data)
  useEffect(() => {
    if (hasInitialData) return
    Promise.all([
      fetch('/api/shop-products?sortBy=featured&limit=12')
        .then((r) => r.json())
        .catch(() => ({ products: [] })),
      fetch('/api/shop-categories')
        .then((r) => r.json())
        .catch(() => ({ categories: [] })),
      fetch('/api/blog?limit=3')
        .then((r) => r.json())
        .catch(() => ({ posts: [] })),
    ])
      .then(([productData, catData, blogData]) => {
        setFeaturedProducts(productData.products?.slice(0, 12) || [])
        setCategories(catData.categories || [])
        if (blogData.posts && blogData.posts.length > 0) {
          setBlogPosts(
            blogData.posts.map((p: any) => ({
              image: p.featuredImage || '/images/hero-background-2.avif',
              category:
                p.category?.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) ||
                'General',
              title: p.title,
              excerpt: p.excerpt,
              date: p.publishedDate
                ? new Date(p.publishedDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : '',
              readTime: p.readTime ? `${p.readTime} min read` : '',
              slug: p.slug,
            })),
          )
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Hero auto-advance with progress
  useEffect(() => {
    if (heroSlides.length === 0) return
    setSlideProgress(0)
    progressRef.current = setInterval(() => {
      setSlideProgress((prev) => Math.min(prev + 100 / (SLIDE_DURATION / 50), 100))
    }, 50)
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, SLIDE_DURATION)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [currentSlide, heroSlides.length])

  // Testimonial carousel tracking
  useEffect(() => {
    if (!testimonialApi) return
    const onSelect = () => setCurrentTestimonial(testimonialApi.selectedScrollSnap())
    testimonialApi.on('select', onSelect)
    return () => {
      testimonialApi.off('select', onSelect)
    }
  }, [testimonialApi])

  const goToSlide = (index: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (progressRef.current) clearInterval(progressRef.current)
    setCurrentSlide(index)
  }

  const slide = heroSlides[currentSlide]

  const categoryCards =
    categories.length > 0
      ? categories.map((cat) => ({
          name: cat.name,
          description: cat.description || `Explore our ${cat.name.toLowerCase()} collection`,
          image: cat.image || getCategoryImage(cat.name, cat.slug || cat.id),
          href: `/shop?category=${cat.slug || cat.id}`,
        }))
      : []

  return (
    <div className="bg-white overflow-hidden">
      {/* ═══════════════ HERO CAROUSEL ═══════════════ */}
      {heroSlides.length > 0 && (
        <section className="relative h-screen overflow-hidden">
          {/* All slides are always in the DOM so their images preload immediately */}
          {heroSlides.map((s, i) => (
            <motion.div
              key={i}
              animate={{
                opacity: i === currentSlide ? 1 : 0,
                scale: i === currentSlide ? 1.05 : 1.15,
              }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
              style={{ zIndex: i === currentSlide ? 1 : 0 }}
            >
              <motion.div
                style={{ y: heroParallax }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {s.mediaType === 'video' && s.video ? (
                  <video
                    src={s.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover object-center bg-black"
                  />
                ) : (
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-cover object-center"
                    priority
                    fetchPriority={i === 0 ? 'high' : 'auto'}
                    sizes="100vw"
                  />
                )}
              </motion.div>
            </motion.div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/80" />

          <motion.div
            style={{ opacity: heroOpacity }}
            className="relative z-10 h-full flex flex-col justify-end pb-14 sm:pb-18 md:pb-24 lg:pb-28"
          >
            <div className="max-w-[1800px] mx-auto w-full px-6 lg:px-12">
              <div className="max-w-4xl">
                {/* Eyebrow line */}
                <motion.div
                  key={`eyebrow-${currentSlide}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-3 mb-4"
                >
                  <span className="w-8 h-px bg-white/50" />
                  <span className="text-[10px] uppercase tracking-[0.35em] text-white/70 font-light">
                    {String(currentSlide + 1).padStart(2, '0')} &mdash; Premium Audio
                  </span>
                </motion.div>

                <motion.h1
                  key={currentSlide}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="font-montserrat text-[2.2rem] sm:text-[2.8rem] md:text-5xl lg:text-6xl font-light text-white leading-[1.05] tracking-[-0.02em] whitespace-pre-line mb-4"
                >
                  {slide.title}
                </motion.h1>

                <motion.div
                  key={`divider-${currentSlide}`}
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="w-16 h-px bg-white/40 mb-4"
                />

                <motion.p
                  key={`sub-${currentSlide}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="text-[13px] sm:text-[15px] text-white/85 font-light max-w-lg leading-[1.9] tracking-wide mb-7"
                >
                  {slide.subtitle}
                </motion.p>

                <motion.div
                  key={`cta-${currentSlide}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-6"
                >
                  <Link
                    href={slide.cta.href}
                    className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-white border-b border-white/50 pb-1 hover:border-white transition-colors duration-300 group"
                  >
                    {slide.cta.label}
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Slide indicators with progress */}
            <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className="relative h-[2px] overflow-hidden"
                  style={{ width: i === currentSlide ? '48px' : '24px' }}
                  aria-label={`Slide ${i + 1}`}
                >
                  <div className="absolute inset-0 bg-white/30" />
                  {i === currentSlide && (
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-brand-gradient-horizontal"
                      initial={{ width: '0%' }}
                      animate={{ width: `${slideProgress}%` }}
                      transition={{ duration: 0.05, ease: 'linear' }}
                    />
                  )}
                  {i < currentSlide && <div className="absolute inset-0 bg-white" />}
                </button>
              ))}
            </div>

            {/* Slide counter — hidden since it's now in the eyebrow */}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-6 left-6 lg:left-10 hidden md:flex flex-col items-center gap-2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="w-[1px] h-8 bg-gradient-to-b from-transparent to-white/60"
            />
            <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 rotate-90 origin-center translate-y-6">
              Scroll
            </span>
          </motion.div>
        </section>
      )}

      {/* ═══════════════ THE ROEX ADVANTAGE ═══════════════ */}
      <section className="relative overflow-hidden bg-black">
        <div className="w-full flex flex-col lg:flex-row">
          {/* Left: PNG image — flush top/bottom/left */}
          <div className="relative w-full lg:w-[55%] h-[320px] lg:h-auto lg:self-stretch bg-black overflow-hidden">
            <Image
              src="/images/roex_advantage.avif"
              alt="ROEX Advantage"
              fill
              className="object-cover object-left"
              sizes="(max-width: 1024px) 100vw, 55vw"
              priority
            />
          </div>

          {/* Right: Content — compact, fills remaining space */}
          <div className="w-full lg:w-[45%] bg-black px-8 sm:px-10 lg:px-14 xl:px-16 py-10 lg:py-14 flex flex-col justify-center">
            <AnimatedSection variant="fade-right">
              <div className="flex items-center gap-3 mb-6">
                <span className="brand-bar" />
                <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 font-semibold font-grotesk">
                  The Roex Advantage
                </p>
              </div>

              <h2 className="font-montserrat text-2xl sm:text-3xl lg:text-[34px] font-normal text-white leading-[1.2] tracking-tight mb-1.5">
                We make your business
              </h2>
              <h2 className="font-montserrat text-2xl sm:text-3xl lg:text-[34px] font-normal text-white/55 leading-[1.2] tracking-tight mb-8">
                sound exceptional
              </h2>
            </AnimatedSection>

            <AnimatedSection variant="fade-right" delay={0.15}>
              <div className="space-y-3 mb-8 max-w-[440px]">
                <p className="text-[13px] text-white/40 font-light leading-[1.8]">
                  ROEX designs and manufactures professional audio systems for high-quality
                  background music, especially in commercial environments. Our proprietary 360°
                  Sound technology enables even sound distribution throughout the room — from retail
                  stores and restaurants to hotels and offices.
                </p>
                <p className="text-[13px] text-white/40 font-light leading-[1.8]">
                  With refined architectural design, precision engineering, and compatibility with a
                  third-party smart audio control platform, we deliver solutions that require up to
                  40% fewer speakers while achieving significantly better sound.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection variant="fade-right" delay={0.3}>
              <div className="grid grid-cols-3 gap-5 mb-8 py-6 border-y border-white/[0.08] max-w-[440px]">
                <div>
                  <div className="font-montserrat text-2xl sm:text-3xl font-light text-white leading-none mb-1">
                    40<span className="text-white/25 text-sm ml-0.5">%</span>
                  </div>
                  <p className="text-[8px] uppercase tracking-[0.2em] text-white/25 font-medium">
                    Fewer speakers
                  </p>
                </div>
                <div>
                  <div className="font-montserrat text-2xl sm:text-3xl font-light text-white leading-none mb-1">
                    18<span className="text-white/25 text-sm ml-0.5">%</span>
                  </div>
                  <p className="text-[8px] uppercase tracking-[0.2em] text-white/25 font-medium">
                    Longer dwell time
                  </p>
                </div>
                <div>
                  <div className="font-montserrat text-2xl sm:text-3xl font-light text-white leading-none mb-1">
                    37<span className="text-white/25 text-sm ml-0.5">%</span>
                  </div>
                  <p className="text-[8px] uppercase tracking-[0.2em] text-white/25 font-medium">
                    More spending
                  </p>
                </div>
              </div>

              <Link
                href="/about"
                className="group inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-white/70 font-medium border border-white/15 px-7 py-3 hover:bg-white hover:text-black hover:border-white transition-all duration-500"
              >
                About Our Technology
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ═══════════════ 360° SOUND TECHNOLOGY ═══════════════ */}
      <section className="py-12 sm:py-16 bg-[#fafaf8]">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <AnimatedSection variant="fade-left">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Volume2 className="h-3.5 w-3.5 text-gray-900" />
                  <span className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-semibold font-grotesk">
                    ROEX 360° Sound
                  </span>
                </div>
                <h2 className="font-montserrat text-2xl sm:text-3xl lg:text-[38px] font-light text-gray-900 leading-[1.15] tracking-tight">
                  Room-filling sound from every position
                </h2>
                <div className="space-y-4 text-[14px] text-gray-500 font-light leading-[1.8]">
                  <p>
                    Our proprietary 360° Sound technology distributes sound evenly like a fine spray
                    throughout any space. Unlike conventional speakers, this patented innovation
                    creates an optimal acoustic experience from every listening position in the
                    room.
                  </p>
                  <div className="grid sm:grid-cols-3 gap-5 pt-4">
                    <div className="border-l-2 border-black pl-4">
                      <div className="text-3xl font-montserrat font-light text-gray-900 mb-1">
                        40%
                      </div>
                      <p className="text-[12px] text-gray-400">Fewer speakers needed</p>
                    </div>
                    <div className="border-l-2 border-black pl-4">
                      <div className="text-3xl font-montserrat font-light text-gray-900 mb-1">
                        18%
                      </div>
                      <p className="text-[12px] text-gray-400">Longer customer dwell time</p>
                    </div>
                    <div className="border-l-2 border-black pl-4">
                      <div className="text-3xl font-montserrat font-light text-gray-900 mb-1">
                        37%
                      </div>
                      <p className="text-[12px] text-gray-400">More customer spending</p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-gray-900 border-b border-gray-900 pb-1.5 hover:text-gray-400 hover:border-gray-400 transition-all duration-400 group"
                >
                  Learn More About 360° Sound
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection variant="fade-right" delay={0.2}>
              <div className="relative aspect-video bg-black overflow-hidden shadow-xl">
                <iframe
                  src="https://www.youtube.com/embed/QVbGFiVUTxM?autoplay=1&mute=1&controls=0&loop=1&playlist=QVbGFiVUTxM&rel=0&modestbranding=1&playsinline=1"
                  title="ROEX 360° Audio — Limitless & Intuitive"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ═══════════════ SHADER BACKGROUND + CTA ═══════════════ */}
      <section className="relative py-20 sm:py-24 flex items-center overflow-hidden">
        <ShaderBackground />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 max-w-[1800px] mx-auto w-full px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            {/* Left: large heading — spans 7 cols */}
            <AnimatedSection variant="fade-right" className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-6">
                <span className="brand-bar" />
                <span className="text-[10px] uppercase tracking-[0.5em] text-white/60 font-semibold font-grotesk">
                  ROEX Audio Systems
                </span>
              </div>
              <h2 className="font-montserrat text-4xl sm:text-5xl lg:text-[56px] font-light text-white leading-[1.08] tracking-tight">
                Optimal Sound
                <br />
                <span className="text-white/40 italic">Everywhere</span>
              </h2>
            </AnimatedSection>

            {/* Right corner: description + CTAs — spans 4 cols, pushed to end */}
            <AnimatedSection
              variant="fade-left"
              delay={0.15}
              className="lg:col-span-4 lg:col-start-9 flex flex-col items-start lg:items-end text-left lg:text-right"
            >
              <p className="text-[13px] text-white/70 font-light leading-[1.9] mb-8 max-w-[380px]">
                Among all stimuli, sound is the one that people perceive first. ROEX 360° Sound
                technology creates room-filling sound carpets for retail, hospitality, offices, and
                wellness spaces — reaching every corner with consistent quality.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-3 px-9 py-3 bg-white text-black text-[10px] uppercase tracking-[0.25em] font-medium hover:bg-white/90 transition-all duration-300 group"
                >
                  Explore Products
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-3 px-9 py-3 border border-white/30 text-white text-[10px] uppercase tracking-[0.25em] font-medium hover:border-white/60 hover:bg-white/5 transition-all duration-300"
                >
                  Our Story
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ═══════════════ PRODUCT CAROUSEL ═══════════════ */}
      <section className="py-14 sm:py-18 bg-white overflow-hidden">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          {/* Header row */}
          <div className="flex items-end justify-between mb-10">
            <AnimatedSection variant="fade-right">
              <div className="flex items-center gap-3 mb-3">
                <span className="brand-bar" />
                <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400 font-semibold font-grotesk">
                  Our Collection
                </p>
              </div>
              <h2 className="font-montserrat text-2xl sm:text-3xl lg:text-[36px] font-light text-gray-900 tracking-tight">
                {loading ? 'Loading…' : `${featuredProducts.length} Products`}
              </h2>
            </AnimatedSection>
            <AnimatedSection variant="fade-left">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-gray-500 font-medium border-b border-gray-300 pb-1 hover:text-gray-900 hover:border-gray-900 transition-all duration-300"
              >
                View All
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </AnimatedSection>
          </div>

          {/* Carousel */}
          {!loading && featuredProducts.length > 0 && (
            <Carousel opts={{ align: 'start', loop: false, dragFree: true }} className="w-full">
              <CarouselContent className="-ml-4">
                {featuredProducts.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className="pl-4 basis-[85%] sm:basis-[50%] md:basis-[36%] lg:basis-[28%] xl:basis-[22%]"
                  >
                    <Link href={`/products/${product.slug}`} className="group block">
                      {/* 3:2 card matching 768×512 image ratio */}
                      <div className="relative aspect-[3/2] bg-[#f2f2f0] overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          sizes="(max-width: 640px) 85vw, (max-width: 768px) 50vw, (max-width: 1024px) 36vw, 22vw"
                        />
                        {/* Availability badge */}
                        <div className="absolute top-3 left-3 z-10">
                          <span
                            className={`text-[9px] uppercase tracking-[0.15em] px-2.5 py-1 font-medium backdrop-blur-sm ${
                              product.availability === 'available'
                                ? 'bg-white/85 text-gray-800'
                                : 'bg-black/70 text-amber-300'
                            }`}
                          >
                            {product.availability === 'available' ? 'In Stock' : 'Coming Soon'}
                          </span>
                        </div>
                        {/* Bottom overlay with name + arrow */}
                        <div className="absolute bottom-0 inset-x-0 z-10">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent group-hover:from-black/85 transition-all duration-500" />
                          <div className="relative px-4 pb-4 pt-10">
                            <p className="text-[9px] uppercase tracking-[0.25em] text-white/50 mb-1 font-medium">
                              {product.category}
                            </p>
                            <div className="flex items-end justify-between gap-2">
                              <h3 className="font-montserrat text-[13px] font-normal text-white leading-snug flex-1">
                                {product.name}
                              </h3>
                              <div className="flex-shrink-0 w-8 h-8 bg-white/10 border border-white/20 flex items-center justify-center transition-all duration-400 group-hover:bg-white group-hover:border-white">
                                <ArrowRight className="h-3.5 w-3.5 text-white transition-all duration-400 group-hover:text-black group-hover:translate-x-0.5" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Nav arrows */}
              <div className="flex items-center mt-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mr-auto">
                  Drag to explore
                </span>
                <div className="flex items-center gap-2">
                  <CarouselPrevious className="static translate-y-0 h-9 w-9 rounded-none border border-gray-300 hover:bg-black hover:text-white hover:border-black transition-all duration-300" />
                  <CarouselNext className="static translate-y-0 h-9 w-9 rounded-none border border-gray-300 hover:bg-black hover:text-white hover:border-black transition-all duration-300" />
                </div>
              </div>
            </Carousel>
          )}

          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/2] bg-gray-100 animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ STATS COUNTER ═══════════════ */}
      <section ref={statsRef} className="relative overflow-hidden bg-[#0a0a0a] py-14 sm:py-18">
        {/* Subtle background grid lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        <div className="relative max-w-[1800px] mx-auto px-6 lg:px-12">
          {/* Label */}
          <AnimatedSection variant="fade-up" className="mb-12">
            <div className="flex items-center gap-4">
              <span className="brand-bar" />
              <p className="text-[10px] uppercase tracking-[0.5em] text-white/30 font-semibold font-grotesk">
                ROEX in Numbers
              </p>
            </div>
          </AnimatedSection>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.07]">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="px-6 lg:px-10 py-4 first:pl-0"
              >
                <div className="font-montserrat text-[48px] sm:text-[60px] lg:text-[72px] font-extralight text-white leading-none tracking-tight mb-3">
                  {stat.value}
                </div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ INSPIRATION ═══════════════ */}
      <section className="py-14 sm:py-20 bg-[#ece8df] overflow-hidden">
        <div className="max-w-[1800px] mx-auto">
          <AnimatedSection variant="fade-up" className="px-6 sm:px-10 lg:px-16 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[2px] bg-brand-gradient-horizontal flex-shrink-0" />
              <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500 font-medium font-grotesk">
                Solutions
              </p>
            </div>
            <h2 className="font-montserrat text-3xl sm:text-4xl md:text-5xl font-light text-stone-900 tracking-tight">
              Perfect sound for every space
            </h2>
          </AnimatedSection>
          <ElegantCarousel items={inspirationItems} />
        </div>
      </section>

      {/* ═══════════════ BROWSE CATEGORIES ═══════════════ */}
      {categoryCards.length > 0 && (
        <section className="py-20 sm:py-28 bg-white overflow-hidden">
          <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
            {/* Header row */}
            <div className="flex items-end justify-between mb-10">
              <AnimatedSection variant="fade-right">
                <div className="flex items-center gap-3 mb-3">
                  <span className="brand-bar" />
                  <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400 font-semibold font-grotesk">
                    Collections
                  </p>
                </div>
                <h2 className="font-montserrat text-2xl sm:text-3xl lg:text-[36px] font-light text-gray-900 tracking-tight">
                  Browse by category
                </h2>
              </AnimatedSection>
              <AnimatedSection variant="fade-left">
                <Link
                  href="/shop"
                  className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-gray-500 font-medium border-b border-gray-300 pb-1 hover:text-gray-900 hover:border-gray-900 transition-all duration-300"
                >
                  View All
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </AnimatedSection>
            </div>

            {/* Carousel */}
            <Carousel opts={{ align: 'start', loop: false, dragFree: true }} className="w-full">
              <CarouselContent className="-ml-4">
                {categoryCards.map((cat) => (
                  <CarouselItem
                    key={cat.name}
                    className="pl-4 basis-[85%] sm:basis-[50%] md:basis-[36%] lg:basis-[28%] xl:basis-[22%]"
                  >
                    <Link href={cat.href} className="group block">
                      <div className="relative aspect-[3/4] bg-[#f2f2f0] overflow-hidden">
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          sizes="(max-width: 640px) 85vw, (max-width: 768px) 50vw, (max-width: 1024px) 36vw, 22vw"
                        />
                        {/* Bottom overlay */}
                        <div className="absolute bottom-0 inset-x-0 z-10">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent group-hover:from-black/85 transition-all duration-500" />
                          <div className="relative px-4 pb-5 pt-14">
                            <p className="text-[9px] uppercase tracking-[0.25em] text-white/50 mb-1 font-medium">
                              {cat.description?.split(' ').slice(0, 3).join(' ')}
                            </p>
                            <div className="flex items-end justify-between gap-2">
                              <h3 className="font-montserrat text-[15px] font-normal text-white leading-snug flex-1">
                                {cat.name}
                              </h3>
                              <div className="flex-shrink-0 w-8 h-8 bg-white/10 border border-white/20 flex items-center justify-center transition-all duration-400 group-hover:bg-white group-hover:border-white">
                                <ArrowRight className="h-3.5 w-3.5 text-white transition-all duration-400 group-hover:text-black group-hover:translate-x-0.5" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Nav arrows */}
              <div className="flex items-center mt-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mr-auto">
                  Drag to explore
                </span>
                <div className="flex items-center gap-2">
                  <CarouselPrevious className="static translate-y-0 h-9 w-9 rounded-none border border-gray-300 hover:bg-black hover:text-white hover:border-black transition-all duration-300" />
                  <CarouselNext className="static translate-y-0 h-9 w-9 rounded-none border border-gray-300 hover:bg-black hover:text-white hover:border-black transition-all duration-300" />
                </div>
              </div>
            </Carousel>
          </div>
        </section>
      )}

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="pt-20 sm:pt-28 pb-0 bg-[#f5f4f0]">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="flex items-end justify-between mb-10">
            <AnimatedSection variant="fade-right">
              <div className="flex items-center gap-3 mb-3">
                <span className="brand-bar" />
                <p className="text-[10px] uppercase tracking-[0.5em] text-stone-400 font-semibold font-grotesk">
                  Customer Reviews
                </p>
              </div>
              <h2 className="font-montserrat text-2xl sm:text-3xl lg:text-[36px] font-light text-stone-900 tracking-tight">
                What our customers say
              </h2>
            </AnimatedSection>
            {/* Dots */}
            <div className="flex gap-2 pb-1">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => testimonialApi?.scrollTo(i)}
                  className={`h-1.5 transition-all duration-500 ${currentTestimonial === i ? 'bg-stone-800 w-6' : 'bg-stone-300 w-1.5 rounded-full'}`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* 4-up carousel */}
          <Carousel
            setApi={setTestimonialApi}
            opts={{ loop: true, align: 'start', dragFree: true }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((t, i) => (
                <CarouselItem key={i} className="pl-4 basis-[90%] sm:basis-[50%] lg:basis-[25%]">
                  <div className="bg-white p-7 sm:p-8 h-full flex flex-col">
                    <Quote className="h-7 w-7 text-gray-200 mb-5 flex-shrink-0" />
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-3 w-3 fill-[#eb531f] text-[#eb531f]" />
                      ))}
                    </div>
                    <p className="text-[13px] text-gray-600 font-light leading-[1.8] flex-1">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="mt-6 pt-5 border-t border-gray-100">
                      <p className="text-[12px] font-medium text-gray-900">{t.author}</p>
                      <p className="text-[11px] text-gray-400 font-light mt-0.5">{t.role}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* ═══════════════ FULL-WIDTH IMAGE + TEXT ═══════════════ */}
        <div className="relative min-h-[55vh] sm:min-h-[65vh] flex items-center overflow-hidden mt-12">
          <motion.div
            style={{ y: fullWidthParallax }}
            className="absolute -top-[200px] -bottom-[200px] left-0 right-0"
          >
            <Image
              src="/images/homepage-fullwidth.avif"
              alt="ROEX ceiling speakers in modern office"
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
          </motion.div>
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative z-10 max-w-[1800px] mx-auto w-full px-6 lg:px-12 py-20 sm:py-28">
            <AnimatedSection variant="fade-left" className="max-w-xl">
              <div className="flex items-center gap-3 mb-5">
                <span className="brand-bar" />
                <p className="text-[10px] uppercase tracking-[0.35em] text-white/40 font-medium font-grotesk">
                  Our Philosophy
                </p>
              </div>
              <h2 className="font-montserrat text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white leading-[1.1] tracking-tight">
                Sound Merges Light
              </h2>
              <p className="mt-6 sm:mt-8 text-[15px] sm:text-[16px] text-white/60 font-light leading-[1.8]">
                ROEX speaker systems integrate perfectly into lighting design. Whether positioned on
                lighting tracks or between light sources — our speakers offer an aesthetic symbiosis
                of sound and light, engineered for seamless architectural integration.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center justify-center h-12 px-10 mt-10 sm:mt-12 border border-white/30 text-white text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-white hover:text-black transition-all duration-500 group"
              >
                Our Story
                <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ═══════════════ FROM THE BLOG ═══════════════ */}
      {blogPosts.length > 0 && (
        <section className="py-20 sm:py-28 bg-white">
          <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
            {/* Header row */}
            <div className="flex items-end justify-between mb-10">
              <AnimatedSection variant="fade-right">
                <div className="flex items-center gap-3 mb-3">
                  <span className="brand-bar" />
                  <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400 font-semibold font-grotesk">
                    The Bulletin
                  </p>
                </div>
                <h2 className="font-montserrat text-2xl sm:text-3xl lg:text-[36px] font-light text-gray-900 tracking-tight">
                  From the blog
                </h2>
              </AnimatedSection>
              <AnimatedSection variant="fade-left">
                <Link
                  href="/blog"
                  className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-gray-500 font-medium border-b border-gray-300 pb-1 hover:text-gray-900 hover:border-gray-900 transition-all duration-300"
                >
                  View All
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </AnimatedSection>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
                >
                  <Link href={`/blog/${post.slug}`} className="group block">
                    {/* Image */}
                    <div className="relative aspect-[16/10] bg-[#f2f2f0] overflow-hidden mb-5">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-white bg-black/60 backdrop-blur-sm px-3 py-1.5 font-medium">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-3 mb-3 text-[10px] text-gray-400 font-light">
                      <span>{post.date}</span>
                      <span className="text-gray-200">&middot;</span>
                      <span>{post.readTime}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-montserrat text-lg sm:text-xl font-light text-gray-900 tracking-tight leading-snug line-clamp-2 mb-3">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-[13px] text-gray-500 font-light leading-[1.75] line-clamp-2 mb-5">
                      {post.excerpt}
                    </p>

                    <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-gray-900">
                      Read More <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

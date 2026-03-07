'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export interface HeroSlide {
  image: string
  video?: string | null
  mediaType?: 'image' | 'video'
  title: string
  subtitle: string
  cta: { label: string; href: string }
}

const SLIDE_DURATION = 6000

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slideProgress, setSlideProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)

  const { scrollY } = useScroll()
  const heroParallax = useTransform(scrollY, [0, 800], [0, 80])
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0.3])

  // Hero auto-advance with progress
  useEffect(() => {
    if (slides.length === 0) return
    setSlideProgress(0)
    progressRef.current = setInterval(() => {
      setSlideProgress((prev) => Math.min(prev + 100 / (SLIDE_DURATION / 50), 100))
    }, 50)
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, SLIDE_DURATION)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [currentSlide, slides.length])

  const goToSlide = (index: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (progressRef.current) clearInterval(progressRef.current)
    setCurrentSlide(index)
  }

  if (slides.length === 0) return null

  const slide = slides[currentSlide]

  return (
    <section className="relative h-screen overflow-hidden">
      {/* All slides are always in the DOM so their images preload immediately */}
      {slides.map((s, i) => (
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
                preload="metadata"
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
          {slides.map((_, i) => (
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
  )
}

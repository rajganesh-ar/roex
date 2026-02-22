'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export interface CarouselSlide {
  image: string
  title: string
  subtitle: string
  cta: string
  href?: string
}

interface ElegantCarouselProps {
  items: CarouselSlide[]
  autoPlayInterval?: number
}

export default function ElegantCarousel({ items, autoPlayInterval = 5000 }: ElegantCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [progress, setProgress] = useState(0)
  const touchStartX = useRef(0)

  // Use refs to avoid stale closures in intervals
  const currentIndexRef = useRef(currentIndex)
  const isTransitioningRef = useRef(isTransitioning)
  currentIndexRef.current = currentIndex
  isTransitioningRef.current = isTransitioning

  const TRANSITION_DURATION = 600

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioningRef.current || index === currentIndexRef.current) return
      setIsTransitioning(true)
      setProgress(0)
      setTimeout(() => {
        setCurrentIndex(index)
        setTimeout(() => setIsTransitioning(false), 50)
      }, TRANSITION_DURATION / 2)
    },
    [items.length],
  )

  const goNext = useCallback(() => {
    const next = (currentIndexRef.current + 1) % items.length
    goToSlide(next)
  }, [items.length, goToSlide])

  const goPrev = useCallback(() => {
    const prev = (currentIndexRef.current - 1 + items.length) % items.length
    goToSlide(prev)
  }, [items.length, goToSlide])

  // Autoplay & progress
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 100 / (autoPlayInterval / 50)))
    }, 50)

    const autoPlayTimer = setInterval(goNext, autoPlayInterval)

    return () => {
      clearInterval(autoPlayTimer)
      clearInterval(progressInterval)
    }
  }, [currentIndex, autoPlayInterval, goNext])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 60) {
      diff > 0 ? goNext() : goPrev()
    }
  }

  const slide = items[currentIndex]

  return (
    <div className="relative" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* Main content */}
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[400px] sm:min-h-[440px] lg:min-h-[500px]">
          {/* Left: Text */}
          <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-10 lg:py-12 order-2 lg:order-1">
            <div
              className={`transition-all duration-500 ${
                isTransitioning ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'
              }`}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-px bg-gray-300" />
                <span className="text-[11px] text-gray-400">
                  {String(currentIndex + 1).padStart(2, '0')} /{' '}
                  {String(items.length).padStart(2, '0')}
                </span>
              </div>

              <h3 className="font-montserrat text-2xl sm:text-3xl lg:text-[38px] font-light text-gray-900 tracking-tight leading-[1.1] mb-3 sm:mb-4">
                {slide.title}
              </h3>

              <p className="text-[15px] text-gray-500 font-light leading-[2] max-w-lg">
                {slide.subtitle}
              </p>
            </div>

            {/* Navigation arrows */}
            <div className="flex items-center gap-3 mt-8 lg:mt-10">
              <button
                onClick={goPrev}
                className="h-9 w-9 border border-gray-300 flex items-center justify-center text-gray-600"
                aria-label="Previous"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={goNext}
                className="h-9 w-9 border border-gray-300 flex items-center justify-center text-gray-600"
                aria-label="Next"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative overflow-hidden order-1 lg:order-2 aspect-[16/10] lg:aspect-auto">
            <div
              className={`absolute inset-0 transition-all duration-500 ${
                isTransitioning ? 'opacity-0 scale-[1.03]' : 'opacity-100 scale-100'
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress indicators */}
      <div
        className="max-w-[1800px] mx-auto grid gap-3 px-6 sm:px-10 lg:px-12 pt-5 pb-4"
        style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
      >
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="text-left group"
            aria-label={`Go to ${item.title}`}
          >
            <div className="h-[2px] bg-gray-200 overflow-hidden mb-2">
              <div
                className="h-full bg-gray-900 transition-all duration-100 ease-linear"
                style={{
                  width:
                    index === currentIndex ? `${progress}%` : index < currentIndex ? '100%' : '0%',
                }}
              />
            </div>
            <p className="text-[10px] text-gray-500 truncate">{item.title}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

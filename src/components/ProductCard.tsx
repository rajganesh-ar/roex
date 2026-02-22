'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface ProductCardProps {
  id: string
  name: string
  slug: string
  image: string
  category?: string
  availability?: 'available' | 'unavailable'
}

export function ProductCard({ name, slug, image, category }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/products/${slug}`} className="group block">
        {/* Card — 768×512 = 3:2 landscape */}
        <div className="relative aspect-[3/2] bg-[#f2f2f0] overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Bottom info overlay — always visible, lifts on hover */}
          <div className="absolute bottom-0 inset-x-0 z-10">
            {/* Gradient backdrop */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent transition-opacity duration-500 group-hover:from-black/85" />
            {/* Content */}
            <div className="relative px-4 pb-4 pt-10">
              <div className="flex items-end justify-between gap-3">
                <h3 className="font-montserrat text-[13px] sm:text-[14px] font-normal text-white leading-snug line-clamp-2 flex-1 group-hover:text-white/90 transition-colors duration-300">
                  {name}
                </h3>
                {/* Arrow — slides right on hover */}
                <div className="flex-shrink-0 w-8 h-8 bg-white/10 border border-white/20 flex items-center justify-center transition-all duration-400 group-hover:bg-white group-hover:border-white">
                  <ArrowRight className="h-3.5 w-3.5 text-white transition-all duration-400 group-hover:text-black group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Calendar } from 'lucide-react'
import { AnimatedSection } from '@/components/AnimatedSection'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  featuredImage: string
  category: string
  author: { name: string; role?: string; avatar?: string } | null
  publishedDate: string | null
  readTime: number | null
  featured: boolean
}

const categoryLabels: Record<string, string> = {
  technology: 'Technology',
  lifestyle: 'Lifestyle',
  'behind-the-sound': 'Behind The Sound',
  'product-news': 'Product News',
  partnerships: 'Partnerships',
  events: 'Events',
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

interface BlogPageClientProps {
  initialPosts: BlogPost[]
}

export default function BlogPageClient({ initialPosts }: BlogPageClientProps) {
  const [posts] = useState<BlogPost[]>(initialPosts)
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const filteredPosts =
    activeCategory === 'all' ? posts : posts.filter((p) => p.category === activeCategory)
  const featuredPost = posts.find((p) => p.featured) || posts[0]
  const gridPosts = filteredPosts.filter((p) => p.id !== featuredPost?.id)

  const categories = ['all', ...Array.from(new Set(posts.map((p) => p.category)))]

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0a0a0a] py-24 sm:py-32 md:py-40">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        <div className="relative max-w-[1800px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/30 mb-6"
          >
            <Link href="/" className="hover:text-white/60 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white/50">Blog</span>
          </motion.div>
          <div className="max-w-3xl">
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-8 h-px bg-white/20" />
              <p className="text-[10px] uppercase tracking-[0.35em] text-white/30 font-medium font-grotesk">
                Journal
              </p>
            </motion.div>
            <motion.h1
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-montserrat text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight text-white tracking-tight leading-[1.05]"
            >
              Stories &amp;
              <br />
              Insights
            </motion.h1>
            <motion.p
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-6 text-[14px] sm:text-[15px] text-white/35 font-light leading-[1.85] max-w-lg"
            >
              Perspectives on sound design, technology, and the art of acoustic engineering.
            </motion.p>
          </div>
        </div>
      </section>

      {/* CATEGORY FILTER */}
      <div className="border-b border-gray-100 sticky top-[72px] bg-white/95 backdrop-blur-md z-30">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-1 h-13 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-5 py-5 text-[10px] uppercase tracking-[0.2em] whitespace-nowrap transition-colors ${
                  activeCategory === cat ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {cat === 'all' ? 'All' : categoryLabels[cat] || cat}
                {activeCategory === cat && (
                  <motion.div
                    layoutId="categoryUnderline"
                    className="absolute bottom-0 left-0 right-0 h-px bg-gray-900"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURED POST */}
      {featuredPost && activeCategory === 'all' && (
        <section className="max-w-[1800px] mx-auto px-6 lg:px-12 py-12 sm:py-16 md:py-20">
          <AnimatedSection variant="fade-up">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-px bg-gray-400" />
              <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 font-medium">
                Featured
              </p>
            </div>
            <Link href={`/blog/${featuredPost.slug}`} className="group block">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                <div className="relative aspect-[16/10] bg-[#f5f4f0] overflow-hidden">
                  <Image
                    src={featuredPost.featuredImage}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute top-5 left-5">
                    <span className="bg-[#0a0a0a] text-white px-3 py-1 text-[9px] uppercase tracking-[0.2em] font-medium">
                      {categoryLabels[featuredPost.category] || featuredPost.category}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-5">
                    {featuredPost.publishedDate && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        {formatDate(featuredPost.publishedDate)}
                      </span>
                    )}
                    {featuredPost.readTime && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        {featuredPost.readTime} min read
                      </span>
                    )}
                  </div>
                  <h2 className="font-montserrat text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-light text-gray-900 tracking-tight leading-[1.15] group-hover:text-gray-500 transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="mt-5 text-[14px] sm:text-[15px] text-gray-500 font-light leading-[1.85] line-clamp-3 max-w-lg">
                    {featuredPost.excerpt}
                  </p>
                  <div className="mt-7 flex items-center gap-2.5 text-[10px] uppercase tracking-[0.2em] text-gray-900 border-b border-gray-300 pb-0.5 self-start w-fit group-hover:border-gray-900 transition-colors">
                    Read Article <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </Link>
          </AnimatedSection>
        </section>
      )}

      {/* DIVIDER */}
      {featuredPost && activeCategory === 'all' && (
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="h-px bg-gray-100" />
        </div>
      )}

      {/* BLOG GRID */}
      <section className="max-w-[1800px] mx-auto px-6 lg:px-12 py-12 sm:py-16 md:py-20">
        {filteredPosts.length === 0 || gridPosts.length === 0 ? (
          filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-montserrat text-xl font-light text-gray-900 mb-2">
                No posts found
              </p>
              <p className="text-[13px] text-gray-400 font-light">
                Check back soon for new articles
              </p>
            </div>
          ) : null
        ) : (
          <>
            {activeCategory !== 'all' && (
              <div className="flex items-center gap-4 mb-10">
                <div className="w-8 h-px bg-gray-400" />
                <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 font-medium">
                  {categoryLabels[activeCategory] || activeCategory}
                </p>
              </div>
            )}
            {activeCategory === 'all' && gridPosts.length > 0 && (
              <div className="flex items-center gap-4 mb-10">
                <div className="w-8 h-px bg-gray-400" />
                <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 font-medium">
                  Latest
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 sm:gap-x-8 sm:gap-y-14">
              {(activeCategory === 'all' ? gridPosts : filteredPosts).map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <div className="relative aspect-[16/10] bg-[#f5f4f0] overflow-hidden">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#0a0a0a]/70 backdrop-blur-sm text-white px-2.5 py-1 text-[9px] uppercase tracking-[0.2em]">
                          {categoryLabels[post.category] || post.category}
                        </span>
                      </div>
                    </div>
                    <div className="pt-5">
                      <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-3">
                        {post.publishedDate && <span>{formatDate(post.publishedDate)}</span>}
                        {post.publishedDate && post.readTime && (
                          <span className="text-gray-200">|</span>
                        )}
                        {post.readTime && <span>{post.readTime} min read</span>}
                      </div>
                      <h3 className="font-montserrat text-[17px] sm:text-[19px] font-light text-gray-900 tracking-tight leading-[1.35] group-hover:text-gray-500 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="mt-3 text-[13px] text-gray-400 font-light leading-[1.8] line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-between">
                        {post.author ? (
                          <span className="text-[10px] uppercase tracking-[0.15em] text-gray-400">
                            {post.author.name}
                          </span>
                        ) : (
                          <span />
                        )}
                        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-gray-600 group-hover:gap-2.5 transition-all">
                          Read <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* NEWSLETTER CTA */}
      <section className="relative overflow-hidden bg-[#f5f4f0] py-20 sm:py-24 md:py-28">
        <div className="relative max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <AnimatedSection variant="fade-right">
              <div className="flex items-center gap-4 mb-6">
                <span className="brand-bar" />
                <p className="text-[10px] uppercase tracking-[0.35em] text-stone-400 font-medium font-grotesk">
                  Stay Updated
                </p>
              </div>
              <h2 className="font-montserrat text-3xl sm:text-4xl md:text-5xl font-extralight text-stone-900 tracking-tight leading-[1.1]">
                Subscribe to
                <br />
                our newsletter
              </h2>
              <p className="mt-5 text-[14px] text-stone-500 font-light leading-[1.85] max-w-sm">
                Get the latest stories, product news, and audio insights delivered to your inbox.
              </p>
            </AnimatedSection>
            <AnimatedSection variant="fade-left">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Email address"
                  className="flex-1 bg-transparent border border-stone-300 px-5 h-12 text-[13px] text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-500 transition-colors"
                />
                <button className="bg-black text-white h-12 px-8 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-black/80 transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              <p className="mt-4 text-[11px] text-stone-400 font-light">
                No spam. Unsubscribe at any time.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  )
}

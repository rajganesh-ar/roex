'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
} from 'lucide-react'
import { AnimatedSection } from '@/components/AnimatedSection'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  featuredImage: string
  content: any
  category: string
  author: { name: string; role?: string; avatar?: string } | null
  tags: string[]
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

/* Simple rich text renderer */
function RichTextRenderer({ content }: { content: any }) {
  if (!content || !content.root?.children) {
    return <p className="text-gray-600 font-light leading-relaxed">Content coming soon.</p>
  }

  const renderNode = (node: any, index: number): React.ReactNode => {
    if (node.type === 'paragraph') {
      return (
        <p
          key={index}
          className="text-[15px] sm:text-[16px] text-gray-600 font-light leading-[1.85] mb-6"
        >
          {node.children?.map((child: any, i: number) => renderInline(child, i))}
        </p>
      )
    }
    if (node.type === 'heading') {
      const level = node.tag?.replace('h', '') || '2'
      const HeadingTag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      const headingContent = node.children?.map((child: any, i: number) => renderInline(child, i))
      return React.createElement(
        HeadingTag,
        {
          key: index,
          className:
            'font-montserrat font-light text-gray-900 tracking-tight mt-10 mb-4 text-xl sm:text-2xl',
        },
        headingContent,
      )
    }
    if (node.type === 'list') {
      const ListTag = node.listType === 'number' ? 'ol' : 'ul'
      return (
        <ListTag
          key={index}
          className={`mb-6 space-y-2 pl-6 ${node.listType === 'number' ? 'list-decimal' : 'list-disc'} text-[15px] text-gray-600 font-light`}
        >
          {node.children?.map((child: any, i: number) => renderNode(child, i))}
        </ListTag>
      )
    }
    if (node.type === 'listitem') {
      return (
        <li key={index} className="leading-relaxed">
          {node.children?.map((child: any, i: number) => {
            if (child.type === 'paragraph' || child.type === 'list') return renderNode(child, i)
            return renderInline(child, i)
          })}
        </li>
      )
    }
    if (node.type === 'quote') {
      return (
        <blockquote
          key={index}
          className="border-l-2 border-gray-900 pl-6 my-8 italic text-gray-700"
        >
          {node.children?.map((child: any, i: number) => renderNode(child, i))}
        </blockquote>
      )
    }
    if (node.type === 'upload') {
      return (
        <figure key={index} className="my-8">
          <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
            <Image
              src={node.value?.url || ''}
              alt={node.value?.alt || ''}
              fill
              className="object-cover"
            />
          </div>
        </figure>
      )
    }
    // Fallback
    if (node.children) {
      return (
        <div key={index}>{node.children.map((child: any, i: number) => renderNode(child, i))}</div>
      )
    }
    return null
  }

  const renderInline = (node: any, index: number): React.ReactNode => {
    if (node.type === 'text' || !node.type) {
      let text: React.ReactNode = node.text || ''
      if (node.bold) text = <strong key={index}>{text}</strong>
      if (node.italic) text = <em key={index}>{text}</em>
      if (node.underline) text = <u key={index}>{text}</u>
      return text
    }
    if (node.type === 'link') {
      return (
        <a
          key={index}
          href={node.url}
          className="text-gray-900 underline underline-offset-4 hover:text-gray-600 transition-colors"
          target={node.newTab ? '_blank' : undefined}
        >
          {node.children?.map((child: any, i: number) => renderInline(child, i))}
        </a>
      )
    }
    return null
  }

  return <div>{content.root.children.map((node: any, i: number) => renderNode(node, i))}</div>
}

interface BlogPostClientProps {
  post: BlogPost
  relatedPosts: BlogPost[]
}

export default function BlogPostClient({ post, relatedPosts }: BlogPostClientProps) {
  return (
    <div className="bg-white">
      {/* Hero image */}
      <section className="relative h-[35vh] sm:h-[40vh] md:h-[50vh] min-h-[300px] flex items-end overflow-hidden">
        <Image
          src={post.featuredImage}
          alt={post.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 max-w-[1800px] mx-auto w-full px-6 lg:px-12 pb-10 sm:pb-14 md:pb-16">
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-white/50 mb-3"
          >
            <Link href="/" className="hover:text-white/80 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white/80 transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-white/80 truncate max-w-[200px]">{post.title}</span>
          </motion.nav>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] uppercase tracking-[0.2em] text-white bg-white/20 backdrop-blur-sm px-3 py-1">
              {categoryLabels[post.category] || post.category}
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-montserrat text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight max-w-4xl leading-tight"
          >
            {post.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center gap-4 mt-5 text-[11px] text-white/60"
          >
            {post.author && <span>By {post.author.name}</span>}
            {post.publishedDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(post.publishedDate)}
              </span>
            )}
            {post.readTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {post.readTime} min read
              </span>
            )}
          </motion.div>
        </div>
      </section>

      {/* Article content */}
      <article className="max-w-[1800px] mx-auto px-6 lg:px-12 py-10 sm:py-14 md:py-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Sidebar - left */}
          <aside className="hidden lg:block lg:col-span-2">
            <div className="sticky top-[100px] space-y-6">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.15em] text-gray-500 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </Link>

              {/* Share */}
              <div className="pt-6 border-t border-gray-200">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-4">Share</p>
                <div className="flex flex-col gap-3">
                  <button className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors">
                    <Twitter className="h-4 w-4" />
                  </button>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors">
                    <Facebook className="h-4 w-4" />
                  </button>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors">
                    <Linkedin className="h-4 w-4" />
                  </button>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="pt-6 border-t border-gray-200">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-4">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase tracking-[0.15em] text-gray-500 border border-gray-200 px-2.5 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main content */}
          <div className="lg:col-span-7">
            <AnimatedSection variant="fade-up">
              {post.excerpt && (
                <p className="text-lg sm:text-xl text-gray-700 font-light leading-relaxed mb-10 pb-10 border-b border-gray-200">
                  {post.excerpt}
                </p>
              )}

              <RichTextRenderer content={post.content} />

              {/* Fallback content when no CMS content */}
              {!post.content && (
                <div className="space-y-6">
                  <p className="text-[15px] sm:text-[16px] text-gray-600 font-light leading-[1.85]">
                    At ROEX, our engineering teams spend thousands of hours perfecting every
                    component. This article explores the methodologies, materials, and technologies
                    that make our products stand apart in the world of premium audio.
                  </p>
                  <p className="text-[15px] sm:text-[16px] text-gray-600 font-light leading-[1.85]">
                    The pursuit of true sound is not just about frequency response charts and
                    distortion measurements — it&apos;s about capturing the emotional essence of
                    music and reproducing it with absolute fidelity.
                  </p>
                  <h2 className="font-montserrat font-light text-gray-900 tracking-tight mt-10 mb-4 text-xl sm:text-2xl">
                    Engineering Philosophy
                  </h2>
                  <p className="text-[15px] sm:text-[16px] text-gray-600 font-light leading-[1.85]">
                    Every ROEX product begins as a concept driven by one question: &ldquo;How can we
                    get closer to the original recording?&rdquo; This relentless focus on accuracy
                    drives our material selection, driver design, and cabinet engineering.
                  </p>
                  <p className="text-[15px] sm:text-[16px] text-gray-600 font-light leading-[1.85]">
                    Our proprietary Continuum cone technology, developed over five years, uses a
                    composite material that delivers a more precise, consistent piston-like
                    behaviour over a wider frequency range than conventional materials.
                  </p>
                  <h2 className="font-montserrat font-light text-gray-900 tracking-tight mt-10 mb-4 text-xl sm:text-2xl">
                    The Listening Room
                  </h2>
                  <p className="text-[15px] sm:text-[16px] text-gray-600 font-light leading-[1.85]">
                    Before any ROEX product ships, it spends hundreds of hours in our dedicated
                    listening room — a precisely calibrated space designed to reveal even the
                    smallest sonic imperfection. Here, our team of experienced listeners evaluates
                    every aspect of the sound signature.
                  </p>
                </div>
              )}
            </AnimatedSection>

            {/* Author card */}
            {post.author && (
              <AnimatedSection
                variant="fade-up"
                delay={0.1}
                className="mt-14 pt-10 border-t border-gray-200"
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {post.author.avatar ? (
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        width={56}
                        height={56}
                        className="object-cover"
                      />
                    ) : (
                      <span className="font-montserrat text-lg text-gray-400">
                        {post.author.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-1">
                      Written by
                    </p>
                    <p className="font-montserrat text-base font-medium text-gray-900">
                      {post.author.name}
                    </p>
                    {post.author.role && (
                      <p className="text-[13px] text-gray-500 font-light mt-0.5">
                        {post.author.role}
                      </p>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            )}

            {/* Mobile share + tags */}
            <div className="lg:hidden mt-10 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-4 mb-6">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400">Share</p>
                <div className="flex gap-3">
                  <button className="text-gray-400 hover:text-gray-900 transition-colors">
                    <Twitter className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-900 transition-colors">
                    <Facebook className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-900 transition-colors">
                    <Linkedin className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-900 transition-colors">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] uppercase tracking-[0.15em] text-gray-500 border border-gray-200 px-2.5 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar placeholder */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-[100px] space-y-8">
              {/* Related posts */}
              {relatedPosts.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-5">
                    Related Articles
                  </p>
                  <div className="space-y-6">
                    {relatedPosts.map((rp) => (
                      <Link key={rp.id} href={`/blog/${rp.slug}`} className="group block">
                        <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden mb-3">
                          <Image
                            src={rp.featuredImage}
                            alt={rp.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <h4 className="font-montserrat text-sm font-light text-gray-900 group-hover:text-gray-600 transition-colors leading-snug line-clamp-2">
                          {rp.title}
                        </h4>
                        <p className="text-[11px] text-gray-400 mt-1">
                          {formatDate(rp.publishedDate)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="bg-gray-50 p-6">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-3">
                  Newsletter
                </p>
                <p className="font-montserrat text-sm font-light text-gray-900 mb-4">
                  Get articles delivered to your inbox
                </p>
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 mb-3"
                />
                <button className="w-full bg-black text-white py-2.5 text-[11px] uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Back to blog */}
      <section className="border-t border-gray-200">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-10 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.15em] text-gray-900 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Articles
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.15em] text-gray-900 hover:text-gray-600 transition-colors"
          >
            Next Article
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

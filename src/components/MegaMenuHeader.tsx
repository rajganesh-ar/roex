'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, ChevronDown, ChevronRight, ArrowRight } from 'lucide-react'
import type { MegaMenuColumn, FeaturedProduct } from '@/app/(frontend)/TemplateClient'

/*  Static fallback columns (shown when CMS returns no data)  */
const FALLBACK_COLUMNS: MegaMenuColumn[] = [
  {
    id: 'speakers',
    name: 'Speakers',
    slug: 'speakers',
    image: '/images/menu-speakers.avif',
    children: [
      { id: 'cabled-speakers', name: 'Cabled Speakers', slug: 'cabled-speakers' },
      {
        id: 'wireless-smart-speakers',
        name: 'Wireless Smart Speakers',
        slug: 'wireless-smart-speakers',
      },
      { id: 'ceiling-speakers', name: 'Ceiling Speakers', slug: 'ceiling-speakers' },
      { id: 'track-speakers', name: 'Track Speakers', slug: 'track-speakers' },
      { id: 'pendant-speakers', name: 'Pendant Speakers', slug: 'pendant-speakers' },
    ],
  },
  {
    id: 'cables',
    name: 'Cables',
    slug: 'cables',
    image: '/images/category-card-cable.avif',
    children: [
      { id: 'speaker-cables', name: 'Speaker Cables', slug: 'speaker-cables' },
      { id: 'signal-cables', name: 'Signal Cables', slug: 'signal-cables' },
    ],
  },
  {
    id: 'components',
    name: 'Components',
    slug: 'components',
    image: '/images/category-card-components.avif',
    children: [
      { id: 'amplifiers', name: 'Amplifiers', slug: 'amplifiers' },
      { id: 'accessories', name: 'Accessories', slug: 'accessories' },
    ],
  },
]

/*  Static navigation links  */
const NAV_LINKS = [
  { id: 'products', label: 'Products', href: '/products', megaMenu: true },
  { id: 'solutions', label: 'Solutions', href: '/solutions', megaMenu: false },
  { id: 'about', label: 'About', href: '/about', megaMenu: false },
  { id: 'blog', label: 'Blog', href: '/blog', megaMenu: false },
  { id: 'contact', label: 'Contact', href: '/contact', megaMenu: false },
]

interface MegaMenuHeaderProps {
  megaMenuColumns?: MegaMenuColumn[]
  featuredProducts?: FeaturedProduct[]
}

export function MegaMenuHeader({
  megaMenuColumns,
  featuredProducts = [],
}: MegaMenuHeaderProps) {
  const columns =
    megaMenuColumns && megaMenuColumns.length > 0 ? megaMenuColumns : FALLBACK_COLUMNS
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null)
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<FeaturedProduct[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()

  /* Close everything on route change */
  useEffect(() => {
    setMobileMenuOpen(false)
    setMegaMenuOpen(false)
  }, [pathname])

  /* Body scroll-lock when overlay is open */
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen || searchOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen, searchOpen])

  /* Scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Auto-focus search input */
  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus()
  }, [searchOpen])

  const openMegaMenu = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    setMegaMenuOpen(true)
  }

  const scheduleMegaMenuClose = () => {
    closeTimerRef.current = setTimeout(() => setMegaMenuOpen(false), 150)
  }

  const cancelMegaMenuClose = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
  }

  const handleSearchInput = useCallback((value: string) => {
    setSearchQuery(value)
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    if (!value.trim()) {
      setSearchResults([])
      return
    }
    setSearchLoading(true)
    searchTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/shop-products?search=${encodeURIComponent(value)}&limit=6`)
        const data = await res.json()
        setSearchResults(data.products?.slice(0, 6) || [])
      } catch {
        setSearchResults([])
      } finally {
        setSearchLoading(false)
      }
    }, 300)
  }, [])

  const navSolid = scrolled || megaMenuOpen

  return (
    <>
      {/*  HEADER BAR  */}
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          navSolid
            ? 'bg-black/95 backdrop-blur-md shadow-[0_2px_30px_rgba(0,0,0,0.3)]'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/roex-logo-white.svg"
              alt="ROEX"
              width={80}
              height={28}
              priority
              className="h-7 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((item) =>
              item.megaMenu ? (
                <button
                  key={item.id}
                  onMouseEnter={openMegaMenu}
                  onMouseLeave={scheduleMegaMenuClose}
                  className="flex items-center gap-1 text-sm font-medium text-white hover:text-white/70 transition-colors"
                >
                  {item.label}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>
              ) : (
                <Link
                  key={item.id}
                  href={item.href}
                  className="text-sm font-medium text-white hover:text-white/70 transition-colors"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="p-2 text-white hover:text-white/70 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile actions */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="p-2 text-white hover:text-white/70 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              className="p-2 text-white hover:text-white/70 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/*  MEGA MENU PANEL  */}
        {megaMenuOpen && (
          <div
            className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-md border-t border-white/10 shadow-2xl animate-[megaSlideDown_0.2s_ease-out_both]"
            onMouseEnter={cancelMegaMenuClose}
            onMouseLeave={scheduleMegaMenuClose}
          >
            <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-4 gap-6">
                {/* Category columns */}
                {columns.map((col) => (
                  <div
                    key={col.id}
                    className="group"
                    onMouseEnter={() => setHoveredColumn(col.id)}
                    onMouseLeave={() => setHoveredColumn(null)}
                  >
                    <Link
                      href={`/products?category=${col.slug}`}
                      className="block relative overflow-hidden rounded-lg mb-3 aspect-[4/3]"
                    >
                      <Image
                        src={col.image || '/images/menu-speakers.avif'}
                        alt={col.name}
                        fill
                        sizes="(max-width: 1536px) 25vw, 384px"
                        loading="eager"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <span className="absolute bottom-3 left-3 text-white font-semibold text-lg">
                        {col.name}
                      </span>
                    </Link>
                    <ul className="space-y-1">
                      {col.children.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={`/products?category=${child.slug}`}
                            className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors py-0.5"
                          >
                            <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Featured product column */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
                    Featured
                  </p>
                  {featuredProducts.length > 0 ? (
                    <div className="space-y-4">
                      {featuredProducts.slice(0, 3).map((p) => (
                        <Link
                          key={p.id}
                          href={`/products/${p.slug}`}
                          className="flex gap-3 items-start group"
                        >
                          <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-white/5">
                            <Image
                              src={p.image}
                              alt={p.name}
                              fill
                              sizes="64px"
                              loading="eager"
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                          <div>
                            <p className="text-sm text-white group-hover:text-white/70 transition-colors line-clamp-2">
                              {p.name}
                            </p>
                            <p
                              className={`text-xs mt-0.5 ${p.availability === 'available' ? 'text-green-400' : 'text-white/40'}`}
                            >
                              {p.availability === 'available' ? 'In Stock' : 'Out of Stock'}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-white/40">Loading products</p>
                  )}
                  <Link
                    href="/products"
                    className="mt-6 inline-flex items-center gap-2 text-sm text-white hover:text-white/70 transition-colors"
                  >
                    View all products <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/*  SEARCH OVERLAY  */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex flex-col">
          <div className="flex items-center border-b border-white/20 px-4 sm:px-6 lg:px-8 h-16">
            <Search className="h-5 w-5 text-white/50 flex-shrink-0 mr-3" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder="Search products"
              className="flex-1 bg-transparent text-white placeholder-white/40 focus:outline-none text-lg"
            />
            <button
              onClick={() => {
                setSearchOpen(false)
                setSearchQuery('')
                setSearchResults([])
              }}
              className="p-2 text-white/50 hover:text-white transition-colors ml-3"
              aria-label="Close search"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
            {searchLoading && <p className="text-white/50 text-sm text-center">Searching</p>}
            {!searchLoading && searchQuery && searchResults.length === 0 && (
              <p className="text-white/50 text-sm text-center">
                No results for &ldquo;{searchQuery}&rdquo;
              </p>
            )}
            {searchResults.length > 0 && (
              <ul className="space-y-4 max-w-2xl mx-auto">
                {searchResults.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/products/${p.slug}`}
                      onClick={() => {
                        setSearchOpen(false)
                        setSearchQuery('')
                        setSearchResults([])
                      }}
                      className="flex gap-4 items-center group rounded-lg p-3 hover:bg-white/5 transition-colors"
                    >
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-white/10">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium group-hover:text-white/70 transition-colors">
                          {p.name}
                        </p>
                        <p className="text-white/40 text-xs mt-0.5 capitalize">{p.category}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {!searchQuery && (
              <div className="max-w-2xl mx-auto">
                <p className="text-white/40 text-sm mb-4">Popular categories</p>
                <div className="flex flex-wrap gap-2">
                  {columns.map((col) => (
                    <Link
                      key={col.id}
                      href={`/products?category=${col.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="px-4 py-2 rounded-full border border-white/20 text-sm text-white hover:border-white/50 transition-colors"
                    >
                      {col.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/*  MOBILE MENU  */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col lg:hidden">
          <div className="flex items-center justify-between px-4 h-16 border-b border-white/10">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <Image
                src="/images/roex-logo-white.svg"
                alt="ROEX"
                width={80}
                height={28}
                className="h-7 w-auto"
              />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="p-2 text-white hover:text-white/70 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
            {/* Products accordion */}
            <div>
              <button
                onClick={() => setMobileProductsOpen((v) => !v)}
                className="flex w-full items-center justify-between py-3 text-left text-white text-base font-medium"
              >
                Products
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-200 ${mobileProductsOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {mobileProductsOpen && (
                <div className="pl-4 pb-2 space-y-4">
                  {columns.map((col) => (
                    <div key={col.id}>
                      <Link
                        href={`/products?category=${col.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-1.5 text-sm font-semibold text-white/80 hover:text-white transition-colors"
                      >
                        {col.name}
                      </Link>
                      {col.children.map((child) => (
                        <Link
                          key={child.id}
                          href={`/products?category=${child.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-1.5 py-1 pl-3 text-sm text-white/50 hover:text-white transition-colors"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {NAV_LINKS.filter((n) => !n.megaMenu).map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-base font-medium text-white hover:text-white/70 transition-colors border-t border-white/10"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="px-4 py-6 border-t border-white/10">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              Contact Us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

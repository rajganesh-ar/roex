'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, ChevronDown, ArrowRight } from 'lucide-react'
import type { MegaMenuColumn, FeaturedProduct } from '@/app/(frontend)/TemplateClient'

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
    ],
  },
  {
    id: 'components',
    name: 'Components',
    slug: 'components',
    image: '/images/menu-components.avif',
    children: [],
  },
  {
    id: 'cables',
    name: 'Cables',
    slug: 'cables',
    image: '/images/menu-cables.avif',
    children: [],
  },
]

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

export function MegaMenuHeader({ megaMenuColumns, featuredProducts = [] }: MegaMenuHeaderProps) {
  const columns = megaMenuColumns && megaMenuColumns.length > 0 ? megaMenuColumns : FALLBACK_COLUMNS

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [activeCol, setActiveCol] = useState<string | null>(null)
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<FeaturedProduct[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    setMobileMenuOpen(false)
    setMegaMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen || searchOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen, searchOpen])

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus()
  }, [searchOpen])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const headerSolid = scrolled || megaMenuOpen || mobileMenuOpen

  const openMegaMenu = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    setMegaMenuOpen(true)
  }
  const scheduleMegaMenuClose = () => {
    closeTimerRef.current = setTimeout(() => setMegaMenuOpen(false), 200)
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

  return (
    <>
      {/*  HEADER BAR  */}
      <header
        className={`fixed top-0 z-50 w-full border-b transition-colors duration-300 ${headerSolid ? 'bg-black border-white/[0.08]' : 'bg-transparent border-transparent'}`}
      >
        <div className="mx-auto flex h-[64px] max-w-[1800px] items-center justify-between px-6 lg:px-12">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.svg"
              alt="ROEX"
              width={96}
              height={34}
              priority
              className="h-[28px] w-auto"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </Link>

          {/* Desktop Nav — centred */}
          <nav className="hidden lg:flex items-center gap-0">
            {NAV_LINKS.map((item) =>
              item.megaMenu ? (
                <button
                  key={item.id}
                  onMouseEnter={openMegaMenu}
                  onMouseLeave={scheduleMegaMenuClose}
                  className={`relative flex items-center gap-1.5 px-5 h-[64px] text-[11px] font-grotesk font-medium tracking-[0.18em] uppercase transition-colors duration-150 ${
                    megaMenuOpen
                      ? 'text-white bg-white/[0.05]'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    className={`h-3 w-3 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>
              ) : (
                <Link
                  key={item.id}
                  href={item.href}
                  className="px-5 h-[64px] inline-flex items-center text-[11px] font-grotesk font-medium tracking-[0.18em] uppercase text-white/60 hover:text-white hover:bg-white/[0.03] transition-colors duration-150"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          {/* Desktop right actions */}
          <div className="hidden lg:flex items-center gap-0">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="flex items-center gap-2 px-4 h-[64px] text-white/50 hover:text-white hover:bg-white/[0.03] transition-colors duration-150"
            >
              <Search className="h-[17px] w-[17px]" />
              <span className="text-[11px] font-grotesk font-medium tracking-[0.18em] uppercase">
                Search
              </span>
            </button>
            <Link
              href="/contact"
              className="flex items-center px-6 h-[64px] text-[11px] font-grotesk font-semibold tracking-[0.18em] uppercase bg-white text-black hover:bg-white/90 transition-colors duration-150 border-l border-white/10"
            >
              Enquire
            </Link>
          </div>

          {/* Mobile actions */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="p-3 text-white/50 hover:text-white transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              className="p-3 text-white/50 hover:text-white transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/*  MEGA MENU PANEL  */}
        {megaMenuOpen && (
          <div
            className="absolute top-full left-0 w-full bg-black border-t border-white/[0.08] shadow-[0_8px_60px_rgba(0,0,0,0.8)] animate-[megaSlideDown_0.22s_ease-out_both]"
            onMouseEnter={cancelMegaMenuClose}
            onMouseLeave={scheduleMegaMenuClose}
          >
            <div className="mx-auto max-w-[1800px] px-10 lg:px-16">
              {/* ── 4-column row: 3 category images + 1 featured panel ── */}
              <div className="grid grid-cols-4 gap-8 py-10">
                {/* ── Category columns ── */}
                {columns.slice(0, 3).map((col, i) => (
                  <div
                    key={col.id}
                    className="flex flex-col"
                    style={{
                      animation: `menuCardIn 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 80}ms both`,
                    }}
                    onMouseEnter={() => setActiveCol(col.id)}
                    onMouseLeave={() => setActiveCol(null)}
                  >
                    {/* Portrait image — 3:4 ratio, compact card */}
                    <Link
                      href={`/products?category=${col.slug}`}
                      className="relative block overflow-hidden rounded-lg aspect-[3/4] max-h-[420px]"
                    >
                      <Image
                        src={col.image || '/images/menu-speakers.avif'}
                        alt={col.name}
                        fill
                        sizes="(max-width: 1400px) 20vw, 280px"
                        loading="eager"
                        className={`object-cover object-center transition-transform duration-700 ease-out ${
                          activeCol === col.id ? 'scale-[1.05]' : 'scale-100'
                        }`}
                      />
                      {/* Deep bottom gradient for readable label */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                      {/* Hover overlay */}
                      <div
                        className={`absolute inset-0 bg-black/15 transition-opacity duration-300 ${
                          activeCol === col.id ? 'opacity-100' : 'opacity-0'
                        }`}
                      />

                      {/* Category label */}
                      <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-5 pt-12">
                        <p className="text-[7px] font-grotesk font-medium tracking-[0.35em] uppercase text-white/45 mb-2">
                          Shop
                        </p>
                        <h3 className="text-[18px] font-grotesk font-medium text-white leading-tight tracking-tight">
                          {col.name}
                        </h3>
                      </div>

                      {/* Arrow */}
                      <div
                        className={`absolute top-4 right-4 z-10 transition-all duration-300 ${
                          activeCol === col.id
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 -translate-x-2'
                        }`}
                      >
                        <ArrowRight className="h-3.5 w-3.5 text-white" />
                      </div>
                    </Link>

                    {/* Subcategory links */}
                    {col.children.length > 0 ? (
                      <div className="pt-4 pb-2 flex flex-wrap gap-x-5 gap-y-2">
                        {col.children.map((child) => (
                          <Link
                            key={child.id}
                            href={`/products?category=${child.slug}`}
                            className="text-[10px] font-grotesk font-medium tracking-[0.14em] uppercase text-white/35 hover:text-white transition-colors duration-150 flex items-center gap-1.5 group/sub"
                          >
                            <span className="w-2.5 h-px bg-white/20 group-hover/sub:bg-white/60 transition-colors duration-150 flex-shrink-0" />
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="pt-4 pb-2">
                        <Link
                          href={`/products?category=${col.slug}`}
                          className="text-[10px] font-grotesk font-medium tracking-[0.14em] uppercase text-white/30 hover:text-white transition-colors duration-150 flex items-center gap-1.5"
                        >
                          <span className="w-2.5 h-px bg-white/20 flex-shrink-0" />
                          View all
                        </Link>
                      </div>
                    )}
                  </div>
                ))}

                {/* ── Featured products column ── */}
                <div
                  className="flex flex-col pl-6 border-l border-white/[0.08]"
                  style={{ animation: 'menuCardIn 0.6s cubic-bezier(0.22,1,0.36,1) 240ms both' }}
                >
                  <div className="pt-4 pb-3 border-b border-white/[0.06]">
                    <p className="text-[8px] font-grotesk font-semibold tracking-[0.35em] uppercase text-white/30">
                      Featured
                    </p>
                  </div>

                  <div className="flex-1 flex flex-col divide-y divide-white/[0.05] py-2">
                    {featuredProducts.length > 0 ? (
                      featuredProducts.slice(0, 4).map((p) => (
                        <Link
                          key={p.id}
                          href={`/products/${p.slug}`}
                          className="flex gap-3 items-center py-3 hover:bg-white/[0.04] transition-colors duration-150 group/feat"
                        >
                          <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden bg-white/[0.05]">
                            <Image
                              src={p.image}
                              alt={p.name}
                              fill
                              sizes="56px"
                              loading="eager"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[12px] font-grotesk font-medium text-white/60 group-hover/feat:text-white transition-colors duration-150 line-clamp-2 leading-snug">
                              {p.name}
                            </p>
                            <p
                              className={`text-[9px] font-grotesk uppercase tracking-[0.12em] mt-1 ${
                                p.availability === 'available' ? 'text-white/30' : 'text-white/20'
                              }`}
                            >
                              {p.availability === 'available' ? 'Available' : 'Sold Out'}
                            </p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="py-3">
                        <p className="text-[12px] font-grotesk text-white/25">
                          No featured products
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="py-4 mt-auto">
                    <Link
                      href="/products"
                      className="flex items-center justify-between w-full px-4 py-2.5 bg-white text-black text-[10px] font-grotesk font-semibold tracking-[0.2em] uppercase hover:bg-white/90 transition-colors duration-150"
                    >
                      All Products <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/*  SEARCH OVERLAY  */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col animate-[megaSlideDown_0.18s_ease-out_both]">
          <div className="flex items-center border-b border-white/[0.08] px-6 lg:px-12 h-[64px]">
            <Search className="h-4 w-4 text-white/25 flex-shrink-0 mr-4" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder="Search products"
              className="flex-1 bg-transparent text-white placeholder-white/20 focus:outline-none text-base font-grotesk tracking-wide"
            />
            <button
              onClick={() => {
                setSearchOpen(false)
                setSearchQuery('')
                setSearchResults([])
              }}
              className="p-2 text-white/30 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 lg:px-12 py-10 max-w-[1800px] mx-auto w-full">
            {searchLoading && (
              <p className="text-white/25 text-[11px] font-grotesk tracking-[0.25em] uppercase">
                Searching
              </p>
            )}
            {!searchLoading && searchQuery && searchResults.length === 0 && (
              <p className="text-white/30 text-sm font-grotesk">
                No results for &ldquo;{searchQuery}&rdquo;
              </p>
            )}
            {searchResults.length > 0 && (
              <ul className="space-y-1 max-w-xl">
                {searchResults.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/products/${p.slug}`}
                      onClick={() => {
                        setSearchOpen(false)
                        setSearchQuery('')
                        setSearchResults([])
                      }}
                      className="flex gap-4 items-center p-3 hover:bg-white/[0.04] transition-colors group"
                    >
                      <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden bg-white/[0.06]">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-white text-[13px] font-grotesk font-medium group-hover:text-white/70 transition-colors">
                          {p.name}
                        </p>
                        <p className="text-white/30 text-[10px] font-grotesk uppercase tracking-[0.15em] mt-1 capitalize">
                          {p.category}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {!searchQuery && (
              <div>
                <p className="text-[9px] font-grotesk font-medium tracking-[0.3em] uppercase text-white/20 mb-5">
                  Browse Categories
                </p>
                <div className="flex flex-wrap gap-0">
                  {columns.map((col) => (
                    <Link
                      key={col.id}
                      href={`/products?category=${col.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="px-5 py-2.5 border border-white/10 text-[11px] font-grotesk font-medium tracking-[0.15em] uppercase text-white/40 hover:text-white hover:border-white/30 hover:bg-white/[0.03] transition-all duration-150 mr-2 mb-2"
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
        <div className="fixed inset-0 z-[60] bg-black flex flex-col lg:hidden animate-[megaSlideDown_0.2s_ease-out_both]">
          <div className="flex items-center justify-between px-4 h-[64px] border-b border-white/[0.08]">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <Image
                src="/logo.svg"
                alt="ROEX"
                width={90}
                height={32}
                className="h-7 w-auto"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="p-3 text-white/40 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto">
            <div>
              <button
                onClick={() => setMobileProductsOpen((v) => !v)}
                className="flex w-full items-center justify-between px-6 py-4 text-[11px] font-grotesk font-medium tracking-[0.2em] uppercase text-white border-b border-white/[0.08]"
              >
                Products
                <ChevronDown
                  className={`h-4 w-4 text-white/30 transition-transform duration-200 ${mobileProductsOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {mobileProductsOpen && (
                <div className="border-b border-white/[0.08]">
                  {columns.map((col) => (
                    <div key={col.id} className="border-b border-white/[0.05] last:border-0">
                      <Link
                        href={`/products?category=${col.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-8 py-3 text-[11px] font-grotesk font-semibold tracking-[0.15em] uppercase text-white/60 hover:text-white hover:bg-white/[0.03] transition-colors"
                      >
                        {col.name}
                      </Link>
                      {col.children.map((child) => (
                        <Link
                          key={child.id}
                          href={`/products?category=${child.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-10 py-2.5 text-[11px] font-grotesk tracking-[0.12em] uppercase text-white/30 hover:text-white/60 transition-colors"
                        >
                          <span className="w-3 h-px bg-white/20" />
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
                className="flex items-center justify-between px-6 py-4 text-[11px] font-grotesk font-medium tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors border-b border-white/[0.08]"
              >
                {item.label}
                <ArrowRight className="h-3.5 w-3.5 opacity-20" />
              </Link>
            ))}
          </nav>

          <div className="border-t border-white/[0.08] p-4">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-white text-black text-[10px] font-grotesk font-semibold tracking-[0.25em] uppercase hover:bg-white/90 transition-colors"
            >
              Contact Us <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

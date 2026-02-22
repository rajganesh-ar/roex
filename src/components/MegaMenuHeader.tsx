'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, ChevronDown, ArrowRight } from 'lucide-react'

/* ─── Types ─── */
interface MenuItem {
  id: string
  label: string
  link?: string
  megaMenu?: boolean
  columns?: Array<{
    title?: string
    links: Array<{
      label: string
      url: string
      description?: string
      image?: { url: string; filename: string }
    }>
  }>
  simpleDropdown?: Array<{
    label: string
    url: string
  }>
  featured?: {
    title?: string
    image?: { url: string; filename: string }
    link?: string
  }
}

interface Category {
  id: string
  name: string
  slug: string
  image: string | null
  parentId: string | null
  parentName: string | null
}

interface FeaturedProduct {
  id: string
  name: string
  slug: string
  availability: 'available' | 'unavailable'
  image: string
  category: string
}

/* ─── Default Nav ─── */
const defaultNav: MenuItem[] = [
  {
    id: 'products',
    label: 'Products',
    megaMenu: true,
  },
  { id: 'solutions', label: 'Solutions', link: '/solutions' },
  { id: 'about', label: 'About', link: '/about' },
  { id: 'blog', label: 'Blog', link: '/blog' },
  { id: 'contact', label: 'Contact', link: '/contact' },
]

/* ─── Image map: slug/keyword → unique image ─── */
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
  if (slug && categoryImageMap[slug]) return categoryImageMap[slug]
  if (slug) {
    const sortedKeys = Object.keys(categoryImageMap).sort((a, b) => b.length - a.length)
    const match = sortedKeys.find((k) => slug.includes(k))
    if (match) return categoryImageMap[match]
  }
  const nameLower = name.toLowerCase()
  const sortedKeys = Object.keys(categoryImageMap).sort((a, b) => b.length - a.length)
  const nameMatch = sortedKeys.find((k) => nameLower.includes(k.replace(/-/g, ' ')))
  if (nameMatch) return categoryImageMap[nameMatch]
  return '/images/menu-speakers.avif'
}

/* ─── Default Categories (fallback when CMS data is unavailable) ─── */
const defaultCategories: Category[] = [
  {
    id: 'speakers',
    name: 'Speakers',
    slug: 'speakers',
    image: '/images/menu-speakers.avif',
    parentId: null,
    parentName: null,
  },
  {
    id: 'cabled-speakers',
    name: 'Cabled Speakers',
    slug: 'cabled-speakers',
    image: '/images/category-card-cabledspeakers.avif',
    parentId: 'speakers',
    parentName: 'Speakers',
  },
  {
    id: 'wireless-smart-speakers',
    name: 'Wireless Smart Speakers',
    slug: 'wireless-smart-speakers',
    image: '/images/category-card-wirelesspeakers.avif',
    parentId: 'speakers',
    parentName: 'Speakers',
  },
  {
    id: 'ceiling-speakers',
    name: 'Ceiling Speakers',
    slug: 'ceiling-speakers',
    image: '/images/category-card-speaker.avif',
    parentId: null,
    parentName: null,
  },
  {
    id: 'track-speakers',
    name: 'Track Speakers',
    slug: 'track-speakers',
    image: '/images/category-card-cable.avif',
    parentId: null,
    parentName: null,
  },
  {
    id: 'pendant-speakers',
    name: 'Pendant Speakers',
    slug: 'pendant-speakers',
    image: '/images/category-card-components.avif',
    parentId: null,
    parentName: null,
  },
  {
    id: 'smart-audio',
    name: 'Smart Audio',
    slug: 'smart-audio',
    image: '/images/SMARTAudio-App-retuschiert.avif',
    parentId: null,
    parentName: null,
  },
]

interface MegaMenuHeaderProps {
  initialMenuItems?: any[]
  initialCategories?: Category[]
  initialFeaturedProducts?: FeaturedProduct[]
}

export function MegaMenuHeader({
  initialMenuItems = [],
  initialCategories = [],
  initialFeaturedProducts = [],
}: MegaMenuHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<FeaturedProduct[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>(
    initialCategories.length > 0 ? initialCategories : defaultCategories,
  )
  const [featuredProducts, setFeaturedProducts] =
    useState<FeaturedProduct[]>(initialFeaturedProducts)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [mobileExpandedItem, setMobileExpandedItem] = useState<string | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false)
    setActiveMenu(null)
  }, [pathname])

  // Lock body scroll when mobile menu or search is open
  useEffect(() => {
    if (mobileMenuOpen || searchOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen, searchOpen])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Menu/categories/featured products are now passed from the server.
  // No client-side fetches needed — data is available immediately.

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus()
  }, [searchOpen])

  // Live search
  const handleSearchInput = useCallback((value: string) => {
    setSearchQuery(value)
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    if (!value.trim()) {
      setSearchResults([])
      return
    }
    setSearchLoading(true)
    searchTimeoutRef.current = setTimeout(async () => {
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

  const navItems = menuItems.length > 0 ? menuItems : defaultNav
  const isAnyMegaMenuActive = activeMenu && navItems.find((n) => n.id === activeMenu)?.megaMenu

  // Build parent/child category hierarchy
  const parentCategories = categories.filter((c) => !c.parentId)
  const getChildren = (parentId: string) => categories.filter((c) => c.parentId === parentId)

  const handleMouseEnter = (id: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveMenu(id)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null)
    }, 200)
  }

  const handleMegaMenuMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  // Navbar: transparent at top, solid black on scroll OR when mega menu is open
  const navSolid = scrolled || isAnyMegaMenuActive
  const textColor = 'text-white hover:text-white/70'

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          navSolid
            ? 'bg-black/95 backdrop-blur-md shadow-[0_2px_30px_rgba(0,0,0,0.3)]'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-[1800px] px-6 lg:px-12">
          <div className="flex h-[72px] items-center">
            {/* Left: Logo */}
            <Link href="/" className="flex items-center shrink-0 mr-8">
              <img src="/logo.svg" alt="ROEX" className="h-7 w-auto transition-all duration-500" />
            </Link>

            {/* Mobile menu toggle */}
            <div className="flex items-center lg:hidden ml-auto">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1 transition-colors text-white"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Center: Navigation (desktop) */}
            <nav className="hidden lg:flex items-center justify-center gap-10 flex-1">
              {navItems.map((item, index) => (
                <div
                  key={item.id}
                  className="relative"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onMouseEnter={() => handleMouseEnter(item.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  {item.link && !item.megaMenu && !item.simpleDropdown ? (
                    <Link
                      href={item.link}
                      className={`relative text-[12px] uppercase tracking-[0.2em] font-medium font-grotesk transition-all duration-300 py-1 ${textColor} after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[1.5px] after:bg-white after:transition-all after:duration-500 after:ease-[cubic-bezier(0.22,1,0.36,1)] hover:after:w-full ${pathname === item.link ? 'text-white after:w-full' : ''}`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      className={`relative flex items-center gap-1.5 text-[12px] uppercase tracking-[0.2em] font-medium font-grotesk transition-all duration-300 py-1 ${textColor} ${activeMenu === item.id ? 'text-white' : ''}`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-3 w-3 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${activeMenu === item.id ? 'rotate-180' : ''}`}
                      />
                    </button>
                  )}
                </div>
              ))}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-5">
              <button
                onClick={() => {
                  setSearchOpen(true)
                  setSearchQuery('')
                  setSearchResults([])
                }}
                className={`hidden sm:block p-1 transition-all duration-300 ${textColor}`}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ═══════════════ FULL-WIDTH MEGA MENU DROPDOWN ═══════════════ */}
        {navItems.map(
          (item) =>
            activeMenu === item.id &&
            item.megaMenu && (
              <div
                key={`mega-${item.id}`}
                className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-40 animate-[megaSlideDown_0.35s_cubic-bezier(0.22,1,0.36,1)_forwards]"
                onMouseEnter={handleMegaMenuMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="mx-auto max-w-[1400px] px-8 py-8">
                  <div className="grid grid-cols-4 gap-5">
                    {/* ── Columns 1-3: Categories with tall image cards + hover subcategories ── */}
                    {(parentCategories.length > 0 ? parentCategories : categories)
                      .slice(0, 3)
                      .map((cat, idx) => {
                        const children = getChildren(cat.id)
                        const isHovered = hoveredCategory === cat.id
                        return (
                          <div
                            key={cat.id}
                            className="animate-[megaFadeUp_0.4s_cubic-bezier(0.22,1,0.36,1)_forwards] opacity-0"
                            style={{ animationDelay: `${idx * 80}ms` }}
                            onMouseEnter={() => setHoveredCategory(cat.id)}
                            onMouseLeave={() => setHoveredCategory(null)}
                          >
                            {/* Tall image card */}
                            <Link
                              href={`/shop?category=${cat.slug}`}
                              className="block relative w-full aspect-[3/4] rounded-lg overflow-hidden group/card"
                            >
                              <Image
                                src={cat.image ?? getCategoryImage(cat.name, cat.slug)}
                                alt={cat.name}
                                fill
                                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-110"
                                sizes="(max-width: 1400px) 25vw, 320px"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500" />

                              {/* Category name */}
                              <div className="absolute bottom-0 left-0 right-0 p-5">
                                <p className="text-white text-[13px] font-bold uppercase tracking-[0.15em]">
                                  {cat.name}
                                </p>
                                <span className="text-white/40 text-[10px] tracking-wider mt-1 flex items-center gap-1 group-hover/card:text-white/70 transition-colors duration-300">
                                  Explore{' '}
                                  <ArrowRight className="h-2.5 w-2.5 transition-transform duration-300 group-hover/card:translate-x-1" />
                                </span>
                              </div>

                              {/* Subcategories overlay on hover */}
                              {children.length > 0 && (
                                <div
                                  className={`absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col justify-end p-5 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                    isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
                                  }`}
                                >
                                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/50 font-semibold mb-3">
                                    {cat.name}
                                  </p>
                                  <ul className="space-y-2">
                                    {children.map((child, ci) => (
                                      <li
                                        key={child.id}
                                        className={`transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
                                        style={{
                                          transitionDelay: isHovered ? `${ci * 60 + 100}ms` : '0ms',
                                        }}
                                      >
                                        <Link
                                          href={`/shop?category=${child.slug}`}
                                          className="text-[13px] text-white/70 hover:text-white transition-colors duration-200 flex items-center gap-2"
                                        >
                                          <span className="w-3 h-[1px] bg-white/30" />
                                          {child.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </Link>
                          </div>
                        )
                      })}

                    {/* ── 4th column: Featured Products ── */}
                    {featuredProducts.length > 0 && (
                      <div
                        className="animate-[megaFadeUp_0.4s_cubic-bezier(0.22,1,0.36,1)_forwards] opacity-0"
                        style={{ animationDelay: '240ms' }}
                      >
                        <div className="mb-5">
                          <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">
                            Featured
                          </h4>
                          <div className="w-8 h-[1px] bg-white/10 mt-2.5" />
                        </div>
                        <div className="space-y-4">
                          {featuredProducts.slice(0, 4).map((product, pi) => (
                            <Link
                              key={product.id}
                              href={`/products/${product.slug}`}
                              className="flex items-center gap-3.5 group/fp animate-[megaFadeUp_0.3s_cubic-bezier(0.22,1,0.36,1)_forwards] opacity-0"
                              style={{ animationDelay: `${pi * 70 + 300}ms` }}
                            >
                              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-white/5 shrink-0 ring-1 ring-white/10">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover group-hover/fp:scale-110 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                                  sizes="56px"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[12px] text-white/80 group-hover/fp:text-white transition-colors duration-200 font-semibold truncate">
                                  {product.name}
                                </p>
                                <p className="text-[10px] text-white/30 mt-0.5 uppercase tracking-wider">
                                  {product.category}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>

                        {/* Remaining categories as text list */}
                        {(parentCategories.length > 0 ? parentCategories : categories).length >
                          3 && (
                          <div className="mt-6 pt-5 border-t border-white/10">
                            <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold mb-3">
                              More Categories
                            </h4>
                            <ul className="space-y-2">
                              {(parentCategories.length > 0 ? parentCategories : categories)
                                .slice(3)
                                .map((cat) => (
                                  <li key={cat.id}>
                                    <Link
                                      href={`/shop?category=${cat.slug}`}
                                      className="text-[12px] text-white/40 hover:text-white transition-colors duration-200"
                                    >
                                      {cat.name}
                                    </Link>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}

                        <Link
                          href="/shop"
                          className="mt-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold hover:text-white hover:gap-3 transition-all duration-400"
                        >
                          View All Products <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ),
        )}

        {/* Simple dropdown for non-megamenu items */}
        {navItems.map(
          (item) =>
            activeMenu === item.id &&
            !item.megaMenu &&
            item.simpleDropdown && (
              <div
                key={`dropdown-${item.id}`}
                className="absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-lg z-40 animate-fade-in"
                onMouseEnter={handleMegaMenuMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ animationDuration: '250ms' }}
              >
                <div className="mx-auto max-w-[1800px] px-8 lg:px-16 py-6">
                  <div className="flex gap-10">
                    {item.simpleDropdown.map((link, li) => (
                      <Link
                        key={li}
                        href={link.url}
                        className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200 font-light"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ),
        )}
      </header>

      {/* ═══════════════ SEARCH OVERLAY ═══════════════ */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-white" onClick={() => setSearchOpen(false)}>
          <div className="w-full h-full flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Search header */}
            <div className="border-b border-gray-200">
              <div className="max-w-[1800px] mx-auto px-6 lg:px-12 flex items-center h-[72px] gap-4">
                <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  placeholder="What are you looking for?"
                  className="flex-1 text-xl font-light text-gray-900 placeholder-gray-400 bg-transparent outline-none font-montserrat"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setSearchOpen(false)
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      setSearchOpen(false)
                      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`
                    }
                  }}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-2 text-gray-500 hover:text-black transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Search results */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-10">
                {!searchQuery && (
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-gray-400 mb-6">
                      Popular Searches
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {['Speakers', 'Headphones', 'Cables', 'Amplifiers', 'DAC'].map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSearchInput(term)}
                          className="px-5 py-2.5 border border-gray-200 text-[13px] text-gray-700 hover:border-black hover:text-black transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>

                    {featuredProducts.length > 0 && (
                      <div className="mt-12">
                        <p className="text-[11px] uppercase tracking-[0.3em] text-gray-400 mb-6">
                          Trending Products
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          {featuredProducts.map((product) => (
                            <Link
                              key={product.id}
                              href={`/products/${product.slug}`}
                              className="group block"
                              onClick={() => setSearchOpen(false)}
                            >
                              <div className="relative aspect-square bg-gray-100 overflow-hidden mb-3">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                                />
                              </div>
                              <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400">
                                {product.category}
                              </p>
                              <h4 className="font-montserrat text-sm font-light text-gray-900 mt-1">
                                {product.name}
                              </h4>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {searchQuery && searchLoading && (
                  <div className="flex items-center justify-center py-16">
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
                  </div>
                )}

                {searchQuery && !searchLoading && searchResults.length === 0 && (
                  <div className="text-center py-16">
                    <p className="font-montserrat text-2xl font-light text-gray-900 mb-2">
                      No results found
                    </p>
                    <p className="text-sm text-gray-500 font-light">Try a different search term</p>
                  </div>
                )}

                {searchQuery && !searchLoading && searchResults.length > 0 && (
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-gray-400 mb-6">
                      {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for
                      &ldquo;{searchQuery}&rdquo;
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          className="group block"
                          onClick={() => setSearchOpen(false)}
                        >
                          <div className="relative aspect-square bg-gray-100 overflow-hidden mb-3">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                            />
                          </div>
                          <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400">
                            {product.category}
                          </p>
                          <h4 className="font-montserrat text-sm font-light text-gray-900 mt-1">
                            {product.name}
                          </h4>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-8 text-center">
                      <Link
                        href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                        onClick={() => setSearchOpen(false)}
                        className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.15em] text-gray-900 border-b border-gray-900 pb-0.5 hover:text-gray-600 hover:border-gray-600 transition-colors"
                      >
                        View all results <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ MOBILE MENU ═══════════════ */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[55] bg-[#1a1a1a] lg:hidden">
          {/* Mobile header */}
          <div className="flex h-[72px] items-center justify-between px-6 border-b border-white/10">
            <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-white">
              <X className="h-6 w-6" />
            </button>
            <Link
              href="/"
              className="flex items-center gap-2.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img src="/logo.svg" alt="ROEX" className="h-7 w-auto" />
            </Link>
            <div className="w-8" />
          </div>

          {/* Mobile search bar */}
          <div className="px-6 py-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 bg-white/5 text-sm text-white placeholder-white/40 outline-none focus:bg-white/10 transition-colors border border-white/10"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    setMobileMenuOpen(false)
                    window.location.href = `/shop?search=${encodeURIComponent(e.currentTarget.value)}`
                  }
                }}
              />
            </div>
          </div>

          {/* Mobile nav */}
          <nav className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 144px)' }}>
            <div className="px-6 py-2">
              {navItems.map((item) => (
                <div key={item.id} className="border-b border-white/10">
                  {item.megaMenu ? (
                    <>
                      <button
                        onClick={() =>
                          setMobileExpandedItem(mobileExpandedItem === item.id ? null : item.id)
                        }
                        className="w-full flex items-center justify-between py-5"
                      >
                        <span className="text-[14px] uppercase tracking-[0.2em] text-white font-light">
                          {item.label}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 text-white/40 transition-transform duration-300 ${mobileExpandedItem === item.id ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {/* Expanded categories */}
                      {mobileExpandedItem === item.id && (
                        <div
                          className="pb-4 animate-fade-in"
                          style={{ animationDuration: '200ms' }}
                        >
                          {parentCategories.map((parent) => {
                            const children = getChildren(parent.id)
                            return (
                              <div key={parent.id} className="mb-4">
                                <Link
                                  href={`/shop?category=${parent.slug}`}
                                  className="block text-[12px] font-medium uppercase tracking-[0.15em] text-white/70 mb-2 pl-4"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {parent.name}
                                </Link>
                                {children.length > 0 && (
                                  <div className="pl-8 space-y-2">
                                    {children.map((child) => (
                                      <Link
                                        key={child.id}
                                        href={`/shop?category=${child.slug}`}
                                        className="block text-[13px] text-white/40 py-1"
                                        onClick={() => setMobileMenuOpen(false)}
                                      >
                                        {child.name}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </>
                  ) : item.simpleDropdown ? (
                    <>
                      <button
                        onClick={() =>
                          setMobileExpandedItem(mobileExpandedItem === item.id ? null : item.id)
                        }
                        className="w-full flex items-center justify-between py-5"
                      >
                        <span className="text-[14px] uppercase tracking-[0.2em] text-white font-light">
                          {item.label}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 text-white/40 transition-transform duration-300 ${mobileExpandedItem === item.id ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {mobileExpandedItem === item.id && (
                        <div
                          className="pb-4 pl-4 space-y-3 animate-fade-in"
                          style={{ animationDuration: '200ms' }}
                        >
                          {item.simpleDropdown.map((link, i) => (
                            <Link
                              key={i}
                              href={link.url}
                              className="block text-[13px] text-white/40"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.link || '#'}
                      className="block py-5 text-[14px] uppercase tracking-[0.2em] text-white font-light"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile bottom CTAs */}
            <div className="px-6 pt-6 pb-10 space-y-3">
              <Link
                href="/shop"
                className="block w-full bg-white text-black text-center py-4 text-[12px] uppercase tracking-[0.2em] font-medium font-grotesk"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop All Products
              </Link>
              <Link
                href="/contact"
                className="block w-full border border-white/20 text-white text-center py-4 text-[12px] uppercase tracking-[0.2em] font-light font-grotesk"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}

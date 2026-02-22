'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { ProductCard } from '@/components/ProductCard'
import { AnimatedSection } from '@/components/AnimatedSection'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronRight,
  Grid3X3,
  LayoutList,
  ArrowRight,
  Package,
} from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  parentId: string | null
  parentName: string | null
  count: number
}

interface Product {
  id: string
  name: string
  slug: string
  category: string
  categoryId: string
  image: string
  availability: 'available' | 'unavailable'
  featured: boolean
}

interface ShopPageClientProps {
  initialCategories: Category[]
  initialProducts: Product[]
}

export default function ShopPageClient({
  initialCategories,
  initialProducts,
}: ShopPageClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialCategory = searchParams.get('category') || ''
  const initialSearch = searchParams.get('search') || ''
  const initialSort = searchParams.get('sortBy') || 'featured'

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : [],
  )
  const [sortBy, setSortBy] = useState(initialSort)
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)

  const [categories] = useState<Category[]>(initialCategories)
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [loading, setLoading] = useState(false)
  const [visibleCount, setVisibleCount] = useState(12)
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    availability: true,
  })
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({})
  const [filtersChanged, setFiltersChanged] = useState(() => !!(initialCategory || initialSearch))

  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const heroParallax = useTransform(scrollY, [0, 600], [0, 80])

  const parentCategories = categories.filter((c) => !c.parentId)
  const getChildren = (parentId: string) => categories.filter((c) => c.parentId === parentId)

  useEffect(() => {
    if (!filtersChanged) return
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (searchQuery) params.append('search', searchQuery)
        if (selectedCategories.length > 0) params.append('categories', selectedCategories.join(','))
        if (sortBy) params.append('sortBy', sortBy)
        if (showAvailableOnly) params.append('availability', 'available')
        const response = await fetch(`/api/shop-products?${params.toString()}`)
        if (response.ok) {
          const data = await response.json()
          setProducts(data.products || [])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    const timeout = setTimeout(fetchProducts, searchQuery ? 400 : 0)
    return () => clearTimeout(timeout)
  }, [searchQuery, selectedCategories, sortBy, showAvailableOnly, filtersChanged])

  useEffect(() => {
    setVisibleCount(12)
  }, [searchQuery, selectedCategories, sortBy])

  const handleCategoryToggle = (id: string) => {
    setFiltersChanged(true)
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    )
  }

  const toggleParentExpanded = (parentId: string) => {
    setExpandedParents((prev) => ({ ...prev, [parentId]: !prev[parentId] }))
  }

  const clearFilters = () => {
    setFiltersChanged(true)
    setSelectedCategories([])
    setSearchQuery('')
    setShowAvailableOnly(false)
  }

  const toggleSection = (key: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSearchChange = (val: string) => {
    setFiltersChanged(true)
    setSearchQuery(val)
  }
  const handleSortChange = (val: string) => {
    setFiltersChanged(true)
    setSortBy(val)
  }
  const handleAvailabilityToggle = () => {
    setFiltersChanged(true)
    setShowAvailableOnly(!showAvailableOnly)
  }

  const activeFilters =
    selectedCategories.length + (searchQuery ? 1 : 0) + (showAvailableOnly ? 1 : 0)

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'name', label: 'Alphabetical' },
    { value: 'newest', label: 'Newest Arrivals' },
  ]

  const visibleProducts = products.slice(0, visibleCount)
  const hasMore = visibleCount < products.length

  const activeCategory =
    selectedCategories.length === 1
      ? categories.find((c) => c.slug === selectedCategories[0])
      : null

  const totalProducts = products.length

  const FilterBlock = ({
    title,
    sectionKey,
    children,
  }: {
    title: string
    sectionKey: keyof typeof expandedSections
    children: React.ReactNode
  }) => (
    <div className="border-b border-gray-100 pb-5 mb-5 last:border-b-0 last:pb-0 last:mb-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left mb-4"
      >
        <h4 className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-medium font-grotesk">
          {title}
        </h4>
        <ChevronDown
          className={`h-3 w-3 text-gray-300 transition-transform duration-200 ${expandedSections[sectionKey] ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {expandedSections[sectionKey] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  const FilterContent = () => (
    <>
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search products..."
            className="w-full border-b border-gray-200 pl-6 pr-6 py-2.5 text-[13px] text-gray-900 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-900 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <FilterBlock title="Categories" sectionKey="categories">
        <div className="space-y-0.5">
          {parentCategories.map((parent) => {
            const children = getChildren(parent.id)
            const isExpanded = expandedParents[parent.id] ?? true
            return (
              <div key={parent.id}>
                <div className="flex items-center">
                  {children.length > 0 && (
                    <button
                      onClick={() => toggleParentExpanded(parent.id)}
                      className="p-1 mr-0.5 text-gray-300 hover:text-gray-600 transition-colors"
                    >
                      <ChevronRight
                        className={`h-3 w-3 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    </button>
                  )}
                  <button
                    onClick={() => handleCategoryToggle(parent.slug)}
                    className={`flex-1 flex items-center justify-between px-2 py-2 text-left transition-all duration-200 border-l-2 ${
                      selectedCategories.includes(parent.slug)
                        ? 'border-gray-900 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-200'
                    }`}
                  >
                    <span className="text-[13px] font-light">{parent.name}</span>
                    <span className="text-[10px] text-gray-300 tabular-nums">{parent.count}</span>
                  </button>
                </div>
                {children.length > 0 && (
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden ml-6 space-y-0.5"
                      >
                        {children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => handleCategoryToggle(child.slug)}
                            className={`flex items-center justify-between w-full px-2 py-1.5 text-left transition-all duration-200 border-l-2 ${
                              selectedCategories.includes(child.slug)
                                ? 'border-gray-900 text-gray-900'
                                : 'border-transparent text-gray-400 hover:text-gray-900 hover:border-gray-200'
                            }`}
                          >
                            <span className="text-[12px] font-light">{child.name}</span>
                            <span className="text-[10px] text-gray-300 tabular-nums">
                              {child.count}
                            </span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            )
          })}
        </div>
      </FilterBlock>

      {/* Availability */}
      <FilterBlock title="Availability" sectionKey="availability">
        <button
          onClick={handleAvailabilityToggle}
          className={`flex items-center gap-3 w-full py-2 text-left transition-all duration-200 border-l-2 px-2 ${
            showAvailableOnly
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-200'
          }`}
        >
          <div
            className={`w-3.5 h-3.5 border flex items-center justify-center flex-shrink-0 transition-colors ${
              showAvailableOnly ? 'bg-gray-900 border-gray-900' : 'border-gray-300'
            }`}
          >
            {showAvailableOnly && (
              <svg
                className="w-2 h-2 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className="text-[13px] font-light">Available only</span>
        </button>
      </FilterBlock>

      {activeFilters > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
          <button
            onClick={clearFilters}
            className="w-full py-2.5 text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 border border-gray-200 hover:border-gray-900 transition-all duration-200"
          >
            Clear All ({activeFilters})
          </button>
        </motion.div>
      )}
    </>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative h-[40vh] sm:h-[48vh] min-h-[280px] flex items-end overflow-hidden"
      >
        <motion.div style={{ y: heroParallax }} className="absolute inset-0">
          <Image
            src="/images/hero-background-4.avif"
            alt="ROEX Products"
            fill
            className="object-cover scale-110"
            priority
            sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/25" />
        <div className="relative z-10 max-w-[1800px] mx-auto w-full px-6 lg:px-12 pb-12 sm:pb-16">
          <motion.nav
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40 mb-5"
          >
            <Link href="/" className="hover:text-white/70 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white/60">
              {activeCategory ? activeCategory.name : 'Products'}
            </span>
          </motion.nav>
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="w-8 h-px bg-white/30" />
              <p className="text-[10px] uppercase tracking-[0.35em] text-white/40 font-medium">
                360 Sound Systems
              </p>
            </div>
            <h1 className="font-montserrat text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-white tracking-tight leading-[1.0] drop-shadow-lg">
              {activeCategory ? activeCategory.name : 'Products'}
            </h1>
            <div className="flex items-center gap-5 mt-5">
              <div className="flex items-center gap-2">
                <Package className="h-3 w-3 text-white/30" />
                <span className="text-[10px] text-white/40 uppercase tracking-[0.2em]">
                  {totalProducts} Product{totalProducts !== 1 ? 's' : ''}
                </span>
              </div>
              <span className="w-px h-3 bg-white/20" />
              <span className="text-[10px] text-white/40 uppercase tracking-[0.2em]">
                Manufactured in Germany
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TOOLBAR */}
      <div className="border-b border-gray-100 sticky top-[72px] bg-white/95 backdrop-blur-lg z-30">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-5">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:flex items-center gap-2.5 text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors"
              >
                <div className="flex flex-col gap-[3px]">
                  <span
                    className={`block h-[1px] bg-current transition-all ${sidebarOpen ? 'w-3' : 'w-4'}`}
                  />
                  <span className="block w-4 h-[1px] bg-current" />
                  <span
                    className={`block h-[1px] bg-current transition-all ${sidebarOpen ? 'w-3' : 'w-4'}`}
                  />
                </div>
                {sidebarOpen ? 'Hide Filters' : 'Show Filters'}
                {activeFilters > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center bg-gray-900 text-white text-[8px] font-medium">
                    {activeFilters}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="lg:hidden flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filters
                {activeFilters > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center bg-gray-900 text-white text-[8px] font-medium">
                    {activeFilters}
                  </span>
                )}
              </button>

              <span className="hidden sm:block w-px h-4 bg-gray-200" />
              <span className="hidden sm:block text-[10px] text-gray-400 tabular-nums">
                {loading ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 border border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : (
                  `${totalProducts} product${totalProducts !== 1 ? 's' : ''}`
                )}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center border border-gray-200 divide-x divide-gray-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-all duration-200 ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-700'}`}
                  aria-label="Grid view"
                >
                  <Grid3X3 className="h-3 w-3" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-all duration-200 ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-700'}`}
                  aria-label="List view"
                >
                  <LayoutList className="h-3 w-3" />
                </button>
              </div>

              <div className="relative">
                <button
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-gray-500 hover:text-black border border-gray-200 px-4 py-2 transition-colors"
                >
                  <span className="hidden sm:inline text-gray-300">Sort:</span>
                  <span className="text-gray-700">
                    {sortOptions.find((o) => o.value === sortBy)?.label}
                  </span>
                  <ChevronDown
                    className={`h-3 w-3 text-gray-400 transition-transform duration-200 ${sortDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {sortDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setSortDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-1 z-20 bg-white border border-gray-100 shadow-xl min-w-[180px] py-1"
                      >
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              handleSortChange(option.value)
                              setSortDropdownOpen(false)
                            }}
                            className={`block w-full text-left px-5 py-3 text-[12px] transition-all duration-150 ${
                              sortBy === option.value
                                ? 'text-gray-900 bg-gray-50'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[85vw] max-w-[360px] bg-white z-50 lg:hidden shadow-2xl overflow-y-auto"
            >
              <div className="sticky top-0 bg-white z-10 px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-900">Filters</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="h-7 w-7 flex items-center justify-center border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-900 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="px-6 py-6">
                <FilterContent />
              </div>
              <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full bg-[#0a0a0a] text-white py-3.5 text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-colors"
                >
                  Show {totalProducts} Product{totalProducts !== 1 ? 's' : ''}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ACTIVE FILTER CHIPS */}
      <AnimatePresence>
        {activeFilters > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-gray-50 overflow-hidden"
          >
            <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-3 flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.15em] text-gray-300 mr-1">
                Active:
              </span>
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="flex items-center gap-1.5 px-3 py-1 bg-gray-900 text-white text-[10px] uppercase tracking-[0.1em] hover:bg-gray-700 transition-colors"
                >
                  &ldquo;{searchQuery}&rdquo; <X className="h-2.5 w-2.5" />
                </button>
              )}
              {selectedCategories.map((catId) => {
                const cat = categories.find((c) => c.slug === catId)
                return (
                  <button
                    key={catId}
                    onClick={() => handleCategoryToggle(catId)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-gray-900 text-white text-[10px] uppercase tracking-[0.1em] hover:bg-gray-700 transition-colors"
                  >
                    {cat?.name || catId} <X className="h-2.5 w-2.5" />
                  </button>
                )
              })}
              {showAvailableOnly && (
                <button
                  onClick={() => {
                    setFiltersChanged(true)
                    setShowAvailableOnly(false)
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 bg-gray-900 text-white text-[10px] uppercase tracking-[0.1em] hover:bg-gray-700 transition-colors"
                >
                  Available Only <X className="h-2.5 w-2.5" />
                </button>
              )}
              <button
                onClick={clearFilters}
                className="text-[10px] uppercase tracking-[0.1em] text-gray-400 hover:text-gray-900 ml-1 transition-colors underline underline-offset-2"
              >
                Clear all
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN: SIDEBAR + PRODUCTS */}
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-10 sm:py-14">
        <div className="flex gap-10 lg:gap-14">
          {/* Desktop Sidebar */}
          <aside
            className={`hidden lg:block shrink-0 transition-all duration-300 ease-out overflow-hidden ${sidebarOpen ? 'w-[240px] opacity-100' : 'w-0 opacity-0'}`}
          >
            <div className="w-[240px] sticky top-[130px] pt-2">
              <FilterContent />
            </div>
          </aside>

          {/* Products Area */}
          <div className="flex-1 min-w-0">
            {loading && (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 border border-gray-100" />
                  <div className="absolute inset-0 border border-gray-900 border-t-transparent animate-spin" />
                </div>
                <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-gray-400">
                  Loading...
                </p>
              </div>
            )}

            {!loading && products.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Search className="h-8 w-8 text-gray-200 mb-6" />
                <p className="font-montserrat text-xl sm:text-2xl font-light text-gray-900 mb-3">
                  No products found
                </p>
                <p className="text-[13px] text-gray-400 mb-8 font-light max-w-sm">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={clearFilters}
                  className="text-[11px] uppercase tracking-[0.2em] text-white bg-[#0a0a0a] px-8 py-3 hover:bg-black transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {!loading && visibleProducts.length > 0 && viewMode === 'grid' && (
              <motion.div
                layout
                className={`grid gap-x-4 gap-y-10 sm:gap-x-5 sm:gap-y-12 md:gap-x-6 md:gap-y-14 ${sidebarOpen ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}
              >
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </motion.div>
            )}

            {!loading && visibleProducts.length > 0 && viewMode === 'list' && (
              <div className="space-y-0">
                {visibleProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.04 }}
                  >
                    <div
                      onClick={() => router.push(`/products/${product.slug}`)}
                      className="group flex gap-6 sm:gap-8 py-6 border-b border-gray-100 first:border-t cursor-pointer"
                    >
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-[#f5f4f0] shrink-0 overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain p-3 transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-center min-w-0">
                        <h3 className="font-montserrat text-base sm:text-lg md:text-xl font-light text-gray-900 group-hover:text-gray-500 transition-colors">
                          {product.name}
                        </h3>
                        <Link
                          href={`/contact?product=${encodeURIComponent(product.name)}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 mt-3 text-[10px] uppercase tracking-[0.15em] text-gray-900 border-b border-gray-900 pb-0.5 w-fit"
                        >
                          Send Enquiry <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                      <div className="hidden sm:flex items-center">
                        <ArrowRight className="h-4 w-4 text-gray-200 group-hover:text-gray-600 transition-colors" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && hasMore && (
              <div className="text-center mt-14">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 12)}
                  className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-gray-900 border border-gray-200 px-10 py-4 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300"
                >
                  Load More
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="h-px w-10 bg-gray-200" />
                  <p className="text-[10px] text-gray-400 tabular-nums">
                    {visibleProducts.length} of {totalProducts}
                  </p>
                  <div className="h-px w-10 bg-gray-200" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM CTA */}
      {!loading && products.length > 0 && (
        <section className="relative overflow-hidden bg-[#f5f4f0] py-20 sm:py-24">
          <div className="relative max-w-[1800px] mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <AnimatedSection variant="fade-right">
                <div className="flex items-center gap-4 mb-5">
                  <span className="brand-bar" />
                  <p className="text-[10px] uppercase tracking-[0.35em] text-stone-400 font-medium font-grotesk">
                    Expert Advice
                  </p>
                </div>
                <h3 className="font-montserrat text-3xl sm:text-4xl font-light text-stone-900 tracking-tight">
                  Need help choosing
                  <br />
                  the right system?
                </h3>
              </AnimatedSection>
              <AnimatedSection variant="fade-left">
                <p className="text-[14px] text-stone-500 font-light leading-[1.85] mb-8">
                  Contact our specialists for personalised recommendations and custom sound
                  solutions tailored to your space.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2.5 h-12 px-10 bg-black text-white text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-black/80 transition-colors"
                >
                  Send Enquiry <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </AnimatedSection>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

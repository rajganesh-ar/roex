'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ProductCard } from '@/components/ProductCard'
import { EnquiryModal } from '@/components/EnquiryModal'
import { Mail, Share2, ArrowRight, Truck, Shield, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { AnimatedSection } from '@/components/AnimatedSection'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  longDescription: string
  images: string[]
  category: string
  categoryId: string
  availability: 'available' | 'unavailable'
  sku: string
  specifications: Array<{ label: string; value: string }>
}

interface RelatedProduct {
  id: string
  name: string
  slug: string
  image: string
  category: string
  availability: 'available' | 'unavailable'
}

interface ProductDetailClientProps {
  product: Product
  relatedProducts: RelatedProduct[]
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'shipping'>(
    'description',
  )
  const [showZoom, setShowZoom] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const [showStickyBar, setShowStickyBar] = useState(false)
  const [enquiryOpen, setEnquiryOpen] = useState(false)
  const enquiryRef = useRef<HTMLButtonElement>(null)

  const isAvailable = product.availability === 'available'

  useEffect(() => {
    const onScroll = () => {
      if (enquiryRef.current) {
        const rect = enquiryRef.current.getBoundingClientRect()
        setShowStickyBar(rect.bottom < 0)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleZoomMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* STICKY BAR */}
      <motion.div
        initial={false}
        animate={{ y: showStickyBar ? 0 : -100, opacity: showStickyBar ? 1 : 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm"
      >
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative w-9 h-9 bg-[#f5f4f0] shrink-0 overflow-hidden">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-contain p-1"
              />
            </div>
            <div className="min-w-0">
              <p className="font-montserrat text-[13px] font-light text-gray-900 truncate">
                {product.name}
              </p>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 ${isAvailable ? 'bg-emerald-500' : 'bg-amber-400'}`}
                />
                <span
                  className={`text-[10px] uppercase tracking-[0.1em] ${isAvailable ? 'text-emerald-600' : 'text-amber-500'}`}
                >
                  {isAvailable ? 'Available' : 'Coming Soon'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setEnquiryOpen(true)}
            className="shrink-0 bg-[#0a0a0a] text-white px-7 h-9 text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-colors font-medium inline-flex items-center gap-2"
          >
            <Mail className="h-3 w-3" />
            Send Enquiry
          </button>
        </div>
      </motion.div>

      {/* HERO */}
      <section className="relative h-[40vh] sm:h-[48vh] min-h-[280px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-background-4.avif"
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/25" />
        <div className="relative z-10 max-w-[1800px] mx-auto w-full px-6 lg:px-12 pb-12 sm:pb-16">
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/50 mb-4 flex-wrap"
          >
            <Link href="/" className="hover:text-white/80 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-white/80 transition-colors">
              Products
            </Link>
            {product.category && (
              <>
                <span>/</span>
                <Link
                  href={`/shop?category=${product.categoryId}`}
                  className="hover:text-white/80 transition-colors"
                >
                  {product.category}
                </Link>
              </>
            )}
          </motion.nav>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-6 h-px bg-white/30" />
              <p className="text-[10px] uppercase tracking-[0.35em] text-white/40 font-medium">
                {product.category || 'ROEX Audio'}
              </p>
            </div>
            <h1 className="font-montserrat text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight leading-[1.05] drop-shadow-lg">
              {product.name}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* PRODUCT SECTION */}
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-10 sm:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 xl:gap-28">
          {/* IMAGE GALLERY */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <div
              className="relative aspect-square bg-[#f5f4f0] overflow-hidden cursor-crosshair"
              onMouseEnter={() => setShowZoom(true)}
              onMouseLeave={() => setShowZoom(false)}
              onMouseMove={handleZoomMove}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-contain p-8"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </motion.div>
              </AnimatePresence>

              {showZoom && (
                <div
                  className="absolute inset-0 hidden md:block z-10"
                  style={{
                    backgroundImage: `url(${product.images[selectedImage]})`,
                    backgroundSize: '200%',
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  }}
                />
              )}

              <div className="absolute top-4 left-4 z-10">
                {isAvailable ? (
                  <span className="bg-[#0a0a0a] text-white px-3 py-1 text-[9px] uppercase tracking-[0.2em] font-medium">
                    Available
                  </span>
                ) : (
                  <span className="bg-amber-500 text-white px-3 py-1 text-[9px] uppercase tracking-[0.2em] font-medium">
                    Coming Soon
                  </span>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="absolute bottom-4 right-4 z-10 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 text-[9px] tracking-[0.1em]">
                  {selectedImage + 1} / {product.images.length}
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-[68px] h-[68px] sm:w-20 sm:h-20 shrink-0 overflow-hidden bg-[#f5f4f0] transition-all duration-300 ${
                      selectedImage === index
                        ? 'ring-2 ring-gray-900 ring-offset-1 opacity-100'
                        : 'opacity-40 hover:opacity-70'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}

            {product.images.length > 1 && (
              <div className="lg:hidden flex justify-center gap-1.5 pt-1">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`h-1.5 transition-all duration-300 ${selectedImage === i ? 'w-6 bg-gray-900' : 'w-1.5 bg-gray-300'}`}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* PRODUCT INFO */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <div className="space-y-7">
              <div>
                <Link
                  href={`/shop?category=${product.categoryId}`}
                  className="inline-block text-[10px] uppercase tracking-[0.35em] text-gray-400 hover:text-gray-900 transition-colors mb-3"
                >
                  {product.category}
                </Link>
                <h1 className="font-montserrat text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-light text-gray-900 leading-[1.15] tracking-tight">
                  {product.name}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`w-1.5 h-1.5 ${isAvailable ? 'bg-emerald-500' : 'bg-amber-400'}`}
                />
                <span
                  className={`text-[10px] uppercase tracking-[0.2em] font-medium ${isAvailable ? 'text-emerald-600' : 'text-amber-500'}`}
                >
                  {isAvailable ? 'Available' : 'Coming Soon'}
                </span>
              </div>

              <p className="text-[14px] sm:text-[15px] text-gray-500 font-light leading-[1.85] max-w-lg">
                {product.description}
              </p>

              <div className="h-px bg-gray-100" />

              <div>
                <button
                  ref={enquiryRef}
                  onClick={() => setEnquiryOpen(true)}
                  className="w-full h-14 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.2em] font-medium bg-[#0a0a0a] text-white hover:bg-black transition-colors duration-300 active:scale-[0.98]"
                >
                  <Mail className="h-4 w-4" />
                  Send Enquiry
                </button>
                <p className="text-center text-[11px] text-gray-400 mt-3 font-light">
                  Our team will respond within 24 hours
                </p>
              </div>

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: product.name, url: window.location.href })
                  } else {
                    navigator.clipboard.writeText(window.location.href)
                  }
                }}
                className="w-full h-11 flex items-center justify-center gap-2 border border-gray-200 text-gray-500 hover:border-gray-600 hover:text-gray-700 transition-all duration-300 text-[10px] uppercase tracking-[0.2em]"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share
              </button>

              <div className="bg-[#f5f4f0] p-5">
                <div className="grid grid-cols-3 divide-x divide-gray-200">
                  {[
                    { icon: Truck, label: 'Free Delivery', sub: '3-5 days' },
                    { icon: RotateCcw, label: '30-Day Returns', sub: 'Easy refunds' },
                    { icon: Shield, label: '5-Year Warranty', sub: 'Full coverage' },
                  ].map((item, i) => (
                    <div key={i} className="text-center px-3">
                      <item.icon className="h-4 w-4 mx-auto text-gray-600 mb-2" strokeWidth={1.5} />
                      <p className="text-[9px] uppercase tracking-[0.15em] text-gray-700 font-medium">
                        {item.label}
                      </p>
                      <p className="text-[9px] text-gray-400 mt-0.5">{item.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {product.sku && (
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 w-12">
                      SKU
                    </span>
                    <span className="text-[12px] text-gray-600 font-mono">{product.sku}</span>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 w-12">
                    Origin
                  </span>
                  <span className="text-[12px] text-gray-600 font-light">
                    Manufactured in the UK
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* TABS */}
      <section className="border-t border-gray-100">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {(['description', 'specifications', 'shipping'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 sm:px-8 py-5 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] whitespace-nowrap transition-colors ${
                  activeTab === tab ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab === 'description'
                  ? 'Description'
                  : tab === 'specifications'
                    ? 'Specifications'
                    : 'Shipping & Returns'}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-px bg-gray-900"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="py-10 sm:py-14"
            >
              {activeTab === 'description' && (
                <div className="max-w-3xl">
                  {product.longDescription ? (
                    <div className="text-gray-500 font-light leading-[1.85] text-[14px] sm:text-[15px] prose prose-gray prose-headings:font-montserrat prose-headings:font-light">
                      {typeof product.longDescription === 'string' ? (
                        product.longDescription
                          .split('\n')
                          .map((paragraph, i) => <p key={i}>{paragraph}</p>)
                      ) : (
                        <RichText data={product.longDescription} />
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 font-light leading-[1.85] text-[14px] sm:text-[15px]">
                      {product.description}
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="max-w-3xl">
                  {product.specifications && product.specifications.length > 0 ? (
                    <div className="border border-gray-100">
                      {product.specifications.map((spec, index) => (
                        <div
                          key={index}
                          className={`flex flex-col sm:flex-row sm:items-center px-6 py-4 gap-1 sm:gap-6 border-b border-gray-50 last:border-b-0 ${index % 2 === 0 ? 'bg-[#fafaf9]' : 'bg-white'}`}
                        >
                          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-gray-400 sm:w-48 shrink-0 font-medium">
                            {spec.label}
                          </span>
                          <span className="text-[13px] sm:text-[14px] text-gray-900 font-light">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 font-light text-[14px]">
                      No specifications available for this product.
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="max-w-3xl space-y-8">
                  {[
                    {
                      icon: Truck,
                      title: 'Free Delivery',
                      desc: 'We offer free standard delivery on all orders. Standard delivery takes 3-5 business days. Express delivery is available at checkout for an additional fee and takes 1-2 business days.',
                    },
                    {
                      icon: RotateCcw,
                      title: '30-Day Returns',
                      desc: "If you're not completely satisfied with your purchase, you can return it within 30 days of delivery for a full refund. Items must be in their original condition and packaging.",
                    },
                    {
                      icon: Shield,
                      title: '5-Year Warranty',
                      desc: 'All ROEX products come with a 5-year limited warranty covering manufacturing defects. Register your product within 30 days of purchase to activate the extended warranty.',
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6">
                      <div className="w-10 h-10 bg-[#f5f4f0] flex items-center justify-center shrink-0">
                        <item.icon className="h-4 w-4 text-gray-700" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="font-montserrat text-[14px] sm:text-[15px] font-normal text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-[13px] text-gray-500 font-light leading-[1.8]">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ENQUIRY CTA */}
      <section className="relative overflow-hidden bg-[#0a0a0a] py-20 sm:py-24">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        <div className="relative max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <AnimatedSection variant="fade-right">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-8 h-px bg-white/20" />
                <p className="text-[10px] uppercase tracking-[0.35em] text-white/30 font-medium">
                  Interested?
                </p>
              </div>
              <h2 className="font-montserrat text-3xl sm:text-4xl font-light text-white tracking-tight">
                Get pricing &amp; details
                <br />
                for {product.name}
              </h2>
            </AnimatedSection>
            <AnimatedSection variant="fade-left">
              <p className="text-[14px] text-white/40 font-light leading-[1.85] mb-8">
                Get in touch with our team for pricing details, bulk orders, or custom
                configurations. We&apos;re here to help you find the perfect sound solution.
              </p>
              <button
                onClick={() => setEnquiryOpen(true)}
                className="inline-flex items-center gap-2.5 h-12 px-10 bg-white text-black text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-gray-100 transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                Send Enquiry
              </button>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ENQUIRY MODAL */}
      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        productName={product.name}
      />

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="py-16 sm:py-20 md:py-24 border-t border-gray-100">
          <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
            <AnimatedSection variant="fade-up">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-12">
                <div>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-8 h-px bg-gray-400" />
                    <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 font-medium">
                      Explore More
                    </p>
                  </div>
                  <h2 className="font-montserrat text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
                    You may also like
                  </h2>
                </div>
                <Link
                  href="/shop"
                  className="self-start sm:self-auto inline-flex items-center gap-2.5 text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-gray-900 transition-colors border-b border-gray-300 pb-0.5 hover:border-gray-900"
                >
                  View All <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-5 sm:gap-y-12 md:gap-x-6 md:gap-y-14">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp.id} {...rp} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

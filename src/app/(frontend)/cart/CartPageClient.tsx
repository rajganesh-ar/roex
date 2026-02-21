'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/cart-context'
import { ProductCard } from '@/components/ProductCard'
import {
  Minus,
  Plus,
  X,
  ShoppingBag,
  ArrowRight,
  Truck,
  RotateCcw,
  Shield,
  Tag,
  ChevronDown,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { AnimatedSection } from '@/components/AnimatedSection'

interface RecommendedProduct {
  id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  image: string
  category: string
  inStock: boolean
}

interface CartPageClientProps {
  initialRecommended: RecommendedProduct[]
}

export default function CartPageClient({ initialRecommended }: CartPageClientProps) {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart()
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState('')
  const [orderNotesOpen, setOrderNotesOpen] = useState(false)
  const [orderNotes, setOrderNotes] = useState('')

  // Filter out items already in cart
  const recommended = useMemo(() => {
    const cartIds = items.map((i) => i.id)
    return initialRecommended.filter((p) => !cartIds.includes(p.id) && p.inStock).slice(0, 4)
  }, [items, initialRecommended])

  const handlePromo = () => {
    if (promoCode.toLowerCase() === 'roex10') {
      setPromoApplied(true)
      setPromoError('')
    } else {
      setPromoError('Invalid promo code')
      setPromoApplied(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="bg-white">
        <div className="min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-md px-6"
          >
            <ShoppingBag className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mb-5 sm:mb-6" />
            <h1 className="font-montserrat text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-3 sm:mb-4">
              Your bag is empty
            </h1>
            <p className="text-[14px] sm:text-[15px] text-gray-500 font-light mb-6 sm:mb-8">
              Looks like you haven&apos;t added any items to your bag yet.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center h-11 sm:h-12 px-8 sm:px-10 bg-black text-white text-[11px] sm:text-[12px] uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </motion.div>
        </div>

        {recommended.length > 0 && (
          <section className="border-t border-gray-100">
            <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-12 sm:py-16 md:py-20">
              <h2 className="font-montserrat text-xl sm:text-2xl font-light text-gray-900 mb-8 sm:mb-10">
                You might like
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10">
                {recommended.map((p) => (
                  <ProductCard key={p.id} {...p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    )
  }

  const shipping = total > 500 ? 0 : 25
  const discount = promoApplied ? total * 0.1 : 0
  const tax = (total - discount) * 0.08
  const finalTotal = total - discount + shipping + tax

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-6 sm:py-8 md:py-12">
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-gray-400 mb-3"
          >
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-600">Cart</span>
          </motion.nav>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-montserrat text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 tracking-tight"
          >
            Your Bag
          </motion.h1>
          <p className="mt-1.5 sm:mt-2 text-[12px] sm:text-[13px] text-gray-400">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="border-b border-gray-100">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-3 sm:py-4">
          <div className="flex items-center justify-center gap-6 sm:gap-8 text-[10px] sm:text-[11px] uppercase tracking-[0.15em]">
            <span className="text-gray-900 font-medium">1. Bag</span>
            <span className="w-6 sm:w-8 h-[1px] bg-gray-300" />
            <span className="text-gray-300">2. Shipping</span>
            <span className="w-6 sm:w-8 h-[1px] bg-gray-300" />
            <span className="text-gray-300">3. Payment</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-6 sm:py-8 md:py-14">
        <div className="grid lg:grid-cols-3 gap-10 lg:gap-16">
          {/* Cart Items */}
          <AnimatedSection variant="fade-up" className="lg:col-span-2">
            <div className="hidden md:grid grid-cols-[1fr,auto,auto,auto] gap-8 items-center pb-4 border-b border-gray-200 text-[11px] uppercase tracking-[0.2em] text-gray-400">
              <span>Product</span>
              <span className="w-32 text-center">Quantity</span>
              <span className="w-24 text-right">Price</span>
              <span className="w-8" />
            </div>

            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="py-5 sm:py-6 md:py-8 grid md:grid-cols-[1fr,auto,auto,auto] gap-4 md:gap-8 items-center"
                >
                  <Link href={`/products/${item.id}`} className="flex gap-4 sm:gap-5 group">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gray-50 flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <h3 className="font-montserrat text-[14px] sm:text-[15px] md:text-base font-medium text-gray-900 group-hover:text-gray-600 transition-colors truncate">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-400 font-light md:hidden">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>

                  <div className="flex items-center w-32 justify-center">
                    <div className="inline-flex items-center border border-gray-200">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 sm:w-10 text-center text-sm text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div className="w-24 text-right hidden md:block">
                    <p className="text-[15px] text-gray-900 font-light">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <div className="w-8 flex justify-end">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-300 hover:text-gray-900 transition-colors"
                      aria-label={`Remove ${item.name}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 sm:pt-6 mt-2">
              <button
                onClick={() => setOrderNotesOpen(!orderNotesOpen)}
                className="flex items-center gap-2 text-[12px] uppercase tracking-[0.15em] text-gray-500 hover:text-gray-900 transition-colors"
              >
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${orderNotesOpen ? 'rotate-180' : ''}`}
                />
                Add order notes
              </button>
              {orderNotesOpen && (
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Special instructions for your order..."
                  className="mt-3 w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 resize-none h-24"
                />
              )}
            </div>

            <div className="flex items-center justify-between pt-5 sm:pt-6 border-t border-gray-100 mt-4 sm:mt-6">
              <button
                onClick={clearCart}
                className="text-[11px] sm:text-[12px] uppercase tracking-[0.15em] text-gray-400 hover:text-gray-900 transition-colors"
              >
                Clear Bag
              </button>
              <Link
                href="/shop"
                className="text-[11px] sm:text-[12px] uppercase tracking-[0.15em] text-gray-500 hover:text-black border-b border-gray-300 hover:border-black pb-0.5 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </AnimatedSection>

          {/* Order Summary */}
          <AnimatedSection variant="fade-left" className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 bg-gray-50 p-6 sm:p-8 md:p-10">
              <h2 className="font-montserrat text-base sm:text-lg font-medium text-gray-900 mb-6 sm:mb-8">
                Order Summary
              </h2>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between text-[13px] sm:text-[14px]">
                  <span className="text-gray-500 font-light">Subtotal</span>
                  <span className="text-gray-900">${total.toFixed(2)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-[13px] sm:text-[14px]">
                    <span className="text-gray-500 font-light">Discount (10%)</span>
                    <span className="text-gray-900">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[13px] sm:text-[14px]">
                  <span className="text-gray-500 font-light">Shipping</span>
                  <span className="text-gray-900">
                    {shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] sm:text-[11px] text-gray-400 font-light">
                    Free shipping on orders over $500
                  </p>
                )}
                <div className="flex justify-between text-[13px] sm:text-[14px]">
                  <span className="text-gray-500 font-light">Tax (8%)</span>
                  <span className="text-gray-900">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="font-montserrat text-sm sm:text-base text-gray-900">
                      Total
                    </span>
                    <span className="font-montserrat text-lg sm:text-xl text-gray-900">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-8">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value)
                        setPromoError('')
                      }}
                      placeholder="Promo code"
                      className="w-full border border-gray-200 pl-9 pr-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400"
                      disabled={promoApplied}
                    />
                  </div>
                  <button
                    onClick={handlePromo}
                    disabled={!promoCode || promoApplied}
                    className="px-4 py-2.5 text-[11px] uppercase tracking-[0.1em] border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {promoApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
                {promoError && <p className="mt-1.5 text-[11px] text-red-500">{promoError}</p>}
                {promoApplied && (
                  <p className="mt-1.5 text-[11px] text-gray-500">10% discount applied</p>
                )}
              </div>

              <button className="mt-6 sm:mt-8 w-full h-12 sm:h-14 bg-black text-white text-[12px] sm:text-[13px] uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors flex items-center justify-center gap-3">
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="mt-4 sm:mt-5 p-3 sm:p-4 border border-gray-200 bg-white">
                <p className="text-[11px] uppercase tracking-[0.1em] text-gray-500 mb-1">
                  Estimated Delivery
                </p>
                <p className="text-[13px] text-gray-900 font-light">
                  {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  —{' '}
                  {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div className="mt-5 sm:mt-6 space-y-2.5 sm:space-y-3">
                {[
                  { icon: Truck, text: 'Free delivery on orders over $500' },
                  { icon: RotateCcw, text: '30-day free returns' },
                  { icon: Shield, text: 'Lifetime warranty on all products' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-[11px] sm:text-[12px] text-gray-500 font-light"
                  >
                    <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {recommended.length > 0 && (
        <section className="border-t border-gray-100">
          <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-12 sm:py-16 md:py-20">
            <AnimatedSection variant="fade-up">
              <h2 className="font-montserrat text-xl sm:text-2xl font-light text-gray-900 mb-8 sm:mb-10">
                You might also like
              </h2>
            </AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10">
              {recommended.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

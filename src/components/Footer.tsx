'use client'

import Link from 'next/link'
import { Facebook, Instagram, Youtube, Twitter, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export function Footer() {
  return (
    <footer className="relative bg-[#0a0a0a] text-white overflow-hidden">
      {/* Grid overlay — same as stats section */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Main footer grid */}
      <div className="relative border-b border-white/[0.07]">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-14 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12"
          >
            {/* Brand */}
            <div>
              <Link href="/" className="inline-flex items-center">
                <img src="/logo.svg" alt="ROEX" className="h-7 w-auto" />
              </Link>
              <div className="mt-7 space-y-2 text-[13px] text-white/35 font-light">
                <p>ROEX Audio Systems</p>
                <p>Scotland, United Kingdom</p>
                <p>Est. 2015</p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 mt-6 text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors duration-500"
              >
                Become a Partner <ArrowRight className="h-3 w-3" />
              </Link>
              {/* Socials */}
              <div className="flex items-center gap-5 mt-8">
                {[
                  { icon: Facebook, label: 'Facebook' },
                  { icon: Instagram, label: 'Instagram' },
                  { icon: Twitter, label: 'Twitter' },
                  { icon: Youtube, label: 'YouTube' },
                ].map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    className="text-white/25 hover:text-white transition-colors duration-500"
                    aria-label={label}
                  >
                    <Icon className="h-[16px] w-[16px]" />
                  </a>
                ))}
              </div>
            </div>

            {/* Order Support */}
            <div>
              <h4 className="text-[10px] font-medium text-white/50 mb-6 uppercase tracking-[0.25em] font-grotesk">
                Order Support
              </h4>
              <ul className="space-y-3">
                {[
                  { label: 'Contact Us', href: '/contact' },
                  { label: 'Pre-Purchase', href: '/shop' },
                  { label: 'Shipping Policy', href: '/policies#shipping' },
                  { label: 'Return Policy', href: '/policies#returns' },
                  { label: 'Warranty', href: '/policies#warranty' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-white/35 hover:text-white transition-colors duration-500 font-light"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Product Support */}
            <div>
              <h4 className="text-[10px] font-medium text-white/50 mb-6 uppercase tracking-[0.25em] font-grotesk">
                Product Support
              </h4>
              <ul className="space-y-3">
                {[
                  { label: 'Technical Support', href: '/contact' },
                  { label: 'Product Archive', href: '/shop' },
                  { label: 'Ceiling Speakers', href: '/shop?category=ceiling-speakers' },
                  { label: 'Track Speakers', href: '/shop?category=track-speakers' },
                  { label: 'SMART Audio', href: '/shop?category=smart-audio' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-white/35 hover:text-white transition-colors duration-500 font-light"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* About + Newsletter */}
            <div>
              <h4 className="text-[10px] font-medium text-white/50 mb-6 uppercase tracking-[0.25em] font-grotesk">
                About Us
              </h4>
              <ul className="space-y-3 mb-8">
                {[
                  { label: 'Our Story', href: '/about' },
                  { label: 'Solutions', href: '/solutions' },
                  { label: 'Blog', href: '/blog' },
                  { label: 'Careers', href: '/about' },
                  { label: 'Become a Partner', href: '/contact' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-white/35 hover:text-white transition-colors duration-500 font-light"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Newsletter */}
              <p className="text-[10px] text-white/40 uppercase tracking-[0.15em] mb-3 font-light font-grotesk">
                Stay in the loop
              </p>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-[12px] text-white placeholder-white/25 focus:outline-none focus:border-white/35 transition-colors duration-500 pr-10"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white transition-colors duration-500 group">
                  <span className="absolute inset-0 rounded-full bg-brand-gradient opacity-0 group-hover:opacity-100 blur-[6px] transition-opacity duration-300" />
                  <ArrowRight className="relative h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative max-w-[1800px] mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Payment methods */}
        <div className="flex items-center gap-2.5">
          {['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay'].map((method) => (
            <div
              key={method}
              className="h-6 px-2.5 bg-white/[0.06] flex items-center justify-center"
            >
              <span className="text-[8px] text-white/35 font-medium uppercase tracking-[0.08em]">
                {method}
              </span>
            </div>
          ))}
        </div>

        {/* Legal */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[10px] text-white/25 uppercase tracking-[0.08em]">
          <Link
            href="/policies#privacy"
            className="hover:text-white/50 transition-colors duration-500"
          >
            Privacy Policy
          </Link>
          <Link
            href="/policies#terms-of-sale"
            className="hover:text-white/50 transition-colors duration-500"
          >
            Terms of Sale
          </Link>
          <Link
            href="/policies#terms-of-use"
            className="hover:text-white/50 transition-colors duration-500"
          >
            Terms of Use
          </Link>
          <span>&copy; {new Date().getFullYear()} ROEX. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}

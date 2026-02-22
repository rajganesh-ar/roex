'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Youtube, Twitter, ArrowRight } from 'lucide-react'

const SHOP_LINKS = [
  { label: 'Speakers', href: '/products?category=speakers' },
  { label: 'Cabled Speakers', href: '/products?category=cabled-speakers' },
  { label: 'Wireless Smart Speakers', href: '/products?category=wireless-smart-speakers' },
  { label: 'Components', href: '/products?category=components' },
  { label: 'Cables', href: '/products?category=cables' },
  { label: 'All Products', href: '/products' },
]

const SUPPORT_LINKS = [
  { label: 'Contact Us', href: '/contact' },
  { label: 'Pre-Purchase Enquiry', href: '/contact' },
  { label: 'Technical Support', href: '/contact' },
  { label: 'Shipping Policy', href: '/policies#shipping' },
  { label: 'Return Policy', href: '/policies#returns' },
  { label: 'Warranty', href: '/policies#warranty' },
]

const COMPANY_LINKS = [
  { label: 'Our Story', href: '/about' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Blog', href: '/blog' },
  { label: 'Careers', href: '/about' },
  { label: 'Become a Partner', href: '/contact' },
]

export function Footer() {
  return (
    <footer className="relative bg-[#0a0a0a] text-white border-t border-white/[0.07] overflow-hidden">
      {/* Subtle grid texture — matches the Numbers section */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Main grid */}
      <div className="relative max-w-[1800px] mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand column — spans 2 on large */}
        <div className="lg:col-span-2">
          <Link href="/" className="inline-block mb-8">
            <Image src="/logo.svg" alt="ROEX" width={88} height={32} className="h-7 w-auto" />
          </Link>
          <p className="text-[12px] font-grotesk text-white/35 leading-relaxed max-w-[280px] mb-8">
            UK-based manufacturer of premium audio systems for retail, hospitality and commercial
            environments. Est. 2015.
          </p>

          {/* Socials */}
          <div className="flex items-center gap-5 mb-8">
            {[
              { icon: Facebook, label: 'Facebook' },
              { icon: Instagram, label: 'Instagram' },
              { icon: Twitter, label: 'Twitter' },
              { icon: Youtube, label: 'YouTube' },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                className="text-white/20 hover:text-white transition-colors duration-300"
                aria-label={label}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          <div className="border-t border-white/[0.07] pt-8">
            <p className="text-[9px] font-grotesk font-medium tracking-[0.25em] uppercase text-white/25 mb-3">
              Stay in the loop
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-transparent border border-white/[0.12] px-4 py-3 text-[12px] font-grotesk text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors duration-300"
              />
              <button className="px-4 border border-l-0 border-white/[0.12] text-white/30 hover:text-white hover:bg-white/[0.05] transition-all duration-300">
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-[9px] font-grotesk font-semibold tracking-[0.3em] uppercase text-white/30 mb-6">
            Shop
          </h4>
          <ul className="space-y-3">
            {SHOP_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-[12px] font-grotesk text-white/35 hover:text-white transition-colors duration-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-[9px] font-grotesk font-semibold tracking-[0.3em] uppercase text-white/30 mb-6">
            Support
          </h4>
          <ul className="space-y-3">
            {SUPPORT_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-[12px] font-grotesk text-white/35 hover:text-white transition-colors duration-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-[9px] font-grotesk font-semibold tracking-[0.3em] uppercase text-white/30 mb-6">
            Company
          </h4>
          <ul className="space-y-3">
            {COMPANY_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-[12px] font-grotesk text-white/35 hover:text-white transition-colors duration-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 pt-8 border-t border-white/[0.07]">
            <p className="text-[9px] font-grotesk font-medium tracking-[0.25em] uppercase text-white/20 mb-4">
              Location
            </p>
            <p className="text-[12px] font-grotesk text-white/30 leading-relaxed">
              ROEX Audio Systems
              <br />
              Scotland, United Kingdom
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/[0.07]">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Payment chips */}
          <div className="flex items-center gap-2">
            {['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay'].map((m) => (
              <div
                key={m}
                className="h-6 px-2.5 border border-white/[0.08] flex items-center justify-center"
              >
                <span className="text-[8px] font-grotesk font-medium uppercase tracking-[0.08em] text-white/25">
                  {m}
                </span>
              </div>
            ))}
          </div>

          {/* Legal */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
            {[
              { label: 'Privacy Policy', href: '/policies#privacy' },
              { label: 'Terms of Sale', href: '/policies#terms-of-sale' },
              { label: 'Terms of Use', href: '/policies#terms-of-use' },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-[9px] font-grotesk font-medium uppercase tracking-[0.12em] text-white/20 hover:text-white/40 transition-colors duration-300"
              >
                {l.label}
              </Link>
            ))}
            <span className="text-[9px] font-grotesk uppercase tracking-[0.12em] text-white/15">
              &copy; {new Date().getFullYear()} ROEX. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

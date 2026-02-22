'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { AnimatedSection } from '@/components/AnimatedSection'
import { useRef } from 'react'

const faqs = [
  {
    q: 'What is 360 Sound technology?',
    a: 'Our proprietary 360 Sound technology enables even sound distribution throughout any space. Unlike traditional speakers, ROEX systems create a room-filling sound carpet that reaches every corner with consistent quality, requiring up to 40% fewer speakers than conventional solutions.',
  },
  {
    q: 'Where are ROEX products manufactured?',
    a: 'ROEX is a UK-based manufacturer and global supplier of high-end audio speakers, cables, and components, founded in 2015 in Scotland. We maintain the highest standards of precision engineering and quality control across our manufacturing operations.',
  },
  {
    q: 'What industries benefit from 360 Sound systems?',
    a: 'ROEX professional audio systems are ideal for retail stores (increasing customer dwell time by 18%), shopping centres, hotels, restaurants, offices, and wellness spaces. Research shows high-quality background music significantly enhances customer experience and employee productivity.',
  },
  {
    q: 'How does system installation and control work?',
    a: 'ROEX audio systems are designed for simple and flexible installation. Speakers can be easily mounted on ceilings, walls, pendant fixtures, or lighting tracks. ROEX speakers are compatible with a third-party smart control application, enabling centralised system configuration, zone management, and sound control from any device.',
  },
  {
    q: 'Can I expand my system later?',
    a: 'Absolutely. Thanks to their modular design, you can add speakers at any time without affecting existing installations. Whether expanding a small area or equipping an entire building, ROEX systems are future-proof. System management is handled through a compatible third-party control app.',
  },
]

const milestones = [
  {
    year: '2015',
    event:
      'ROEX founded in Scotland, United Kingdom with a vision to manufacture high-end audio speakers that distribute sound evenly over 360 like a fine spray.',
    image: '/images/timeline-1.avif',
  },
  {
    year: '2017',
    event:
      'Launch of proprietary 360° Sound technology with advanced acoustic distribution principles for commercial environments.',
    image: '/images/hero-background-4.avif',
  },
  {
    year: '2019',
    event:
      'Expanded manufacturing capabilities to include professional audio cables and integrated commercial audio components.',
    image: '/images/timeline-3.avif',
  },
  {
    year: '2021',
    event:
      'Compatibility with third-party smart control application established, enabling wireless system configuration and zone management.',
    image: '/images/SMARTAudio-App-retuschiert.avif',
  },
  {
    year: '2023',
    event:
      'Expansion to 80+ countries across retail, hospitality, and commercial sectors with 50,000+ installations worldwide.',
    image: '/images/elegent-shopping.avif',
  },
  {
    year: '2025',
    event:
      'Next-generation speaker series with enhanced modular design, lighting integration, and limitless expandability.',
    image: '/images/elegent-office.avif',
  },
]

const results = [
  {
    value: '18%',
    label: 'Longer in-store time',
    desc: 'Customers linger longer in retail spaces with high-quality background music, leading to increased engagement.',
  },
  {
    value: '37%',
    label: 'Increased spending',
    desc: 'A pleasant acoustic atmosphere encourages customers to spend more, positively influencing purchase decisions.',
  },
  {
    value: '85%',
    label: 'Feel more comfortable',
    desc: 'High-quality sound creates an aesthetic experience that makes customers feel truly at ease.',
  },
  {
    value: '48%',
    label: 'Productivity boost',
    desc: 'A high-quality audio concept increases employee productivity and creates a positive work atmosphere.',
  },
  {
    value: '40%',
    label: 'Fewer speakers needed',
    desc: '360 Sound technology requires up to 40% fewer speakers while delivering significantly better results.',
  },
  {
    value: '2015',
    label: 'Founded in Scotland, UK',
    desc: 'ROEX is a UK-based manufacturer delivering premium audio systems with rigorous quality control for long-term performance.',
  },
]

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const heroParallax = useTransform(scrollY, [0, 600], [0, 80])

  return (
    <div className="bg-white">
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative h-[40vh] sm:h-[48vh] min-h-[280px] flex items-end overflow-hidden"
      >
        <motion.div style={{ y: heroParallax }} className="absolute inset-0">
          <Image
            src="/images/hero-background-1.avif"
            alt="ROEX Sound Systems"
            fill
            className="object-cover scale-110"
            priority
            sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/25" />
        <div className="relative z-10 max-w-[1800px] mx-auto w-full px-6 lg:px-12 pb-14 sm:pb-20">
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40 mb-5"
          >
            <Link href="/" className="hover:text-white/70 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white/60">About</span>
          </motion.nav>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="w-8 h-px bg-white/30" />
              <p className="text-[10px] uppercase tracking-[0.35em] text-white/40 font-medium font-grotesk">
                Our Story
              </p>
            </div>
            <h1 className="font-montserrat text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-white tracking-tight leading-[1.0] max-w-3xl drop-shadow-lg">
              We Make Your
              <br />
              Business Sound
            </h1>
          </motion.div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-24 items-center">
            <AnimatedSection variant="fade-right">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-8 h-px bg-gray-400" />
                <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 font-medium font-grotesk">
                  Our Mission
                </p>
              </div>
              <h2 className="font-montserrat text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 tracking-tight leading-[1.05] mb-8">
                Manufacturing premium audio systems for commercial spaces
              </h2>
              <div className="space-y-5 text-[14px] sm:text-[15px] text-gray-500 font-light leading-[1.85]">
                <p>
                  We rely on tradition where it has proven itself and break boundaries when they
                  restrict us. As a pioneer in sound systems, ROEX was founded in 2015 in Scotland
                  on the idea of manufacturing a loudspeaker that distributes sound evenly over 360
                  like a fine spray.
                </p>
                <p>
                  ROEX is a UK-based manufacturer and global supplier of high-end audio speakers,
                  cables, and components. Every product we design and manufacture reflects our
                  commitment to precision engineering, refined aesthetics, and seamless
                  architectural integration.
                </p>
                <p>
                  Unlike conventional speakers, our 360 Sound technology ensures optimal sound
                  quality from every listening position – requiring up to 40% fewer speakers while
                  delivering significantly better results.
                </p>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2.5 mt-10 text-[11px] uppercase tracking-[0.2em] text-gray-900 border-b border-gray-900 pb-1.5"
              >
                Explore our products <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </AnimatedSection>
            <AnimatedSection variant="fade-left">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/images/about-mission.avif"
                  alt="ROEX speakers on lighting track"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-medium">
                    Visibly invisible design
                  </span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative overflow-hidden bg-[#0a0a0a] py-16 sm:py-20">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        <div className="relative max-w-[1800px] mx-auto px-6 lg:px-12">
          <AnimatedSection variant="fade-up" className="mb-12">
            <div className="flex items-center gap-4">
              <span className="brand-bar" />
              <p className="text-[10px] uppercase tracking-[0.5em] text-white/30 font-semibold font-grotesk">
                ROEX in Numbers
              </p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.07]">
            {[
              { value: '50K+', label: 'Installations worldwide' },
              { value: '98%', label: 'Customer satisfaction' },
              { value: '2015', label: 'Founded in Scotland, UK' },
              { value: '80+', label: 'Countries served' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="px-6 lg:px-10 py-4 first:pl-0"
              >
                <div className="font-montserrat text-[48px] sm:text-[60px] lg:text-[72px] font-extralight text-white leading-none tracking-tight mb-3">
                  {stat.value}
                </div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ADVANTAGE */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-24 items-center">
            <AnimatedSection variant="fade-right">
              <div className="grid grid-cols-2 gap-3">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src="/images/about-advantage-1.avif"
                    alt="Hotel audio"
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                </div>
                <div className="relative aspect-[3/4] overflow-hidden mt-8">
                  <Image
                    src="/images/about-advantage-2.avif"
                    alt="Restaurant audio"
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection variant="fade-left">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-8 h-px bg-gray-400" />
                <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 font-medium font-grotesk">
                  Why 360 Sound
                </p>
              </div>
              <h2 className="font-montserrat text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 tracking-tight leading-[1.05] mb-10">
                The ROEX advantage
              </h2>
              <div className="space-y-0">
                {[
                  {
                    num: '01',
                    title: '360 Sound',
                    desc: 'Our proprietary and patented technology distributes sound evenly throughout any space, creating an optimal acoustic experience from every listening position.',
                  },
                  {
                    num: '02',
                    title: 'Visibly Invisible',
                    desc: 'Thanks to their elegant design, our speakers blend into every architecture and are not recognised as speakers. Refined aesthetics meet acoustic excellence.',
                  },
                  {
                    num: '03',
                    title: 'Precision Engineered',
                    desc: 'Every product is manufactured with precision engineering and rigorous quality control, ensuring reliable performance for years.',
                  },
                  {
                    num: '04',
                    title: 'Smart & Simple',
                    desc: 'ROEX speakers are compatible with a third-party smart control application, enabling centralised system configuration, zone management, and effortless operation.',
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="flex gap-6 border-t border-gray-100 py-6"
                  >
                    <span className="text-[10px] text-gray-300 font-light mt-1 w-5 flex-shrink-0">
                      {item.num}
                    </span>
                    <div>
                      <h3 className="font-montserrat text-[15px] font-normal text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-[13px] text-gray-500 font-light leading-[1.8]">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-20 sm:py-28 bg-[#f5f4f0]">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-14">
            <AnimatedSection variant="fade-right">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-8 h-px bg-stone-400" />
                <p className="text-[10px] uppercase tracking-[0.35em] text-stone-400 font-medium font-grotesk">
                  Innovation Timeline
                </p>
              </div>
              <h2 className="font-montserrat text-3xl sm:text-4xl md:text-5xl font-light text-stone-900 tracking-tight">
                A legacy of audio excellence
              </h2>
            </AnimatedSection>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-200">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 }}
                className="bg-[#f5f4f0]"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={m.image}
                    alt={m.year}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5">
                    <span className="font-montserrat text-3xl font-extralight text-white">
                      {m.year}
                    </span>
                  </div>
                </div>
                <div className="p-6 pb-7">
                  <p className="text-[13px] text-stone-600 font-light leading-[1.8]">{m.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="relative overflow-hidden bg-[#0a0a0a] py-20 sm:py-28">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        <div className="relative max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <AnimatedSection variant="fade-right">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-8 h-px bg-white/20" />
                <p className="text-[10px] uppercase tracking-[0.35em] text-white/30 font-medium font-grotesk">
                  Business Benefits
                </p>
              </div>
              <h2 className="font-montserrat text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight">
                Proven results across industries
              </h2>
            </AnimatedSection>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y divide-white/[0.07] lg:divide-y-0">
            {results.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="px-0 lg:px-8 py-8 lg:py-0 lg:border-l lg:first:border-l-0 border-white/[0.07]"
              >
                <div className="font-montserrat text-[52px] sm:text-[60px] font-extralight text-white leading-none tracking-tight mb-4">
                  {r.value}
                </div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-white/40 font-medium mb-3">
                  {r.label}
                </p>
                <p className="text-[13px] text-white/30 font-light leading-[1.75]">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FULL-WIDTH IMAGE */}
      <section className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <Image
          src="/images/about-fullwidth.avif"
          alt="ROEX in office"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1800px] mx-auto w-full px-6 lg:px-12">
            <AnimatedSection variant="fade-up" className="max-w-2xl">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-8 h-px bg-white/30" />
                <p className="text-[10px] uppercase tracking-[0.35em] text-white/40 font-medium font-grotesk">
                  Sound + Light
                </p>
              </div>
              <h2 className="font-montserrat text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight leading-[1.05]">
                Sound Merges Light
              </h2>
              <p className="mt-6 text-[15px] text-white/55 font-light leading-[1.85] max-w-lg">
                ROEX speaker systems integrate perfectly into lighting design. Whether positioned on
                lighting tracks or between light sources – an aesthetic symbiosis of sound and
                light.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-24">
            <AnimatedSection variant="fade-right">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-8 h-px bg-gray-400" />
                <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 font-medium font-grotesk">
                  FAQ
                </p>
              </div>
              <h2 className="font-montserrat text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-6">
                Frequently asked questions
              </h2>
              <p className="text-[14px] text-gray-500 font-light leading-[1.85]">
                Everything you need to know about ROEX sound systems, installation, and commercial
                benefits.
              </p>
            </AnimatedSection>
            <AnimatedSection variant="fade-left">
              <div className="divide-y divide-gray-100">
                {faqs.map((faq, i) => (
                  <div key={i}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between text-left py-5 gap-4"
                    >
                      <span className="font-montserrat text-[14px] font-light text-gray-900">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-400 ${openFaq === i ? 'max-h-60 pb-5' : 'max-h-0'}`}
                    >
                      <p className="text-[13px] text-gray-500 font-light leading-[1.8]">{faq.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[#f5f4f0] py-20 sm:py-28">
        <div className="relative max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <AnimatedSection variant="fade-right">
              <div className="flex items-center gap-4 mb-5">
                <span className="brand-bar" />
                <p className="text-[10px] uppercase tracking-[0.35em] text-stone-400 font-medium font-grotesk">
                  Get Started
                </p>
              </div>
              <h2 className="font-montserrat text-3xl sm:text-4xl md:text-5xl font-light text-stone-900 tracking-tight leading-[1.05]">
                Experience the ROEX Difference
              </h2>
            </AnimatedSection>
            <AnimatedSection variant="fade-left">
              <p className="text-[15px] text-stone-500 font-light leading-[1.85] mb-10">
                Join thousands of discerning businesses who trust ROEX for their pursuit of true
                sound. Contact us for expert consultation and discover how 360 Sound technology can
                transform your space.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center h-12 px-10 bg-black text-white text-[11px] uppercase tracking-[0.2em] font-medium gap-2.5 hover:bg-black/80 transition-colors duration-300"
                >
                  Shop Now <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center h-12 px-10 border border-stone-300 text-stone-700 text-[11px] uppercase tracking-[0.2em] font-medium hover:border-stone-500 transition-colors duration-300"
                >
                  Get in Touch
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  )
}

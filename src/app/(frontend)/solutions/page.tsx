'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  ShoppingBag,
  Hotel,
  UtensilsCrossed,
  Building2,
  Waves,
  Store,
  Volume2,
} from 'lucide-react'
import { AnimatedSection } from '@/components/AnimatedSection'

const industries = [
  {
    id: 'retail',
    icon: ShoppingBag,
    title: 'Retail & Fashion',
    headline: 'Sound sells.',
    image: '/images/elegent-retail.avif',
    secondaryImage: '/images/elegent-retail-secondary.avif',
    secondaryCaption:
      'Premium retail acoustics that increase dwell time and elevate the shopping experience.',
    description:
      'Background music has become an integral part of retail. A feel-good ambience created by sound contributes significantly to the shopping experience. The quality of the music playback is the decisive factor.',
    quote: 'The music lured me in. Even though I was actually on my way home.',
    stats: [
      { value: '18%', label: 'Stay longer in store' },
      { value: '37%', label: 'Spend more money' },
      { value: '85%', label: 'Feel more comfortable' },
    ],
    details:
      "High-quality sound is perceived as pleasant and reinforces the customer's feeling that shopping is not just a necessity, but an experience. Customers linger longer in the shop with pleasant sound and are more willing to make spontaneous purchases. ROEX speakers generate excellent 360 sound that reaches every corner and is evenly distributed throughout the room.",
    videoEmbed: 'https://www.youtube.com/embed/XAYyNL_QGcE',
  },
  {
    id: 'shopping-centres',
    icon: Store,
    title: 'Shopping Centres',
    headline: 'Size does not matter.',
    image: '/images/elegent-shopping.avif',
    secondaryImage: '/images/elegent-shopping-secondary.avif',
    secondaryCaption:
      '360� sound coverage across every level and zone � consistent quality from entrance to exit.',
    description:
      'Shopping centres are not just places where people consume. They are also places where people communicate, think, feel and make decisions. A pleasant sound environment ensures that all these activities are positively influenced.',
    quote: 'Shopping centres are increasingly becoming social meeting places.',
    stats: [
      { value: '360', label: 'Even sound coverage' },
      { value: '40%', label: 'Fewer speakers needed' },
      { value: '100%', label: 'Modular & expandable' },
    ],
    details:
      'Although people often only register a soundscape subconsciously, a pleasant acoustic atmosphere has the effect that customers perceive the environment positively and are generally more satisfied. The perception of time is also influenced, which means that visitors linger longer. ROEX 360 Sound creates consistent quality throughout even the largest spaces.',
    videoEmbed: 'https://www.youtube.com/embed/p41SPLPOUXw',
  },
  {
    id: 'hospitality',
    icon: Hotel,
    title: 'Hotels & Hospitality',
    headline: 'Perfect sound for every room.',
    image: '/images/elegent-hotel.avif',
    secondaryImage: '/images/elegent-hotel-secondary.avif',
    secondaryCaption:
      'From lobby to penthouse � timeless speakers that blend into every interior without compromise.',
    description:
      'In the hotel industry, the importance of a pleasant sound atmosphere for guest well-being is often underestimated. The psychotropic effect of sound perceived as positive is reflected in longer stays, greater willingness to spend, and the desire to return.',
    quote: 'Space is also defined by its sound.',
    stats: [
      { value: '5', label: 'Mounting options' },
      { value: '0', label: 'Visible speaker cables' },
      { value: '24/7', label: 'Reliable performance' },
    ],
    details:
      'Whether wellness area, bar, lounge, terrace or restaurant � the simple and timeless elegance of ROEX speakers adapts to any interior design. From in-ceiling to pendant, track or floor-standing models, the even 360 sound carpet can be individually integrated into every room of your hotel.',
    videoEmbed: 'https://www.youtube.com/embed/ONAcWkbv65M',
  },
  {
    id: 'restaurants',
    icon: UtensilsCrossed,
    title: 'Restaurants & Gastro',
    headline: "Guests who feel comfortable don't whisper!",
    image: '/images/elegent-resturant.avif',
    secondaryImage: '/images/elegent-resturant-secondary.avif',
    secondaryCaption:
      'Balanced, even sound that complements great food � conversations flow, atmosphere lingers.',
    description:
      'In addition to good food, a feel-good atmosphere is everything that guests want from a restaurant. All senses must be appealed to. Sound contributes significantly to the feel-good experience.',
    quote: 'Audio is one of the most useful components of efficient interior strategies.',
    stats: [
      { value: '360', label: 'Balanced, even sound' },
      { value: '20Hz', label: 'To 20kHz frequency range' },
      { value: '100%', label: 'Design integration' },
    ],
    details:
      'The sound should be balanced, even and of high quality so that conversations are not drowned out, but soothing sounds can be fully perceived. Our elegant and timeless speakers combine all these competences � ceiling or wall-mounted, pendant, track, or floor-standing models that maintain the authenticity of your interior.',
    videoEmbed: 'https://www.youtube.com/embed/IYRmWObHUrY',
  },
  {
    id: 'offices',
    icon: Building2,
    title: 'Offices & Corporate',
    headline: 'Satisfied employees produce positive results.',
    image: '/images/elegent-office.avif',
    secondaryImage: '/images/elegent-office-secondary.avif',
    secondaryCaption:
      'Unobtrusive background music that boosts productivity by 48% � heard but never noticed.',
    description:
      'How can you create a pleasant atmosphere for your company to increase the efficiency of your employees? Music played in even, high-quality distribution has the advantage that it does not require cognitive concentration.',
    quote: 'A high-quality audio concept increases productivity by 48%.',
    stats: [
      { value: '48%', label: 'Productivity increase' },
      { value: '40%', label: 'Fewer speakers needed' },
      { value: '1', label: 'Compatible control app' },
    ],
    details:
      'Listening to music in the workplace has a significantly positive effect on the mood of employees. Only perceived unnoticed, it increases the well-being of its listeners. An important aspect is that it is high-quality sound with even and interference-free dispersion. ROEX speakers offer all this � elegant, timeless design that integrates into any room.',
    videoEmbed: 'https://www.youtube.com/embed/QVbGFiVUTxM',
  },
  {
    id: 'wellness',
    icon: Waves,
    title: 'Wellness & Spa',
    headline: 'Sound accompanies us every day.',
    image: '/images/elegent-spa.avif',
    secondaryImage: '/images/elegent-spa-secondary.avif',
    secondaryCaption:
      'Serene soundscapes from 20�20,000 Hz � every frequency pure, every moment of calm enhanced.',
    description:
      'Sound accompanies us every day � sometimes too loud, sometimes too quiet � and sometimes in such a way that it simply carries us. Only a perfect sound system can guarantee this in wellness environments.',
    quote: 'Good sound is becoming an indispensable element in architecture.',
    stats: [
      { value: '20Hz', label: 'Full spectrum audio' },
      { value: '360', label: 'Immersive sound field' },
      { value: '', label: 'Expandable zones' },
    ],
    details:
      'ROEX has set itself the task of providing excellent acoustics for every type and form of architecture. With a wide range of mounting options and compatibility with a third-party smart control application, creating the perfect serene soundscape for relaxation is effortless. 20�20,000 Hz � every frequency impressively accurate, pure enjoyment for every ear.',
    videoEmbed: 'https://www.youtube.com/embed/ya1ERHjte9o',
  },
]

const advantages = [
  {
    num: '01',
    title: 'Optimal Sound Everywhere',
    desc: 'Room-filling sound carpet for all listening positions through our protected 360 sound principle.',
  },
  {
    num: '02',
    title: 'Visibly Invisible',
    desc: 'Thanks to their great design, our speakers blend into every architecture and are not recognised as such.',
  },
  {
    num: '03',
    title: 'More From Less',
    desc: 'Requires up to 40% fewer speakers � while simultaneously achieving a significantly better sound result.',
  },
  {
    num: '04',
    title: 'Simple & Flexible',
    desc: 'ROEX speakers support integration with a third-party smart audio control platform, enabling effortless zone management and operation.',
  },
  {
    num: '05',
    title: 'Sound Merges Light',
    desc: 'Integrate perfectly into lighting design. Positioned on tracks or between light sources � aesthetic symbiosis.',
  },
  {
    num: '06',
    title: 'Limitlessly Expandable',
    desc: 'Add speakers at any time without affecting existing installations. Modular, future-proof, managed from a compatible third-party control app.',
  },
]

export default function SolutionsPage() {
  const [activeIndustry, setActiveIndustry] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const heroParallax = useTransform(scrollY, [0, 600], [0, 80])

  const current = industries[activeIndustry]

  return (
    <div className="bg-white">
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative h-[40vh] sm:h-[48vh] min-h-[280px] flex items-end overflow-hidden"
      >
        <motion.div style={{ y: heroParallax }} className="absolute inset-0">
          <Image
            src="/images/hero-background-2.avif"
            alt="ROEX Solutions"
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
            <span className="text-white/60">Solutions</span>
          </motion.nav>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="w-8 h-px bg-white/30" />
              <p className="text-[10px] uppercase tracking-[0.35em] text-white/40 font-medium font-grotesk">
                Industry Solutions
              </p>
            </div>
            <h1 className="font-montserrat text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-white tracking-tight leading-[1.0] max-w-3xl drop-shadow-lg">
              Perfect Sound for
              <br />
              Every Space
            </h1>
            <p className="mt-6 text-[14px] sm:text-[15px] text-white/50 font-light max-w-xl leading-[1.85]">
              Among all stimuli, sound is the one that people perceive first. Discover how ROEX 360
              Sound transforms every industry.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-14">
            <AnimatedSection variant="fade-right">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-8 h-px bg-gray-400" />
                <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 font-medium font-grotesk">
                  The ROEX Advantage
                </p>
              </div>
              <h2 className="font-montserrat text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 tracking-tight max-w-xl">
                360 is more than versatility
              </h2>
            </AnimatedSection>
            <AnimatedSection variant="fade-left" className="sm:max-w-sm">
              <p className="text-[14px] text-gray-500 font-light leading-[1.85]">
                Our speakers produce excellent 360 sound that reaches every corner and is
                distributed evenly with consistent quality � creating a feeling of well-being that
                positively influences every environment.
              </p>
            </AnimatedSection>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-gray-100">
            {advantages.map((adv, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="border-b border-r border-gray-100 p-8 lg:p-10 [&:nth-child(2n)]:sm:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0"
              >
                <span className="text-[10px] text-gray-300 font-light block mb-4">{adv.num}</span>
                <h3 className="font-montserrat text-[15px] font-normal text-gray-900 mb-3">
                  {adv.title}
                </h3>
                <p className="text-[13px] text-gray-500 font-light leading-[1.8]">{adv.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRY NAVIGATOR */}
      <section className="py-20 sm:py-28 bg-[#f5f4f0]">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <AnimatedSection variant="fade-right">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-8 h-px bg-stone-400" />
                <p className="text-[10px] uppercase tracking-[0.35em] text-stone-400 font-medium">
                  Industry Solutions
                </p>
              </div>
              <h2 className="font-montserrat text-3xl sm:text-4xl md:text-5xl font-light text-stone-900 tracking-tight mb-10">
                Tailored for your business
              </h2>
            </AnimatedSection>
            {/* Industry tabs */}
            <div className="flex flex-wrap gap-2">
              {industries.map((ind, i) => (
                <button
                  key={ind.id}
                  onClick={() => setActiveIndustry(i)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] transition-all duration-300 font-medium ${
                    activeIndustry === i
                      ? 'bg-[#0a0a0a] text-white'
                      : 'bg-white text-stone-500 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  <ind.icon className="h-3 w-3" />
                  {ind.title}
                </button>
              ))}
            </div>
          </div>

          {/* Active Industry Detail */}
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-12">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={current.image}
                  alt={current.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 w-fit">
                    <current.icon className="h-3 w-3 text-white" />
                    <span className="text-[9px] uppercase tracking-[0.3em] text-white font-medium">
                      {current.title}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="font-montserrat text-2xl sm:text-3xl lg:text-4xl font-light text-stone-900 leading-tight tracking-tight mb-5">
                  {current.headline}
                </h3>
                <p className="text-[14px] sm:text-[15px] text-stone-600 font-light leading-[1.85] mb-6">
                  {current.description}
                </p>
                <blockquote className="border-l-2 border-stone-300 pl-5 text-[14px] text-stone-500 font-light italic">
                  &ldquo;{current.quote}&rdquo;
                </blockquote>
                <div className="grid grid-cols-3 gap-4 mt-10 pt-10 border-t border-stone-200">
                  {current.stats.map((stat, i) => (
                    <div key={i}>
                      <p className="font-montserrat text-2xl sm:text-3xl font-extralight text-stone-900">
                        {stat.value}
                      </p>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-stone-400 mt-1.5 font-medium">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-[14px] text-stone-600 font-light leading-[1.85] mt-8">
                  {current.details}
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.2em] text-stone-900 border-b border-stone-900 pb-1.5 mt-6 self-start"
                >
                  Explore Products for {current.title} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Secondary full-width image */}
            <div className="mt-12 relative aspect-[21/8] overflow-hidden">
              <Image
                src={current.secondaryImage}
                alt={`${current.title} environment`}
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 sm:p-12">
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/50 mb-2 font-medium">
                  ROEX 360 Sound
                </p>
                <p className="font-montserrat text-xl sm:text-2xl font-light text-white max-w-md">
                  {current.secondaryCaption}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SMART AUDIO APP */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-24 items-center">
            <AnimatedSection variant="fade-right">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="/images/SMARTAudio-App-retuschiert.avif"
                  alt="ROEX Compatible Smart Control"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </AnimatedSection>
            <AnimatedSection variant="fade-left">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-8 h-px bg-gray-400" />
                <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 font-medium">
                  Compatible Smart Control
                </p>
              </div>
              <h2 className="font-montserrat text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-8">
                Louder, quieter, equaliser � all from one compatible app
              </h2>
              <div className="space-y-4 text-[14px] text-gray-500 font-light leading-[1.85]">
                <p>
                  ROEX speakers can be controlled via a compatible third-party smart control
                  application. Simply download the app, manage zones, control speakers, and immerse
                  yourself in a perfect sound atmosphere from any mobile phone, tablet, or device.
                </p>
                <p>
                  For those who prefer full control from a computer, the web-based interface lets
                  you manage your entire sound system via the network. Zone-by-zone control,
                  equaliser settings, scheduling � everything at your fingertips.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center h-12 px-10 bg-[#0a0a0a] text-white text-[11px] uppercase tracking-[0.2em] gap-2.5"
                >
                  Explore Audio Systems <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center h-12 px-10 border border-gray-200 text-gray-900 text-[11px] uppercase tracking-[0.2em] hover:border-gray-400 transition-colors"
                >
                  Book a Demo
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* STATS DARK */}
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
              <span className="block w-8 h-px bg-white/20" />
              <p className="text-[10px] uppercase tracking-[0.5em] text-white/30 font-semibold">
                Proven Track Record
              </p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.07]">
            {[
              { value: '50K+', label: 'Installations worldwide' },
              { value: '80+', label: 'Countries served' },
              { value: '98%', label: 'Customer satisfaction' },
              { value: '10+', label: 'Years of excellence' },
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

      {/* FULL-WIDTH IMAGE DIVIDER */}
      <section className="relative h-[45vh] sm:h-[55vh] overflow-hidden">
        <Image
          src="/images/elegent-office.avif"
          alt="ROEX in action"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1800px] mx-auto w-full px-6 lg:px-12">
            <AnimatedSection variant="fade-up" className="max-w-2xl">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-8 h-px bg-white/30" />
                <p className="text-[10px] uppercase tracking-[0.35em] text-white/40 font-medium font-grotesk">
                  Designed for Business
                </p>
              </div>
              <h2 className="font-montserrat text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight leading-[1.05]">
                Your space. Your sound.
                <br />
                Your brand.
              </h2>
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
                Transform Your Space
                <br />
                with 360 Sound
              </h2>
            </AnimatedSection>
            <AnimatedSection variant="fade-left">
              <p className="text-[15px] text-stone-500 font-light leading-[1.85] mb-10">
                Contact ROEX today for expert consultation and discover how 360 Sound technology can
                enhance your business, increase customer satisfaction, and boost your bottom line.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center h-12 px-10 bg-black text-white text-[11px] uppercase tracking-[0.2em] font-medium gap-2.5 hover:bg-black/80 transition-colors duration-300"
                >
                  Get a Consultation <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center h-12 px-10 border border-stone-300 text-stone-700 text-[11px] uppercase tracking-[0.2em] font-medium hover:border-stone-500 transition-colors duration-300"
                >
                  Browse Products
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  )
}

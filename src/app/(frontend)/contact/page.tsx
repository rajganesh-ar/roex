'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Mail,
  MapPin,
  Send,
  Check,
  ChevronDown,
  Clock,
  MessageCircle,
  Headphones,
  ArrowRight,
} from 'lucide-react'
import { AnimatedSection } from '@/components/AnimatedSection'

const contactFaqs = [
  {
    q: 'How long does shipping take?',
    a: 'Standard delivery takes 5-10 business days within the UK and Europe. Express delivery options are available at checkout for an additional fee. International orders typically arrive within 7-14 business days.',
  },
  {
    q: 'What is your return policy?',
    a: 'We offer a 30-day return policy on all products. Items must be in their original condition with packaging. Contact us to initiate a return and we\u2019ll provide all necessary documentation.',
  },
  {
    q: 'Do you offer international shipping?',
    a: 'Yes, we ship to over 80 countries worldwide. ROEX is a global supplier with international delivery capabilities. Shipping rates and delivery times vary by destination. All duties and taxes are calculated at checkout.',
  },
  {
    q: 'How can I track my order?',
    a: 'Once your order ships, you\u2019ll receive a tracking number via email. You can also check order status by logging into your account on our website.',
  },
  {
    q: 'Do you offer warranty services?',
    a: 'All ROEX products come with a 5-year limited warranty. If you experience any manufacturing defects, contact our support team with your order details and proof of purchase.',
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const heroParallax = useTransform(scrollY, [0, 600], [0, 80])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          product: formData.subject || 'General Enquiry',
        }),
      })
      if (response.ok) {
        setSubmitted(true)
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
        setTimeout(() => setSubmitted(false), 5000)
      }
    } catch {
      // Network error — keep form intact so user can retry
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="bg-white">
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative h-[40vh] sm:h-[48vh] min-h-[280px] flex items-end overflow-hidden"
      >
        <motion.div style={{ y: heroParallax }} className="absolute inset-0">
          <Image
            src="/images/contact-office.avif"
            alt="Contact ROEX"
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
            <span className="text-white/60">Contact</span>
          </motion.nav>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="w-8 h-px bg-white/30" />
              <p className="text-[10px] uppercase tracking-[0.35em] text-white/40 font-medium font-grotesk">
                Get in Touch
              </p>
            </div>
            <h1 className="font-montserrat text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-white tracking-tight leading-[1.0] max-w-3xl drop-shadow-lg">
              Let&apos;s Create Something
              <br />
              Extraordinary
            </h1>
          </motion.div>
        </div>
      </section>

      {/* QUICK CONTACT CARDS */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-12 sm:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            {[
              {
                icon: Headphones,
                title: 'Product Support',
                desc: 'Get help with your ROEX audio systems',
                action: 'support@roexaudios.com',
              },
              {
                icon: MessageCircle,
                title: 'Sales & Consultation',
                desc: 'Talk to our sound design specialists',
                action: 'support@roexaudios.com',
              },
              {
                icon: Clock,
                title: 'Business Hours',
                desc: 'Monday – Friday',
                action: '9AM – 6PM CET',
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="px-6 sm:px-10 py-8 sm:py-0 first:pt-0 last:pb-0 sm:first:pl-0 sm:last:pr-0"
              >
                <card.icon className="h-4 w-4 text-gray-400 stroke-[1.5] mb-4" />
                <h3 className="font-montserrat text-[13px] font-normal text-gray-900 mb-1.5">
                  {card.title}
                </h3>
                <p className="text-[12px] text-gray-400 font-light mb-2">{card.desc}</p>
                <p className="text-[13px] text-gray-600 font-light">{card.action}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT – FORM + INFO */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-5 gap-14 lg:gap-24">
            {/* FORM */}
            <AnimatedSection variant="fade-right" className="lg:col-span-3">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-8 h-px bg-gray-400" />
                <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 font-medium font-grotesk">
                  Send a Message
                </p>
              </div>
              <h2 className="font-montserrat text-3xl sm:text-4xl font-light text-gray-900 tracking-tight mb-10">
                We&apos;d love to hear from you
              </h2>

              {submitted ? (
                <div className="flex flex-col items-start py-14 border-t border-gray-100">
                  <div className="h-10 w-10 bg-[#0a0a0a] flex items-center justify-center mb-6">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-montserrat text-2xl font-light text-gray-900 mb-3">
                    Message Sent
                  </h3>
                  <p className="text-[14px] text-gray-500 font-light leading-[1.8] max-w-sm">
                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-3"
                      >
                        Name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full border-b border-gray-200 py-3 text-[14px] text-gray-900 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-900 transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-3"
                      >
                        Email *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border-b border-gray-200 py-3 text-[14px] text-gray-900 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-900 transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-3"
                      >
                        Phone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border-b border-gray-200 py-3 text-[14px] text-gray-900 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-900 transition-colors"
                        placeholder="+971 55 000 0000"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-3"
                      >
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full border-b border-gray-200 py-3 text-[14px] text-gray-900 bg-transparent focus:outline-none focus:border-gray-900 transition-colors appearance-none cursor-pointer"
                      >
                        <option value="">Select a topic</option>
                        <option value="product">Product Inquiry</option>
                        <option value="order">Order Support</option>
                        <option value="technical">Technical Support</option>
                        <option value="returns">Returns &amp; Warranty</option>
                        <option value="partnership">Partnership</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-3"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full border-b border-gray-200 py-3 text-[14px] text-gray-900 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-900 transition-colors resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center h-12 px-10 bg-[#0a0a0a] text-white text-[11px] uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed gap-2.5"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </AnimatedSection>

            {/* CONTACT INFO */}
            <AnimatedSection variant="fade-left" delay={0.15} className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-8 h-px bg-gray-400" />
                <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 font-medium">
                  Contact Info
                </p>
              </div>
              <h2 className="font-montserrat text-3xl sm:text-4xl font-light text-gray-900 tracking-tight mb-10">
                Other ways to reach us
              </h2>

              <div className="space-y-0 divide-y divide-gray-100">
                <div className="flex gap-5 py-7 first:pt-0">
                  <Mail className="h-4 w-4 text-gray-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-2">
                      Email
                    </p>
                    <p className="text-[14px] text-gray-900 font-light">support@roexaudios.com</p>
                    <p className="text-[12px] text-gray-400 mt-1 font-light">
                      We respond within 24 hours
                    </p>
                  </div>
                </div>
                <div className="flex gap-5 py-7">
                  <MapPin className="h-4 w-4 text-gray-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-2">
                      Showroom
                    </p>
                    <p className="text-[14px] text-gray-900 font-light">Scotland, United Kingdom</p>
                    <p className="text-[12px] text-gray-400 mt-1 font-light">By appointment only</p>
                  </div>
                </div>
              </div>

              {/* Office image */}
              <div className="relative aspect-[4/3] overflow-hidden mt-8">
                <Image
                  src="/images/contact-office.avif"
                  alt="ROEX showroom"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-5 left-5">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-white/60 font-medium">
                    Sound & Light showroom
                  </span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-28 bg-[#f5f4f0]">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-24">
            <AnimatedSection variant="fade-right">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-8 h-px bg-stone-400" />
                <p className="text-[10px] uppercase tracking-[0.35em] text-stone-400 font-medium font-grotesk">
                  FAQ
                </p>
              </div>
              <h2 className="font-montserrat text-3xl sm:text-4xl md:text-5xl font-light text-stone-900 tracking-tight mb-6">
                Common questions
              </h2>
              <p className="text-[14px] text-stone-500 font-light leading-[1.85]">
                Everything you need to know about orders, shipping, warranty, and support.
                Can&apos;t find what you&apos;re looking for? Reach out directly.
              </p>
            </AnimatedSection>
            <AnimatedSection variant="fade-left">
              <div className="divide-y divide-stone-200">
                {contactFaqs.map((faq, i) => (
                  <div key={i}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between text-left py-5 gap-4"
                    >
                      <span className="font-montserrat text-[14px] font-light text-stone-900">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-stone-400 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-60 pb-5' : 'max-h-0'}`}
                    >
                      <p className="text-[13px] text-stone-500 font-light leading-[1.8]">{faq.a}</p>
                    </div>
                  </div>
                ))}
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
          <div className="grid grid-cols-3 divide-x divide-white/[0.07]">
            {[
              { value: '24h', label: 'Avg. response time' },
              { value: '98%', label: 'Customer satisfaction' },
              { value: '10+', label: 'Years of excellence' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="px-6 lg:px-12 py-4 first:pl-0"
              >
                <div className="font-montserrat text-[44px] sm:text-[60px] lg:text-[72px] font-extralight text-white leading-none tracking-tight mb-3">
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

      {/* CTA */}
      <section className="relative overflow-hidden bg-white py-20 sm:py-28">
        <div className="relative max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <AnimatedSection variant="fade-right">
              <div className="flex items-center gap-4 mb-5">
                <span className="brand-bar" />
                <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 font-medium font-grotesk">
                  Ready to Start
                </p>
              </div>
              <h2 className="font-montserrat text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 tracking-tight leading-[1.05]">
                Ready to transform
                <br />
                your space?
              </h2>
            </AnimatedSection>
            <AnimatedSection variant="fade-left">
              <p className="text-[15px] text-gray-500 font-light leading-[1.85] mb-10">
                Explore our full range of 360 sound systems and audio solutions. From a single
                showroom speaker to a complete building installation – ROEX has the perfect system
                for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center h-12 px-10 bg-black text-white text-[11px] uppercase tracking-[0.2em] font-medium gap-2.5 hover:bg-black/80 transition-colors duration-300"
                >
                  Browse Products <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/solutions"
                  className="inline-flex items-center justify-center h-12 px-10 border border-gray-300 text-gray-700 text-[11px] uppercase tracking-[0.2em] font-medium hover:border-gray-500 transition-colors duration-300"
                >
                  View Solutions
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  )
}

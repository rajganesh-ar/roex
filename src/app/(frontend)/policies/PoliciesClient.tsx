'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Package,
  RotateCcw,
  Shield,
  Lock,
  FileText,
  ScrollText,
  ChevronRight,
  ArrowUp,
} from 'lucide-react'

const LAST_UPDATED = 'February 22, 2026'

const sections = [
  {
    id: 'shipping',
    label: 'Shipping Policy',
    icon: Package,
    content: [
      {
        heading: 'Delivery Areas',
        body: 'ROEX ships to over 80 countries worldwide. Standard delivery is available across the United Kingdom, European Union, and international destinations. Some remote or restricted regions may not be eligible for direct shipment; please contact us to confirm availability for your location.',
      },
      {
        heading: 'Processing Times',
        body: 'All orders placed before 14:00 GMT on a business day are processed the same day. Orders placed after 14:00 GMT or on weekends and bank holidays are processed on the next business day. During peak periods or promotional events, processing may take up to 2 business days.',
      },
      {
        heading: 'Estimated Delivery Times',
        body: 'UK Standard: 3–5 business days. UK Express (available at checkout): 1–2 business days. Europe: 5–10 business days. International: 7–14 business days. Delivery estimates begin from the date of dispatch, not the date of order. ROEX is not liable for delays caused by customs clearance, carrier disruptions, or force majeure events.',
      },
      {
        heading: 'Shipping Costs',
        body: 'Shipping costs are calculated at checkout based on your delivery address, order weight, and selected shipping method. Free standard shipping is offered on UK orders exceeding £500 (net) and EU orders exceeding €750 (net). International shipping rates vary by destination and carrier.',
      },
      {
        heading: 'Duties, Taxes & Import Fees',
        body: 'Orders shipped outside the UK may be subject to import duties, taxes, and customs clearance fees levied by the destination country. These charges are the sole responsibility of the recipient and are not included in the product price or shipping fee. ROEX cannot predict or control these charges.',
      },
      {
        heading: 'Order Tracking',
        body: "Upon dispatch, you will receive a confirmation email containing a tracking number and a link to the carrier's tracking portal. If you have not received tracking information within 2 business days of your expected dispatch date, please contact our support team.",
      },
      {
        heading: 'Damaged or Lost Shipments',
        body: 'If your order arrives visibly damaged, please document the damage with photographs before signing for the delivery and contact us within 48 hours. For lost shipments, please allow 5 extra business days beyond the estimated delivery window before raising a claim. ROEX will work directly with the carrier to resolve all shipping issues promptly.',
      },
    ],
  },
  {
    id: 'returns',
    label: 'Return Policy',
    icon: RotateCcw,
    content: [
      {
        heading: 'Return Eligibility Window',
        body: 'ROEX offers a 30-day return window from the date of delivery for all standard products. To be eligible, items must be unused, undamaged, and returned in their original packaging with all accessories, documentation, and proof of purchase.',
      },
      {
        heading: 'Non-Returnable Items',
        body: 'The following items are excluded from our return policy: (a) products that have been installed, modified, or show signs of use; (b) custom-configured or special-order products; (c) software, licences, and downloadable content; (d) consumable items such as cables where the seal has been broken; (e) products purchased through authorised third-party resellers (subject to their own return policy).',
      },
      {
        heading: 'How to Initiate a Return',
        body: 'To begin a return, email support@roexaudios.com with your order number, the item(s) you wish to return, and your reason for returning. Our team will issue a Return Merchandise Authorisation (RMA) number within 2 business days. Returns sent without an RMA number will not be accepted and will be returned to the sender at their expense.',
      },
      {
        heading: 'Return Shipping',
        body: 'Customers are responsible for return shipping costs unless the return is due to a defective product, an incorrect item sent, or a ROEX fulfilment error. We recommend using a tracked, insured courier service. ROEX is not responsible for items lost or damaged in transit during return shipping.',
      },
      {
        heading: 'Inspection & Refunds',
        body: 'Once we receive and inspect your return (typically within 3–5 business days), we will notify you of the outcome. Approved refunds are processed to your original payment method within 5–10 business days. Original shipping costs are non-refundable unless the return is due to our error. Restocking fees may apply to returns of bulk or commercial orders.',
      },
      {
        heading: 'Exchanges',
        body: 'If you wish to exchange an item for a different model or specification, please initiate a return and place a new order. This ensures the fastest possible resolution and guarantees stock availability.',
      },
    ],
  },
  {
    id: 'warranty',
    label: 'Warranty',
    icon: Shield,
    content: [
      {
        heading: 'Standard Limited Warranty',
        body: 'ROEX Audio Systems warrants all products manufactured and sold directly by ROEX against defects in materials and workmanship for a period of five (5) years from the original date of purchase by the end customer.',
      },
      {
        heading: 'Warranty Coverage',
        body: 'This warranty covers manufacturing defects, component failures under normal operating conditions, and defects in materials used. During the warranty period, ROEX will, at its sole discretion, repair or replace the defective product at no charge for parts or labour.',
      },
      {
        heading: 'Warranty Exclusions',
        body: 'This warranty does not cover: (a) damage resulting from accident, misuse, abuse, neglect, or unauthorised modification; (b) damage caused by operating the product outside the permitted environmental or electrical specifications; (c) cosmetic damage including scratches, dents, and broken enclosures; (d) wear from normal use; (e) damage caused by service performed by a party other than an authorised ROEX service provider; (f) third-party products or software; (g) products with removed or altered serial numbers.',
      },
      {
        heading: 'How to Claim Warranty',
        body: 'To make a warranty claim, contact our support team at warranty@roexaudios.com with your full name, proof of purchase, product serial number, a description of the defect, and supporting photographs or video. Our team will assess your claim within 5 business days and provide instructions for repair, replacement, or resolution.',
      },
      {
        heading: 'Limitations of Liability',
        body: 'To the maximum extent permitted by applicable law, the liability of ROEX under this warranty is limited to the purchase price of the product. ROEX shall not be liable for any indirect, incidental, special, or consequential damages arising from the use or inability to use the product.',
      },
      {
        heading: 'Statutory Rights',
        body: 'This warranty gives you specific legal rights. You may also have other rights which vary by jurisdiction. Nothing in this warranty limits or excludes your statutory rights as a consumer under applicable law, including the UK Consumer Rights Act 2015 or equivalent legislation.',
      },
    ],
  },
  {
    id: 'privacy',
    label: 'Privacy Policy',
    icon: Lock,
    content: [
      {
        heading: 'Data Controller',
        body: 'ROEX Audio Systems Ltd ("ROEX", "we", "us", "our") is the data controller responsible for your personal data. We are committed to protecting and respecting your privacy in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.',
      },
      {
        heading: 'Data We Collect',
        body: 'We collect the following categories of personal data: (a) Identity Data — name, username, title; (b) Contact Data — billing address, delivery address, email address, telephone number; (c) Financial Data — payment card details (processed securely by our payment provider; never stored by ROEX); (d) Transaction Data — details of products purchased; (e) Technical Data — IP address, browser type, operating system, referral source; (f) Usage Data — pages visited, links clicked, session duration; (g) Marketing & Communications Preferences.',
      },
      {
        heading: 'How We Use Your Data',
        body: 'We use your personal data to: process and fulfil your orders; manage your account; send transactional communications such as order confirmations and shipping updates; provide customer and technical support; improve our website and product offerings; comply with legal and regulatory obligations; and, where you have given consent, send marketing communications about ROEX products and offers.',
      },
      {
        heading: 'Legal Basis for Processing',
        body: 'We process your personal data on the following legal bases: (a) Performance of a contract — processing necessary to fulfil your order; (b) Legal obligation — compliance with applicable laws; (c) Legitimate interests — improving our services and preventing fraud; (d) Consent — marketing communications, which you may withdraw at any time.',
      },
      {
        heading: 'Data Retention',
        body: 'We retain personal data for as long as necessary to fulfil the purposes for which it was collected, including for the purposes of satisfying any legal or regulatory requirements. Order and transaction records are retained for 7 years in compliance with UK tax law. Marketing preferences are retained until you withdraw consent.',
      },
      {
        heading: 'Your Rights',
        body: 'Under UK GDPR you have the right to: access a copy of your personal data; rectify inaccurate data; request erasure of your data (the "right to be forgotten"); restrict or object to processing; data portability; and withdraw consent at any time. To exercise any of these rights, contact privacy@roexaudios.com. You also have the right to lodge a complaint with the Information Commissioner\'s Office (ICO) at ico.org.uk.',
      },
      {
        heading: 'Cookies',
        body: 'Our website uses cookies to improve your browsing experience, analyse site traffic, and deliver personalised content. Strictly necessary cookies are always active. You may adjust your cookie preferences at any time via the cookie banner or browser settings. For full details, see our Cookie Policy.',
      },
      {
        heading: 'Third-Party Sharing',
        body: 'We do not sell your personal data. We share data only with trusted third-party service providers (payment processors, logistics partners, analytics providers) who process data on our behalf under strict data processing agreements, and where required by law or regulatory authorities.',
      },
      {
        heading: 'International Transfers',
        body: 'Where we transfer personal data outside the UK, we ensure appropriate safeguards are in place, such as standard contractual clauses approved by the ICO, to protect your data in accordance with UK GDPR.',
      },
    ],
  },
  {
    id: 'terms-of-sale',
    label: 'Terms of Sale',
    icon: FileText,
    content: [
      {
        heading: 'Agreement to Terms',
        body: 'By placing an order with ROEX Audio Systems Ltd, you agree to be bound by these Terms of Sale. These terms apply to all purchases made through our website or via our sales team. Please read them carefully before completing your purchase.',
      },
      {
        heading: 'Pricing & Currency',
        body: 'All prices displayed on our website are in Pounds Sterling (GBP) and exclude VAT unless otherwise stated. VAT is applied at the prevailing UK rate and is displayed separately at checkout. ROEX reserves the right to amend prices at any time without prior notice; however, the price at the time of your order will apply to that order.',
      },
      {
        heading: 'Order Acceptance',
        body: 'Your order constitutes an offer to purchase. ROEX reserves the right to decline any order at its sole discretion, including where products are unavailable, where pricing errors have occurred, or where payment verification fails. A binding contract is formed only upon dispatch of the goods and issuance of a dispatch confirmation email.',
      },
      {
        heading: 'Payment',
        body: 'We accept payment via Visa, Mastercard, American Express, PayPal, and Apple Pay. All transactions are processed over encrypted, PCI DSS-compliant connections. Payment is debited at the time of order placement. For bulk and commercial orders, ROEX may offer invoice terms by prior arrangement.',
      },
      {
        heading: 'Title & Risk',
        body: 'Ownership (title) of goods passes to you upon receipt of full payment. Risk of loss or damage passes to you upon delivery of the goods to the delivery address you provided.',
      },
      {
        heading: 'Cancellations',
        body: 'Orders may be cancelled free of charge before dispatch. To cancel, contact us immediately at orders@roexaudios.com with your order number. Orders that have already been dispatched cannot be cancelled; refer to our Return Policy to initiate a return.',
      },
      {
        heading: 'Product Descriptions',
        body: 'ROEX endeavours to ensure all product descriptions, specifications, and images are accurate as of the time of publication. We reserve the right to correct errors or omissions and to update product information without prior notice. Images are for illustrative purposes and minor variations in colour or finish may occur.',
      },
      {
        heading: 'Governing Law',
        body: 'These Terms of Sale are governed by the laws of Scotland, United Kingdom. Any disputes shall be subject to the exclusive jurisdiction of the Scottish courts, without prejudice to your statutory rights as a consumer.',
      },
    ],
  },
  {
    id: 'terms-of-use',
    label: 'Terms of Use',
    icon: ScrollText,
    content: [
      {
        heading: 'Acceptance of Terms',
        body: 'By accessing or using the ROEX website (roexaudios.com), you agree to these Terms of Use. If you do not agree, please do not use our website. ROEX reserves the right to amend these terms at any time; continued use of the website following any change constitutes your acceptance of the revised terms.',
      },
      {
        heading: 'Intellectual Property',
        body: 'All content on this website — including but not limited to text, graphics, logos, images, audio clips, data compilations, and software — is the property of ROEX Audio Systems Ltd or its content suppliers and is protected by UK and international intellectual property laws. You may not reproduce, distribute, transmit, modify, or create derivative works from any content without our express written permission.',
      },
      {
        heading: 'Permitted Use',
        body: 'You may use this website for lawful purposes only. Permitted uses include browsing products, placing orders, and accessing support resources. You agree not to: (a) violate any applicable law or regulation; (b) transmit any unsolicited commercial communications; (c) introduce malware or interfere with website operation; (d) attempt to gain unauthorised access to systems or data; (e) scrape, harvest, or extract data from the website by automated means.',
      },
      {
        heading: 'User Accounts',
        body: 'If you create an account on our website, you are responsible for maintaining the confidentiality of your credentials and for all activities occurring under your account. You agree to notify ROEX immediately of any unauthorised use of your account. ROEX reserves the right to suspend or terminate accounts at its discretion.',
      },
      {
        heading: 'Third-Party Links',
        body: 'Our website may contain links to third-party websites for your convenience or information. These links do not constitute an endorsement of those sites. ROEX has no control over and accepts no responsibility for the content, privacy practices, or availability of third-party websites.',
      },
      {
        heading: 'Disclaimer of Warranties',
        body: 'The website and its content are provided on an "as is" basis without warranties of any kind, either express or implied. ROEX does not warrant that the website will be uninterrupted, error-free, or free of viruses or other harmful components.',
      },
      {
        heading: 'Limitation of Liability',
        body: "To the fullest extent permitted by law, ROEX shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the website or its content. ROEX's total liability to you for any direct damages shall not exceed £100.",
      },
      {
        heading: 'Governing Law',
        body: 'These Terms of Use are governed by the laws of Scotland, United Kingdom. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the Scottish courts.',
      },
    ],
  },
]

export function PoliciesClient() {
  const [activeSection, setActiveSection] = useState<string>(sections[0]!.id)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  // Sync active nav with scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)
      const scrollY = window.scrollY + 140
      let current = sections[0]!.id
      for (const section of sections) {
        const el = sectionRefs.current[section.id]
        if (el && el.offsetTop <= scrollY) current = section.id
      }
      setActiveSection(current)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id]
    if (el) {
      const offset = 100
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <div className="bg-white">
      {/* ── HERO ── */}
      <section className="relative bg-[#0a0a0a] overflow-hidden">
        {/* grid overlay */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        <div className="relative max-w-[1800px] mx-auto px-6 lg:px-12 pt-32 pb-20 md:pt-40 md:pb-28">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40 mb-8"
          >
            <Link href="/" className="hover:text-white/70 transition-colors duration-300">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 opacity-40" />
            <span className="text-white/70">Legal &amp; Policies</span>
          </motion.nav>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold font-montserrat text-white leading-[1.05] tracking-tight max-w-2xl"
          >
            Legal &amp;
            <br />
            <span className="text-white/50">Policies</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-[15px] text-white/45 font-light max-w-xl leading-relaxed"
          >
            Everything you need to know about how ROEX operates — from shipping and returns to your
            privacy rights and terms of business.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-5 text-[11px] uppercase tracking-[0.18em] text-white/25 font-light"
          >
            Last updated: {LAST_UPDATED}
          </motion.p>

          {/* Quick-nav pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-wrap gap-2.5"
          >
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                aria-label={`Jump to ${s.label}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-white/10 hover:border-white/30 text-[10px] uppercase tracking-[0.16em] text-white/40 hover:text-white/80 transition-all duration-400"
              >
                <s.icon className="h-3 w-3 opacity-70" />
                {s.label}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── BODY ── */}
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-16 md:py-24">
        <div className="lg:flex lg:gap-16 xl:gap-24">
          {/* ── STICKY SIDEBAR NAV ── */}
          <aside className="hidden lg:block w-56 xl:w-64 flex-shrink-0">
            <div className="sticky top-28">
              <p className="text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-5 font-medium">
                Contents
              </p>
              <nav aria-label="Policy sections">
                <ul className="space-y-0.5">
                  {sections.map((s) => {
                    const isActive = activeSection === s.id
                    return (
                      <li key={s.id}>
                        <button
                          onClick={() => scrollToSection(s.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-300 ${
                            isActive
                              ? 'bg-[#0a0a0a] text-white'
                              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          <s.icon
                            className={`h-3.5 w-3.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`}
                          />
                          <span className="text-[12px] font-medium leading-snug">{s.label}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </nav>

              <div className="mt-10 pt-8 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 font-light leading-relaxed">
                  Questions? Contact us at{' '}
                  <a
                    href="mailto:support@roexaudios.com"
                    className="text-gray-700 underline hover:text-black"
                  >
                    support@roexaudios.com
                  </a>
                </p>
              </div>
            </div>
          </aside>

          {/* ── POLICY CONTENT ── */}
          <div className="flex-1 min-w-0">
            {/* Mobile section picker */}
            <div className="lg:hidden mb-10 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 border text-[11px] font-medium transition-all duration-300 ${
                    activeSection === s.id
                      ? 'bg-[#0a0a0a] border-[#0a0a0a] text-white'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  <s.icon className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{s.label}</span>
                </button>
              ))}
            </div>

            {sections.map((section, sIdx) => (
              <motion.section
                key={section.id}
                id={section.id}
                ref={(el) => {
                  sectionRefs.current[section.id] = el
                }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className={`${sIdx > 0 ? 'mt-16 pt-16 border-t border-gray-100' : ''}`}
              >
                {/* Section header */}
                <div className="flex items-start gap-4 mb-10">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#0a0a0a] flex items-center justify-center">
                    <section.icon
                      className="h-4.5 w-4.5 text-white"
                      style={{ width: 18, height: 18 }}
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold font-montserrat text-gray-900 leading-tight">
                      {section.label}
                    </h2>
                    <p className="text-[11px] text-gray-400 uppercase tracking-[0.18em] mt-1 font-light">
                      Effective: {LAST_UPDATED}
                    </p>
                  </div>
                </div>

                {/* Sub-sections */}
                <div className="space-y-8 pl-0 sm:pl-14">
                  {section.content.map((item, iIdx) => (
                    <div key={iIdx}>
                      <h3 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-gray-900 mb-2.5">
                        {String(iIdx + 1).padStart(2, '0')}. {item.heading}
                      </h3>
                      <p className="text-[14px] text-gray-600 leading-[1.8] font-light">
                        {item.body}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.section>
            ))}

            {/* Contact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-20 bg-[#0a0a0a] p-10 sm:p-14"
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
                  backgroundSize: '80px 80px',
                }}
              />
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-5 font-medium">
                Need assistance?
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold font-montserrat text-white mb-4 leading-tight">
                Questions about our policies?
              </h3>
              <p className="text-[14px] text-white/50 font-light leading-relaxed max-w-xl mb-8">
                Our team is happy to clarify anything covered on this page. Reach out via email or
                visit our contact page for full support options.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white text-[#0a0a0a] px-7 py-3 text-[11px] uppercase tracking-[0.18em] font-semibold hover:bg-white/90 transition-colors duration-300"
                >
                  Contact Us
                </Link>
                <a
                  href="mailto:support@roexaudios.com"
                  className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/40 hover:text-white font-light transition-colors duration-300"
                >
                  support@roexaudios.com
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── BACK TO TOP ── */}
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-8 right-8 z-50 w-10 h-10 bg-[#0a0a0a] text-white flex items-center justify-center hover:bg-black/80 transition-colors duration-300 shadow-lg"
        >
          <ArrowUp className="h-4 w-4" />
        </motion.button>
      )}
    </div>
  )
}

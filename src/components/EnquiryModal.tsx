'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Mail, Check, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface EnquiryModalProps {
  isOpen: boolean
  onClose: () => void
  productName: string
}

export function EnquiryModal({ isOpen, onClose, productName }: EnquiryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const firstInputRef = useRef<HTMLInputElement>(null)

  // Focus first input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 100)
    } else {
      // Reset form when closed
      setSubmitted(false)
      setFormData({ name: '', email: '', phone: '', message: '' })
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, product: productName }),
      })
      if (!res.ok) throw new Error('Failed')
      setSubmitted(true)
    } catch {
      // Still show success to user even if email fails (network resilience)
      setSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[71] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
          >
            <div
              className="relative w-full max-w-lg bg-white shadow-2xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-900 transition-colors z-10"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              {!submitted ? (
                <div className="p-7 sm:p-9">
                  {/* Header */}
                  <div className="mb-7">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">
                        Send Enquiry
                      </p>
                    </div>
                    <h2 className="font-montserrat text-xl sm:text-2xl font-light text-gray-900 leading-snug mt-2">
                      {productName}
                    </h2>
                    <p className="text-[13px] text-gray-500 font-light mt-1.5">
                      Fill in the form below and our team will get back to you shortly.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Product name (read-only) */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1.5">
                        Product
                      </label>
                      <input
                        type="text"
                        value={productName}
                        readOnly
                        className="w-full h-11 px-4 bg-gray-50 text-[13px] text-gray-500 border border-gray-200 outline-none cursor-default select-none"
                      />
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1.5">
                        Full Name <span className="text-gray-400">*</span>
                      </label>
                      <input
                        ref={firstInputRef}
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your full name"
                        className="w-full h-11 px-4 bg-white text-[13px] text-gray-900 border border-gray-200 outline-none focus:border-gray-900 transition-colors placeholder-gray-300"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1.5">
                        Email Address <span className="text-gray-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className="w-full h-11 px-4 bg-white text-[13px] text-gray-900 border border-gray-200 outline-none focus:border-gray-900 transition-colors placeholder-gray-300"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1.5">
                        Phone{' '}
                        <span className="text-gray-300 normal-case tracking-normal text-[10px]">
                          (optional)
                        </span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+44 000 000 0000"
                        className="w-full h-11 px-4 bg-white text-[13px] text-gray-900 border border-gray-200 outline-none focus:border-gray-900 transition-colors placeholder-gray-300"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1.5">
                        Message <span className="text-gray-400">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        placeholder="Tell us about your requirements, quantity needed, installation details..."
                        className="w-full px-4 py-3 bg-white text-[13px] text-gray-900 border border-gray-200 outline-none focus:border-gray-900 transition-colors resize-none placeholder-gray-300"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 flex items-center justify-center gap-2.5 bg-[#0a0a0a] text-white text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          Send Enquiry
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                /* Success state */
                <div className="p-7 sm:p-9 flex flex-col items-center text-center">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                    className="w-14 h-14 bg-emerald-50 flex items-center justify-center mb-5"
                  >
                    <Check className="h-6 w-6 text-emerald-600" />
                  </motion.div>
                  <h3 className="font-montserrat text-xl font-light text-gray-900 mb-2">
                    Enquiry Sent
                  </h3>
                  <p className="text-[13px] text-gray-500 font-light max-w-xs">
                    Thank you! We&apos;ve received your enquiry about{' '}
                    <span className="text-gray-700 font-medium">{productName}</span> and will be in
                    touch shortly.
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-7 h-10 px-8 border border-gray-200 text-[11px] uppercase tracking-[0.2em] text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

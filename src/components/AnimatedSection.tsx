'use client'

import React, { ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'

/* Premium easing curve – smooth luxury feel like Dubai Audio */
const premiumEase = [0.22, 1, 0.36, 1] as const

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: premiumEase } },
}

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: premiumEase } },
}

const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: premiumEase } },
}

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: premiumEase } },
}

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.9, ease: premiumEase } },
}

const revealUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: premiumEase } },
}

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

const staggerItemVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: premiumEase } },
}

const variantMap = {
  'fade-up': fadeInUp,
  'fade-in': fadeIn,
  'fade-left': fadeInLeft,
  'fade-right': fadeInRight,
  'scale-in': scaleIn,
  'reveal-up': revealUp,
  stagger: staggerContainer,
}

interface AnimatedSectionProps {
  children: ReactNode
  variant?: keyof typeof variantMap
  className?: string
  delay?: number
}

export function AnimatedSection({
  children,
  variant = 'fade-up',
  className,
  delay = 0,
}: AnimatedSectionProps) {
  const selectedVariant = variantMap[variant]

  return (
    <motion.div
      variants={selectedVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedItemProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function AnimatedItem({ children, className, delay = 0 }: AnimatedItemProps) {
  return (
    <motion.div variants={fadeInUp} transition={{ delay }} className={className}>
      {children}
    </motion.div>
  )
}

// Animated text reveal for headings — dramatic entrance
export function AnimatedText({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Animated image with premium parallax-like hover
export function AnimatedImage({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger wrapper for grids — Dubai Audio style cascading reveal
export function StaggerGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={staggerItemVariant} className={className}>
      {children}
    </motion.div>
  )
}

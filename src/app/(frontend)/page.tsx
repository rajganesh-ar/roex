'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import ShaderBackground from '@/components/ui/shader-background'
import './globals.css'

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Shader Background */}
      <ShaderBackground />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" style={{ zIndex: 1 }} />
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          {/* Replace this with your SVG logo */}
          <div className="w-48 h-48 md:w-64 md:h-64 mx-auto mb-8">
            {/* Uncomment when you add your logo to /public/logo.svg */}
            { <Image
              src="/logo.svg"
              alt="Roex Logo"
              width={256}
              height={256}
              className="w-full h-full"
              priority
            /> }
            
            
          </div>
        </motion.div>

        {/* Coming Soon Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-poppins text-4xl md:text-6xl font-semibold text-white mb-6 drop-shadow-lg tracking-tight">
            Coming Soon
          </h2>
          <p className="font-inter text-lg md:text-xl text-white/90 max-w-lg mx-auto drop-shadow-lg leading-relaxed font-light">
            Something extraordinary is on the horizon. Stay tuned for the future of innovation.
          </p>
        </motion.div>

        {/* Animated Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-12 flex justify-center gap-3"
        >
          {[0, 0.2, 0.4].map((delay, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay,
              }}
              className="w-3 h-3 rounded-full bg-white/60"
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

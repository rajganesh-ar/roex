'use client'

import { cn } from '@/lib/utils'
import React from 'react'

interface IslandProps {
  children: React.ReactNode
  className?: string
  glow?: boolean
  as?: 'div' | 'section' | 'article' | 'aside'
}

export function Island({ children, className, glow = false, as: Component = 'div' }: IslandProps) {
  return (
    <Component
      className={cn(
        'relative rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm p-6 md:p-8 shadow-sm',
        glow && 'shadow-lg shadow-secondary/10',
        className
      )}
    >
      {children}
    </Component>
  )
}

interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function Container({ children, className, size = 'xl' }: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-4xl',
    md: 'max-w-6xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[1400px]',
    full: 'max-w-full',
  }

  return (
    <div className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', sizeClasses[size], className)}>
      {children}
    </div>
  )
}

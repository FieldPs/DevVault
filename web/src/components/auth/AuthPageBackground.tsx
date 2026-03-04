import type { ReactNode } from 'react'

/**
 * Wraps page-specific animated orbs and appends the shared subtle grid overlay.
 * Pass each page's custom orb `<div>`s as `children`.
 */
interface AuthPageBackgroundProps {
  children: ReactNode
}

export function AuthPageBackground({ children }: AuthPageBackgroundProps) {
  return (
    <div className="pointer-events-none select-none" aria-hidden="true">
      {children}
      {/* Shared subtle grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  )
}

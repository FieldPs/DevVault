/** Logo icon gradient — differs slightly between login and register pages. */
const LOGO_GRADIENT: Record<'login' | 'register', string> = {
  login: 'linear-gradient(135deg, rgba(59,130,246,0.25) 0%, rgba(139,92,246,0.25) 100%)',
  register: 'linear-gradient(135deg, rgba(139,92,246,0.25) 0%, rgba(59,130,246,0.25) 100%)',
}

interface BrandHeaderProps {
  variant: 'login' | 'register'
  subtitle: string
  /** When true, applies the `animate-fade-in-up` class to the wrapper. */
  animated?: boolean
}

export function BrandHeader({ variant, subtitle, animated = false }: BrandHeaderProps) {
  return (
    <div className={`mb-8 text-center${animated ? ' animate-fade-in-up' : ''}`}>
      <div className="mb-4 inline-flex items-center justify-center">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
          style={{
            background: LOGO_GRADIENT[variant],
            border: '1px solid rgba(139,92,246,0.3)',
            boxShadow: '0 0 24px rgba(139,92,246,0.2)',
          }}
        >
          🗄️
        </div>
      </div>
      <h1 className="shimmer-text text-4xl font-extrabold tracking-tight">DevVault</h1>
      <p className="mt-2 text-sm font-medium text-gray-400">{subtitle}</p>
    </div>
  )
}

interface BrandHeaderProps {
  subtitle?: string
  animated?: boolean
}

export function BrandHeader({ subtitle = 'Welcome back', animated = false }: BrandHeaderProps) {
  return (
    <div className={`mb-8 text-center${animated ? ' animate-fade-in-up' : ''}`}>
      <div className="mb-4 inline-flex items-center justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-purple-500/25 text-2xl">
          🗄️
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            DevVault
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-gray-400">{subtitle}</p>
    </div>
  )
}

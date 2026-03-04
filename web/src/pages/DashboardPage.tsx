import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import { FileCode2, Component, Star, Plus } from 'lucide-react'

export default function DashboardPage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  /** Derive avatar initial from username or email */
  const avatarInitial = (user?.username ?? user?.email ?? '?')[0].toUpperCase()

  return (
    <div className="page-bg min-h-screen">

      {/* ── Ambient background orbs (dashboard) ── */}
      <div className="pointer-events-none select-none" aria-hidden="true">
        <div
          className="blob-1 absolute rounded-full"
          style={{
            top: '-8%',
            left: '-6%',
            width: '550px',
            height: '550px',
            background: 'radial-gradient(circle at center, rgba(59,130,246,0.22) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="blob-2 absolute rounded-full"
          style={{
            bottom: '-5%',
            right: '-4%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle at center, rgba(139,92,246,0.2) 0%, transparent 70%)',
            filter: 'blur(75px)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* ── Top Navbar ── */}
      <header className="glass-nav sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.3) 0%, rgba(139,92,246,0.3) 100%)',
                border: '1px solid rgba(139,92,246,0.25)',
              }}
            >
              🗄️
            </div>
            <span className="shimmer-text text-xl font-extrabold tracking-tight">
              DevVault
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">

            {/* User badge */}
            <div
              className="flex items-center gap-2.5 rounded-xl px-3 py-1.5"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* Avatar */}
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  boxShadow: '0 0 8px rgba(139,92,246,0.4)',
                }}
              >
                {avatarInitial}
              </div>
              <span className="hidden text-sm font-medium text-gray-300 sm:block">
                {user?.username ?? user?.email}
              </span>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-400 transition-all hover:border-red-500/40 hover:bg-red-500/20 hover:text-red-300"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10">

        {/* Page header */}
        <div className="animate-fade-in-up mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              My Snippets
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage and organize your code snippets
            </p>
          </div>
          {/* New Snippet button — placeholder for Chunk 2 */}
          <button
            disabled
            className="gradient-btn flex cursor-not-allowed items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white opacity-50"
            title="Coming in next update"
          >
            <Plus className="h-4 w-4" />
            New Snippet
          </button>
        </div>

        {/* Stats strip */}
        <div className="animate-fade-in-up-delay mb-8 grid grid-cols-3 gap-4">
          {[
            { label: 'Total Snippets', value: '0', icon: <FileCode2 className="w-5 h-5 text-blue-400" /> },
            { label: 'Components',     value: '0', icon: <Component className="w-5 h-5 text-purple-400" /> },
            { label: 'Favorites',      value: '0', icon: <Star className="w-5 h-5 text-yellow-400" /> },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass-card rounded-2xl px-5 py-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className="p-2 rounded-lg bg-white/5">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        <div
          className="glass-card animate-fade-in-up rounded-2xl"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="flex flex-col items-center justify-center px-8 py-20 text-center">

            {/* Animated icon container */}
            <div
              className="blob-pulse mb-6 flex h-24 w-24 items-center justify-center rounded-3xl"
              style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.15) 100%)',
                border: '1px solid rgba(139,92,246,0.2)',
                boxShadow: '0 0 32px rgba(139,92,246,0.1)',
              }}
            >
              {/* Code brackets SVG */}
              <svg
                className="h-12 w-12"
                fill="none"
                stroke="url(#codeGrad)"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <defs>
                  <linearGradient id="codeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
              </svg>
            </div>

            <h3 className="mb-2 text-xl font-bold text-white">
              No snippets yet
            </h3>
            <p className="mb-2 max-w-sm text-sm leading-relaxed text-gray-500">
              Your code vault is empty. Start collecting your favourite snippets — from bash one-liners to full utility functions.
            </p>
            <p className="text-xs text-gray-600">
              Snippet management coming in the next update ✨
            </p>

            {/* Decorative code lines */}
            <div
              className="mt-10 w-full max-w-sm rounded-xl px-5 py-4 text-left"
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div className="mb-2 flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/60"   />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60"/>
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
                <span className="ml-2 text-xs text-gray-600 font-mono">snippet.ts</span>
              </div>
              <div className="space-y-1.5 font-mono text-xs">
                <p><span className="text-purple-400">const</span> <span className="text-blue-400">vault</span> <span className="text-gray-500">= </span><span className="text-green-400">"DevVault"</span></p>
                <p><span className="text-purple-400">const</span> <span className="text-blue-400">snippets</span> <span className="text-gray-500">= []  </span><span className="text-gray-600">// your code here</span></p>
                <p><span className="text-yellow-400">console</span><span className="text-gray-400">.log(</span><span className="text-green-400">"Ready to build! 🚀"</span><span className="text-gray-400">)</span></p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

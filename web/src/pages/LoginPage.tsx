import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@heroui/react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-bg flex items-center justify-center min-h-screen px-4">

      {/* ── Animated background orbs ── */}
      <div className="pointer-events-none select-none" aria-hidden="true">
        {/* Blue orb — top left */}
        <div
          className="blob-1 absolute rounded-full"
          style={{
            top: '8%',
            left: '-4%',
            width: '480px',
            height: '480px',
            background: 'radial-gradient(circle at center, rgba(59,130,246,0.45) 0%, rgba(37,99,235,0.2) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Purple orb — bottom right */}
        <div
          className="blob-2 absolute rounded-full"
          style={{
            bottom: '5%',
            right: '-6%',
            width: '520px',
            height: '520px',
            background: 'radial-gradient(circle at center, rgba(139,92,246,0.4) 0%, rgba(109,40,217,0.18) 45%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />
        {/* Pink accent orb — top right */}
        <div
          className="blob-3 absolute rounded-full"
          style={{
            top: '20%',
            right: '10%',
            width: '280px',
            height: '280px',
            background: 'radial-gradient(circle at center, rgba(244,114,182,0.25) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* ── Glassmorphism Card ── */}
      <div
        className="glass-card animate-fade-in-up relative z-10 w-full max-w-[420px] rounded-2xl p-8"
      >
        {/* Logo */}
        <div className="mb-8 text-center animate-fade-in-up">
          <div className="mb-4 inline-flex items-center justify-center">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
              style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.25) 0%, rgba(139,92,246,0.25) 100%)',
                border: '1px solid rgba(139,92,246,0.3)',
                boxShadow: '0 0 24px rgba(139,92,246,0.2)',
              }}
            >
              🗄️
            </div>
          </div>
          <h1 className="shimmer-text text-4xl font-extrabold tracking-tight">
            DevVault
          </h1>
          <p className="mt-2 text-sm font-medium text-gray-400">
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-fade-in-up-delay">
          <div className="input-glass">
            <Input
              label="Email"
              type="email"
              value={email}
              onValueChange={setEmail}
              variant="bordered"
              isRequired
              classNames={{
                label: 'text-gray-400 text-sm font-medium',
                inputWrapper:
                  'bg-white/5 border-white/10 hover:border-white/20 data-[focus=true]:border-purple-500/60 data-[focus=true]:bg-purple-500/5 transition-all duration-200 rounded-xl h-12',
                input: 'text-white placeholder:text-gray-600 text-sm bg-transparent',
              }}
            />
          </div>

          <div className="input-glass">
            <Input
              label="Password"
              type="password"
              value={password}
              onValueChange={setPassword}
              variant="bordered"
              isRequired
              classNames={{
                label: 'text-gray-400 text-sm font-medium',
                inputWrapper:
                  'bg-white/5 border-white/10 hover:border-white/20 data-[focus=true]:border-purple-500/60 data-[focus=true]:bg-purple-500/5 transition-all duration-200 rounded-xl h-12',
                input: 'text-white placeholder:text-gray-600 text-sm bg-transparent',
              }}
            />
          </div>

          {/* Error message */}
          {error && (
            <div
              className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 animate-fade-in"
            >
              <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="gradient-btn relative mt-2 w-full rounded-xl py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </>
              )}
            </span>
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/8" />
          <span className="text-xs text-gray-600">or</span>
          <div className="h-px flex-1 bg-white/8" />
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-purple-400 transition-colors hover:text-purple-300 hover:underline underline-offset-2"
          >
            Create one free →
          </Link>
        </p>
      </div>
    </div>
  )
}

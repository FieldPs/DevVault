import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@heroui/react'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(username, email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-bg flex items-center justify-center min-h-screen px-4 py-10">

      {/* ── Animated background orbs ── */}
      <div className="pointer-events-none select-none" aria-hidden="true">
        {/* Purple orb — top right */}
        <div
          className="blob-2 absolute rounded-full"
          style={{
            top: '-5%',
            right: '-4%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle at center, rgba(139,92,246,0.42) 0%, rgba(109,40,217,0.18) 45%, transparent 70%)',
            filter: 'blur(65px)',
          }}
        />
        {/* Blue orb — bottom left */}
        <div
          className="blob-1 absolute rounded-full"
          style={{
            bottom: '0%',
            left: '-5%',
            width: '460px',
            height: '460px',
            background: 'radial-gradient(circle at center, rgba(59,130,246,0.4) 0%, rgba(37,99,235,0.18) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Teal accent — center */}
        <div
          className="blob-3 absolute rounded-full"
          style={{
            top: '45%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle at center, rgba(20,184,166,0.15) 0%, transparent 70%)',
            filter: 'blur(55px)',
          }}
        />
        {/* Grid overlay */}
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
      <div className="glass-card animate-fade-in-up relative z-10 w-full max-w-[420px] rounded-2xl p-8">

        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
              style={{
                background: 'linear-gradient(135deg, rgba(139,92,246,0.25) 0%, rgba(59,130,246,0.25) 100%)',
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
            Create your free account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-fade-in-up-delay">

          {/* Username */}
          <div className="input-glass">
            <Input
              label="Username"
              value={username}
              onValueChange={setUsername}
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

          {/* Email */}
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

          {/* Password */}
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
            <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 animate-fade-in">
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
                  Creating account…
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Create Account
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

        {/* Password hint */}
        <p className="mb-4 text-center text-xs text-gray-600">
          🔐 Use a strong password with 8+ characters
        </p>

        {/* Footer link */}
        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-purple-400 transition-colors hover:text-purple-300 hover:underline underline-offset-2"
          >
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  )
}

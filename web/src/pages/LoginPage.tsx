import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AuthPageBackground } from '../components/auth/AuthPageBackground'
import { BrandHeader } from '../components/auth/BrandHeader'
import { FormInput } from '../components/auth/FormInput'
import { ErrorAlert } from '../components/auth/ErrorAlert'
import { SubmitButton } from '../components/auth/SubmitButton'
import { getApiErrorMessage } from '../utils/errorUtils'

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
    } catch (err) {
      setError(getApiErrorMessage(err, 'Login failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-bg flex items-center justify-center min-h-screen px-4">

      {/* ── Animated background orbs ── */}
      <AuthPageBackground>
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
      </AuthPageBackground>

      {/* ── Glassmorphism Card ── */}
      <div className="glass-card animate-fade-in-up relative z-10 w-full max-w-[420px] rounded-2xl p-8">
        <BrandHeader variant="login" subtitle="Sign in to your account" animated />

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-fade-in-up-delay">
          <FormInput label="Email" type="email" value={email} onValueChange={setEmail} />
          <FormInput label="Password" type="password" value={password} onValueChange={setPassword} />

          {error && <ErrorAlert message={error} />}

          <SubmitButton loading={loading} loadingText="Signing in…">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Sign In
          </SubmitButton>
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


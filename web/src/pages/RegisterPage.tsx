import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { AuthPageBackground } from '@/components/auth/AuthPageBackground'
import { BrandHeader } from '@/components/auth/BrandHeader'
import { FormInput } from '@/components/auth/FormInput'
import { ErrorAlert } from '@/components/auth/ErrorAlert'
import { SubmitButton } from '@/components/auth/SubmitButton'
import { parseError } from '@/utils/errorUtils'

export default function RegisterPage() {
  const { register } = useAuthStore()
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
    } catch (err) {
      setError(parseError(err, 'Registration failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-bg flex items-center justify-center min-h-screen px-4 py-10">

      {/* ── Animated background orbs ── */}
      <AuthPageBackground>
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
      </AuthPageBackground>

      {/* ── Glassmorphism Card ── */}
      <div className="glass-card animate-fade-in-up relative z-10 w-full max-w-[420px] rounded-2xl p-8">
        <BrandHeader variant="register" subtitle="Create your free account" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-fade-in-up-delay">
          <FormInput label="Username" value={username} onValueChange={setUsername} />
          <FormInput label="Email" type="email" value={email} onValueChange={setEmail} />
          <FormInput label="Password" type="password" value={password} onValueChange={setPassword} />

          {error && <ErrorAlert message={error} />}

          <SubmitButton loading={loading} loadingText="Creating account…">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Create Account
          </SubmitButton>
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


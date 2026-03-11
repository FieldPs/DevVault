import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { BrandHeader } from '@/components/auth/BrandHeader'
import { FormInput } from '@/components/auth/FormInput'
import { ErrorAlert } from '@/components/auth/ErrorAlert'
import { SubmitButton } from '@/components/auth/SubmitButton'
import { parseError } from '@/utils/errorUtils'

export default function LoginPage() {
  const { login } = useAuthStore()
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
      setError(parseError(err, 'Login failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[linear-gradient(135deg,#0a0a0f_0%,#0d1117_50%,#0a0f1a_100%)] flex items-center justify-center min-h-screen relative overflow-clip px-4">

      {/* ── Glassmorphism Card ── */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)] animate-fade-in-up relative z-10 w-full max-w-[420px] rounded-2xl p-8">
        <BrandHeader subtitle="Sign in to your account" animated />

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


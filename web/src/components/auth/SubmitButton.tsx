import type { ReactNode } from 'react'

const Spinner = () => (
  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
)

interface SubmitButtonProps {
  loading: boolean
  /** Text shown while the form is submitting. */
  loadingText: string
  /** Icon + label rendered in the idle (non-loading) state. */
  children: ReactNode
  /** Whether the button is disabled. */
  disabled?: boolean
  /** Additional CSS classes for the button. */
  className?: string
}

export function SubmitButton({ loading, loadingText, children, disabled = false, className = '' }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={`bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 active:translate-y-0 hover:-translate-y-px transition-all shadow-[0_0_24px_rgba(139,92,246,0.45),0_4px_16px_rgba(59,130,246,0.3)] w-full rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-50 ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <Spinner />
            {loadingText}
          </>
        ) : (
          children
        )}
      </span>
    </button>
  )
}

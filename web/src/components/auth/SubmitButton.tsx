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
}

export function SubmitButton({ loading, loadingText, children }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="gradient-btn relative mt-2 w-full rounded-xl py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
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

export default function ComponentEmptyState() {
  return (
    <div
      className="glass-card animate-fade-in-up rounded-2xl"
      style={{ animationDelay: '0.2s' }}
    >
      <div className="flex flex-col items-center justify-center px-8 py-20 text-center">

        <div
          className="blob-pulse mb-6 flex h-24 w-24 items-center justify-center rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.15) 100%)',
            border: '1px solid rgba(139,92,246,0.2)',
            boxShadow: '0 0 32px rgba(139,92,246,0.1)',
          }}
        >
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

        <h3 className="mb-2 text-xl font-bold text-white">No components yet</h3>
        <p className="mb-2 max-w-sm text-sm leading-relaxed text-gray-500">
          Your component vault is empty. Start saving your favourite React components — from simple buttons to full UI patterns.
        </p>

        <div
          className="mt-10 w-full max-w-sm rounded-xl px-5 py-4 text-left"
          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="mb-2 flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
            <span className="ml-2 text-xs text-gray-600 font-mono">MyButton.tsx</span>
          </div>
          <div className="space-y-1.5 font-mono text-xs">
            <p><span className="text-purple-400">export default function</span> <span className="text-blue-400">MyButton</span><span className="text-gray-400">()</span> {'{'}</p>
            <p className="pl-4"><span className="text-purple-400">return</span> <span className="text-gray-400">&lt;</span><span className="text-green-400">button</span><span className="text-gray-400">&gt;</span><span className="text-white">Click me</span><span className="text-gray-400">&lt;/</span><span className="text-green-400">button</span><span className="text-gray-400">&gt;</span></p>
            <p>{'}'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const avatarInitial = (user?.username ?? user?.email ?? '?')[0].toUpperCase()

  return (
    <header className="bg-[#0a0a0f]/70 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.4)] sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl text-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-purple-500/20">
            🗄️
          </div>
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent text-xl font-extrabold tracking-tight mt-0.5">DevVault</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 bg-white/5 border border-white/10">
            <div className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white bg-gradient-to-br from-blue-500 to-purple-500 shadow-sm shadow-purple-500/40">
              {avatarInitial}
            </div>
            <span className="hidden text-sm font-medium text-gray-300 sm:block">
              {user?.username ?? user?.email}
            </span>
          </div>

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
  )
}

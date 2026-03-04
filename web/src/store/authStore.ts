import { create } from 'zustand'
import api from '../lib/api'
import type { User } from '../types/auth'

// ---------------------------------------------------------------------------
// Shape
// ---------------------------------------------------------------------------

interface AuthState {
  user: User | null
  loading: boolean

  // Actions
  login:    (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout:   () => Promise<void>
  /** Rehydrates the authenticated user from the server (call once on app mount) */
  fetchMe:  () => Promise<void>
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useAuthStore = create<AuthState>((set) => ({
  user:    null,
  loading: true,

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    set({ user: res.data.user })
  },

  register: async (username, email, password) => {
    const res = await api.post('/auth/register', { username, email, password })
    set({ user: res.data.user })
  },

  logout: async () => {
    await api.post('/auth/logout')
    set({ user: null })
  },

  fetchMe: async () => {
    set({ loading: true })
    try {
      const res = await api.get('/auth/me')
      set({ user: res.data.user, loading: false })
    } catch {
      set({ user: null, loading: false })
    }
  },
}))

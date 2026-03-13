import { create } from 'zustand'
import api from '@/lib/api'
import type { FollowUser, FollowStatus } from '@/types/follow'

// ---------------------------------------------------------------------------
// Shape
// ---------------------------------------------------------------------------

interface SocialState {
  following: FollowUser[]
  followers: FollowUser[]
  friends: FollowUser[]
  loading: boolean
  error: string | null

  // Actions
  followUser: (userId: string) => Promise<void>
  unfollowUser: (userId: string) => Promise<void>
  fetchFollowing: () => Promise<void>
  fetchFollowers: () => Promise<void>
  fetchFriends: () => Promise<void>
  getFollowStatus: (userId: string) => Promise<FollowStatus>
  clearError: () => void
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useSocialStore = create<SocialState>((set) => ({
  following: [],
  followers: [],
  friends: [],
  loading: false,
  error: null,

  followUser: async (userId) => {
    set({ loading: true, error: null })
    try {
      await api.post(`/social/follow/${userId}`)
      set({ loading: false })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to follow user'
      set({ error: message, loading: false })
      throw err
    }
  },

  unfollowUser: async (userId) => {
    set({ loading: true, error: null })
    try {
      await api.delete(`/social/unfollow/${userId}`)
      set({ loading: false })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to unfollow user'
      set({ error: message, loading: false })
      throw err
    }
  },

  fetchFollowing: async () => {
    set({ loading: true, error: null })
    try {
      const res = await api.get('/social/following')
      set({ following: res.data.following, loading: false })
    } catch {
      set({ error: 'Failed to fetch following list', loading: false })
    }
  },

  fetchFollowers: async () => {
    set({ loading: true, error: null })
    try {
      const res = await api.get('/social/followers')
      set({ followers: res.data.followers, loading: false })
    } catch {
      set({ error: 'Failed to fetch followers list', loading: false })
    }
  },

  fetchFriends: async () => {
    set({ loading: true, error: null })
    try {
      const res = await api.get('/social/friends')
      set({ friends: res.data.friends, loading: false })
    } catch {
      set({ error: 'Failed to fetch friends list', loading: false })
    }
  },

  getFollowStatus: async (userId) => {
    try {
      const res = await api.get(`/social/status/${userId}`)
      return res.data as FollowStatus
    } catch {
      return { isFollowing: false, isFollowedBy: false, isFriend: false }
    }
  },

  clearError: () => set({ error: null }),
}))

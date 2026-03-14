import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardHeader, CardBody, Divider, Spinner } from '@heroui/react'
import Navbar from '@/components/layout/Navbar'
import { FollowButton } from '@/components/social/FollowButton'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import type { Component } from '@/types/component'
import type { UserProfile } from '@/types/follow'

interface UserProfileResponse {
  user: UserProfile
  components: Component[]
}

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>()
  const { user: currentUser } = useAuthStore()
  const [profile, setProfile] = useState<UserProfileResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isOwnProfile = currentUser?.username === username

  useEffect(() => {
    if (!username) return

    let active = true
    // Defer setState to avoid synchronous setState in effect
    const timeoutId = setTimeout(() => {
      setLoading(true)
      setError('')
    }, 0)

    api
      .get(`/components/user/${username}`)
      .then((res) => {
        if (!active) return
        setProfile(res.data as UserProfileResponse)
      })
      .catch(() => {
        if (!active) return
        setError('User not found or failed to load profile')
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
      clearTimeout(timeoutId)
    }
  }, [username])

  return (
    <div className="relative min-h-screen overflow-clip bg-gradient-to-br from-[#0a0a0f] via-[#0d1117] to-[#0a0f1a]">
      <Navbar />

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" color="primary" />
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-10 text-center text-sm text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && profile && (
          <>
            {/* Profile Header */}
            <Card className="mb-8 border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader className="flex items-center justify-between px-6 py-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">{profile.user.username}</h1>
                  <p className="mt-1 text-sm text-gray-400">
                    {profile.components.length} public component{profile.components.length !== 1 ? 's' : ''}
                  </p>
                </div>
                {!isOwnProfile && currentUser && (
                  <FollowButton targetUserId={profile.user._id} />
                )}
                {isOwnProfile && (
                  <Link
                    to="/dashboard"
                    className="rounded-lg border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-300 transition-colors hover:bg-purple-500/20"
                  >
                    Go to Dashboard
                  </Link>
                )}
              </CardHeader>
              <Divider className="bg-white/10" />
              <CardBody className="px-6 py-4">
                <div className="flex gap-6 text-sm text-gray-400">
                  <span>Member since {profile.user.createdAt ? new Date(profile.user.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              </CardBody>
            </Card>

            {/* Components Grid */}
            <h2 className="mb-4 text-xl font-semibold text-white">Public Components</h2>

            {profile.components.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-sm text-gray-400">
                No public components yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {profile.components.map((component) => (
                  <article
                    key={component._id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <h3 className="truncate text-base font-semibold text-white">
                      {component.title}
                    </h3>
                    {component.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-gray-400">
                        {component.description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <span className="rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-blue-300">
                        {component.language}
                      </span>
                      <span className="rounded-md border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-green-300">
                        {component.template}
                      </span>
                    </div>
                    <Link
                      to={`/c/${component._id}`}
                      className="mt-4 inline-flex rounded-lg border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-300 transition-colors hover:bg-purple-500/20"
                    >
                      View Component
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

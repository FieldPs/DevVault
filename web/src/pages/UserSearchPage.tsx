import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Input, Card, CardBody, Spinner, Avatar } from '@heroui/react'
import Navbar from '@/components/layout/Navbar'
import { FollowButton } from '@/components/social/FollowButton'
import { useSocialStore } from '@/store/socialStore'
import { useAuthStore } from '@/store/authStore'
import type { FollowUser } from '@/types/follow'

export default function UserSearchPage() {
  const { searchResults, loading, searchUsers, clearSearchResults } = useSocialStore()
  const { user: currentUser } = useAuthStore()
  const [query, setQuery] = useState('')
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setSearched(true)
    await searchUsers(query.trim())
  }

  const handleClear = () => {
    setQuery('')
    setSearched(false)
    clearSearchResults()
  }

  return (
    <div className="relative min-h-screen overflow-clip bg-gradient-to-br from-[#0a0a0f] via-[#0d1117] to-[#0a0f1a]">
      <Navbar />

      <main className="relative z-10 mx-auto max-w-4xl px-6 py-10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Search Users</h2>
          <p className="mt-1 text-sm text-gray-500">
            Find and follow other developers
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Search by username..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              classNames={{
                input: 'text-white',
                inputWrapper: 'bg-white/5 border-white/10 data-[hover=true]:bg-white/10 data-[focus=true]:bg-white/10',
              }}
              className="flex-1"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="rounded-lg bg-purple-500 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            {searched && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Results */}
        {loading && (
          <div className="flex items-center justify-center py-10">
            <Spinner size="lg" color="primary" />
            <span className="ml-3 text-gray-400">Searching...</span>
          </div>
        )}

        {!loading && searched && searchResults.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-sm text-gray-400">
            No users found for "{query}". Try a different search term.
          </div>
        )}

        {!loading && !searched && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-sm text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto h-12 w-12 text-gray-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <p className="mt-4">Enter a username to search for users</p>
          </div>
        )}

        {!loading && searched && searchResults.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              Found {searchResults.length} user{searchResults.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 gap-4">
              {searchResults.map((user: FollowUser) => (
                <Card
                  key={user._id}
                  className="border border-white/10 bg-white/5 backdrop-blur-xl"
                >
                  <CardBody className="flex flex-row items-center justify-between gap-4 p-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={user.username}
                        className="flex-shrink-0"
                        size="lg"
                      />
                      <div>
                        <Link
                          to={`/u/${user.username}`}
                          className="text-lg font-semibold text-white hover:text-purple-300"
                        >
                          {user.username}
                        </Link>
                        {user.createdAt && (
                          <p className="text-xs text-gray-500">
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    {currentUser && user._id !== currentUser.id && (
                      <FollowButton targetUserId={user._id} />
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-8 flex gap-4">
          <Link
            to="/friends"
            className="inline-flex items-center gap-2 rounded-lg border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-300 transition-colors hover:bg-purple-500/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            View Friends
          </Link>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            Explore Components
          </Link>
        </div>
      </main>
    </div>
  )
}

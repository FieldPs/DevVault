import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Tabs, Tab, Card, CardBody, Spinner, Avatar } from '@heroui/react'
import Navbar from '@/components/layout/Navbar'
import { FollowButton } from '@/components/social/FollowButton'
import { useSocialStore } from '@/store/socialStore'
import { useAuthStore } from '@/store/authStore'
import type { FollowUser } from '@/types/follow'

export default function FriendsListPage() {
  const { following, followers, friends, loading, fetchFollowing, fetchFollowers, fetchFriends } = useSocialStore()
  const { user: currentUser } = useAuthStore()
  const [selectedTab, setSelectedTab] = useState<string>('following')

  useEffect(() => {
    if (selectedTab === 'following') {
      fetchFollowing()
    } else if (selectedTab === 'followers') {
      fetchFollowers()
    } else if (selectedTab === 'friends') {
      fetchFriends()
    }
  }, [selectedTab, fetchFollowing, fetchFollowers, fetchFriends])

  const renderUserList = (users: FollowUser[], emptyMessage: string) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-10">
          <Spinner size="lg" color="primary" />
        </div>
      )
    }

    if (users.length === 0) {
      return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-sm text-gray-400">
          {emptyMessage}
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card
            key={user._id}
            className="border border-white/10 bg-white/5 backdrop-blur-xl"
          >
            <CardBody className="flex flex-row items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                <Avatar
                  name={user.username}
                  className="flex-shrink-0"
                  size="md"
                />
                <div>
                  <Link
                    to={`/u/${user.username}`}
                    className="font-semibold text-white hover:text-purple-300"
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
    )
  }

  return (
    <div className="relative min-h-screen overflow-clip bg-gradient-to-br from-[#0a0a0f] via-[#0d1117] to-[#0a0f1a]">
      <Navbar />

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Friends</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your connections - following, followers, and friends
          </p>
        </div>

        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          classNames={{
            tabList: 'gap-2 bg-white/5 p-1 rounded-lg mb-4',
            tab: 'px-4 py-2 text-sm',
            cursor: 'bg-purple-500/20 text-purple-300',
            panel: 'mt-4',
          }}
        >
          <Tab key="following" title={`Following (${following.length})`}>
            {renderUserList(following, "You're not following anyone yet. Search for users to follow!")}
          </Tab>
          <Tab key="followers" title={`Followers (${followers.length})`}>
            {renderUserList(followers, 'No followers yet. Share your profile to get followers!')}
          </Tab>
          <Tab key="friends" title={`Friends (${friends.length})`}>
            {renderUserList(friends, 'No friends yet. Follow users who follow you back to become friends!')}
          </Tab>
        </Tabs>

        <div className="mt-6">
          <Link
            to="/search-users"
            className="inline-flex items-center gap-2 rounded-lg border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-300 transition-colors hover:bg-purple-500/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            Search Users
          </Link>
        </div>
      </main>
    </div>
  )
}

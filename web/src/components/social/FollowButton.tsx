import { useState, useEffect } from 'react'
import { Button } from '@heroui/react'
import { useSocialStore } from '@/store/socialStore'
import type { FollowStatus } from '@/types/follow'

interface FollowButtonProps {
  targetUserId: string
  onStatusChange?: (status: FollowStatus) => void
}

export function FollowButton({ targetUserId, onStatusChange }: FollowButtonProps) {
  const { followUser, unfollowUser, getFollowStatus, loading } = useSocialStore()
  const [status, setStatus] = useState<FollowStatus>({
    isFollowing: false,
    isFollowedBy: false,
    isFriend: false,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStatus = async () => {
      setIsLoading(true)
      const s = await getFollowStatus(targetUserId)
      setStatus(s)
      setIsLoading(false)
    }
    loadStatus()
  }, [targetUserId, getFollowStatus])

  const handleToggle = async () => {
    setIsLoading(true)
    try {
      if (status.isFollowing) {
        await unfollowUser(targetUserId)
        setStatus((prev) => ({
          ...prev,
          isFollowing: false,
          isFriend: false,
        }))
      } else {
        await followUser(targetUserId)
        setStatus((prev) => ({
          ...prev,
          isFollowing: true,
          isFriend: prev.isFollowedBy, // Friend if they already follow me
        }))
      }
      onStatusChange?.(status)
    } catch {
      // Error is handled by the store
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !status.isFollowing && !status.isFollowedBy) {
    return (
      <Button size="sm" variant="bordered" isDisabled>
        Loading...
      </Button>
    )
  }

  return (
    <Button
      size="sm"
      color={status.isFollowing ? 'default' : 'primary'}
      variant={status.isFollowing ? 'bordered' : 'solid'}
      onPress={handleToggle}
      isLoading={loading || isLoading}
    >
      {status.isFollowing ? 'Following' : 'Follow'}
    </Button>
  )
}

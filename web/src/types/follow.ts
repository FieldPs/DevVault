export interface FollowUser {
  _id: string
  username: string
  createdAt?: string
}

export interface FollowStatus {
  isFollowing: boolean
  isFollowedBy: boolean
  isFriend: boolean
}

export interface UserProfile {
  _id: string
  username: string
  createdAt?: string
}

import { Router, Response } from 'express'
import { Types } from 'mongoose'
import { Follow } from '../models/Follow'
import { User } from '../models/User'
import { verifyToken, AuthRequest } from '../middleware/auth'

const router = Router()

// Helper to get mutual followers (friends)
async function getMutualFriendIds(userId: string): Promise<Types.ObjectId[]> {
  // Get users I follow
  const following = await Follow.find({ followerId: userId }).select('followingId')
  const followingIds = following.map((f) => f.followingId)

  // Get users who follow me
  const followers = await Follow.find({ followingId: userId }).select('followerId')
  const followerIds = followers.map((f) => f.followerId)

  // Mutual = intersection
  const mutualIds = followingIds.filter((id) =>
    followerIds.some((fid) => fid.equals(id))
  )

  return mutualIds
}

// POST /social/follow/:userId — Follow a user
router.post(
  '/follow/:userId',
  verifyToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { userId } = req.params

    if (!Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Invalid user id' })
      return
    }

    if (userId === req.userId) {
      res.status(400).json({ message: 'Cannot follow yourself' })
      return
    }

    try {
      // Check if target user exists
      const targetUser = await User.findById(userId)
      if (!targetUser) {
        res.status(404).json({ message: 'User not found' })
        return
      }

      // Check if already following
      const existing = await Follow.findOne({
        followerId: req.userId,
        followingId: userId,
      })

      if (existing) {
        res.status(400).json({ message: 'Already following this user' })
        return
      }

      // Create follow relationship
      const follow = await Follow.create({
        followerId: req.userId,
        followingId: userId,
      })

      res.status(201).json({
        message: 'Successfully following user',
        follow,
      })
    } catch {
      res.status(500).json({ message: 'Internal server error' })
    }
  }
)

// DELETE /social/unfollow/:userId — Unfollow a user
router.delete(
  '/unfollow/:userId',
  verifyToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { userId } = req.params

    if (!Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Invalid user id' })
      return
    }

    try {
      const result = await Follow.findOneAndDelete({
        followerId: req.userId,
        followingId: userId,
      })

      if (!result) {
        res.status(404).json({ message: 'Follow relationship not found' })
        return
      }

      res.json({ message: 'Successfully unfollowed user' })
    } catch {
      res.status(500).json({ message: 'Internal server error' })
    }
  }
)

// GET /social/following — List users I follow
router.get(
  '/following',
  verifyToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const follows = await Follow.find({ followerId: req.userId })
        .populate('followingId', 'username createdAt')
        .sort({ createdAt: -1 })

      const following = follows
        .filter((f) => f.followingId)
        .map((f) => f.followingId)

      res.json({ following })
    } catch {
      res.status(500).json({ message: 'Internal server error' })
    }
  }
)

// GET /social/followers — List my followers
router.get(
  '/followers',
  verifyToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const follows = await Follow.find({ followingId: req.userId })
        .populate('followerId', 'username createdAt')
        .sort({ createdAt: -1 })

      const followers = follows
        .filter((f) => f.followerId)
        .map((f) => f.followerId)

      res.json({ followers })
    } catch {
      res.status(500).json({ message: 'Internal server error' })
    }
  }
)

// GET /social/friends — List mutual followers (friends)
router.get(
  '/friends',
  verifyToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const mutualIds = await getMutualFriendIds(req.userId!)

      const friends = await User.find({ _id: { $in: mutualIds } })
        .select('username createdAt')
        .sort({ username: 1 })

      res.json({ friends })
    } catch {
      res.status(500).json({ message: 'Internal server error' })
    }
  }
)

// GET /social/status/:userId — Check follow status with a user
router.get(
  '/status/:userId',
  verifyToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { userId } = req.params

    if (!Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Invalid user id' })
      return
    }

    try {
      // Check if I follow them
      const imFollowing = await Follow.findOne({
        followerId: req.userId,
        followingId: userId,
      })

      // Check if they follow me
      const theyFollowMe = await Follow.findOne({
        followerId: userId,
        followingId: req.userId,
      })

      res.json({
        isFollowing: !!imFollowing,
        isFollowedBy: !!theyFollowMe,
        isFriend: !!(imFollowing && theyFollowMe),
      })
    } catch {
      res.status(500).json({ message: 'Internal server error' })
    }
  }
)

// GET /social/search?q=username — Search users by username
router.get(
  '/search',
  verifyToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { q } = req.query

    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      res.status(400).json({ message: 'Search query is required' })
      return
    }

    try {
      const users = await User.find({
        username: { $regex: q.trim(), $options: 'i' },
        _id: { $ne: req.userId }, // Exclude current user
      })
        .select('_id username createdAt')
        .limit(20)
        .sort({ username: 1 })

      res.json({ users })
    } catch {
      res.status(500).json({ message: 'Internal server error' })
    }
  }
)

// Export helper for use in other routes
export { getMutualFriendIds }
export default router

import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import { verifyToken, AuthRequest } from '../middleware/auth'

const router = Router()

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}

// POST /auth/register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    res.status(400).json({ message: 'All fields are required' })
    return
  }

  try {
    const exists = await User.findOne({ $or: [{ email }, { username }] })
    if (exists) {
      res.status(409).json({ message: 'Email or username already taken' })
      return
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ username, email, passwordHash })

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || '', {
      expiresIn: '7d',
    })

    res.cookie('token', token, COOKIE_OPTIONS)
    res.status(201).json({ user: { id: user._id, username: user.username, email: user.email } })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' })
    return
  }

  try {
    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || '', {
      expiresIn: '7d',
    })

    res.cookie('token', token, COOKIE_OPTIONS)
    res.json({ user: { id: user._id, username: user.username, email: user.email } })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /auth/logout
router.post('/logout', (_req: Request, res: Response): void => {
  res.clearCookie('token')
  res.json({ message: 'Logged out' })
})

// GET /auth/me
router.get('/me', verifyToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash')
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }
    res.json({ user })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router

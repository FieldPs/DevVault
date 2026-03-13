import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  userId?: string
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // Try to get token from cookie first (for web), then from Authorization header (for mobile)
  let token = req.cookies?.token

  // If no cookie token, check Authorization header for Bearer token
  if (!token) {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7) // Remove 'Bearer ' prefix
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    req.userId = decoded.userId
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}

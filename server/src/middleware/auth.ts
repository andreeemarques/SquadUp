import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'

export interface AuthRequest extends Request {
  userId?: string
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'No authentication token provided' })
  }

  try {
    const payload = verifyToken(token)
    req.userId = payload.userId
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// It does not block the request if there is no token - it only populates `req.userId` when one is present.
export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (token) {
    try {
      const payload = verifyToken(token)
      req.userId = payload.userId
    } catch {
      // invalid token -> ignore, treat as a visitor without a session
    }
  }

  next()
}
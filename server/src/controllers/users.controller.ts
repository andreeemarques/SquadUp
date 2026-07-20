import { Response } from 'express'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middleware/auth'

export async function getProfile(req: AuthRequest, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, username: true, email: true, avatar: true, createdAt: true },
  })

  if (!user) return res.status(404).json({ error: 'Utilizador não encontrado' })
  res.json(user)
}
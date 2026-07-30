import { Response, Request } from 'express'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middleware/auth'
import { updateProfileSchema } from '../schemas/users.schema'

export async function getProfile(req: AuthRequest, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
      ubisoftId: true,
      platform: true,
      bio: true,
      preferredOperators: true,
      createdAt: true,
    },
  })

  if (!user) return res.status(404).json({ error: 'Utilizador não encontrado' })
  res.json(user)
}

export async function updateProfile(req: AuthRequest, res: Response) {
  const parsed = updateProfileSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message })
  }

  try {
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: parsed.data,
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        ubisoftId: true,
        platform: true,
        bio: true,
        preferredOperators: true,
        createdAt: true,
      },
    })
    res.json(user)
  } catch {
    res.status(409).json({ error: 'Username já em uso' })
  }
}

export async function getPublicProfile(req: Request, res: Response) {
  const username = req.params.username as string

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      avatar: true,
      platform: true,
      bio: true,
      preferredOperators: true,
      createdAt: true,
      // propositadamente sem: email, password, ubisoftId
    },
  })

  if (!user) return res.status(404).json({ error: 'Utilizador não encontrado' })
  res.json(user)
}
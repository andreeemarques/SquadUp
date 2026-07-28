import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middleware/auth'
import { createSquadSchema } from '../schemas/squad.schema'

export async function listSquads(req: AuthRequest, res: Response) {
  const { platform, region, rank, mode, language } = req.query

  const posts = await prisma.squadPost.findMany({
    where: {
      ...(platform && { platform: platform as any }),
      ...(region && { region: region as any }),
      ...(rank && { rank: rank as any }),
      ...(mode && { mode: mode as any }),
      ...(language && { language: language as any }),
    },
    include: { user: { select: { username: true, avatar: true } } },
    orderBy: { createdAt: 'desc' },
  })

  if (!req.userId) {
    return res.json(posts.map((p) => ({ ...p, requestStatus: null })))
  }

  const myRequests = await prisma.notification.findMany({
    where: {
      actorId: req.userId,
      squadPostId: { in: posts.map((p) => p.id) },
    },
    select: { squadPostId: true, status: true },
  })

  const statusByPostId = new Map(myRequests.map((r) => [r.squadPostId, r.status]))

  res.json(
    posts.map((p) => ({
      ...p,
      requestStatus: statusByPostId.get(p.id) ?? null,
    })),
  )
}

export async function createSquad(req: AuthRequest, res: Response) {
  const parsed = createSquadSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() })
  }

  const post = await prisma.squadPost.create({
    data: { ...parsed.data, userId: req.userId! },
  })

  res.status(201).json(post)
}

export async function joinSquad(req: AuthRequest, res: Response) {
  const id = req.params.id as string

  const post = await prisma.squadPost.findUnique({ where: { id } })
  if (!post) return res.status(404).json({ error: 'Squad post não encontrado' })

  if (post.userId === req.userId) {
    return res.status(400).json({ error: 'Não podes candidatar-te ao teu próprio post' })
  }

  const existing = await prisma.notification.findFirst({
    where: {
      squadPostId: post.id,
      actorId: req.userId,
      status: 'PENDING',
    },
  })

  if (existing) {
    return res.status(409).json({ error: 'Já tens um pedido pendente para este squad' })
  }

  await prisma.notification.create({
    data: {
      recipientId: post.userId,
      actorId: req.userId!,
      squadPostId: post.id,
      type: 'JOIN_REQUEST',
    },
  })

  res.status(201).json({ success: true })
}
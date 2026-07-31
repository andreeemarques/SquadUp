import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middleware/auth'
import { createSquadSchema, updateSquadSchema } from '../schemas/squad.schema'

export async function listSquads(req: AuthRequest, res: Response) {
  const { platform, region, rank, mode, language } = req.query
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

  const posts = await prisma.squadPost.findMany({
    where: {
      ...(platform && { platform: platform as any }),
      ...(region && { region: region as any }),
      ...(rank && { rank: rank as any }),
      ...(mode && { mode: mode as any }),
      ...(language && { language: language as any }),
      createdAt: { gte: oneHourAgo },
    },
    include: {
      user: { select: { username: true, avatar: true } },
      notifications: {
        where: { type: 'JOIN_REQUEST', status: 'ACCEPTED' },
        select: { actor: { select: { username: true, avatar: true } } },
      },
    },
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

export async function listMySquads(req: AuthRequest, res: Response) {
  const posts = await prisma.squadPost.findMany({
    where: { userId: req.userId },
    include: {
      user: { select: { username: true, avatar: true } },
      notifications: {
        where: { type: 'JOIN_REQUEST', status: 'ACCEPTED' },
        select: { actor: { select: { username: true, avatar: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  res.json(posts.map((p) => ({ ...p, requestStatus: null })))
}

const MAX_POSTS_PER_HOUR = 3

export async function createSquad(req: AuthRequest, res: Response) {
  const parsed = createSquadSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message })
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  const recentCount = await prisma.squadPost.count({
    where: { userId: req.userId, createdAt: { gte: oneHourAgo } },
  })

  if (recentCount >= MAX_POSTS_PER_HOUR) {
    return res.status(429).json({
      error: `Só podes criar ${MAX_POSTS_PER_HOUR} squad posts por hora. Tenta novamente mais tarde.`,
    })
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

const MAX_SQUAD_SIZE = 4 // não conta o dono do post

export async function updateSquad(req: AuthRequest, res: Response) {
  const id = req.params.id as string

  const post = await prisma.squadPost.findUnique({ where: { id } })
  if (!post) return res.status(404).json({ error: 'Squad post não encontrado' })
  if (post.userId !== req.userId) {
    return res.status(403).json({ error: 'Sem permissão para editar este post' })
  }

  const parsed = updateSquadSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message })
  }

  if (parsed.data.playersNeeded !== undefined) {
    const acceptedCount = await prisma.notification.count({
      where: { squadPostId: id, type: 'JOIN_REQUEST', status: 'ACCEPTED' },
    })

    if (acceptedCount + parsed.data.playersNeeded > MAX_SQUAD_SIZE) {
      return res.status(400).json({
        error: `Já tens ${acceptedCount} jogador${acceptedCount === 1 ? '' : 'es'} aceite${acceptedCount === 1 ? '' : 's'}. O máximo de vagas que podes abrir agora é ${MAX_SQUAD_SIZE - acceptedCount}.`,
      })
    }
  }

  const updated = await prisma.squadPost.update({
    where: { id },
    data: parsed.data,
  })

  res.json(updated)
}

export async function deleteSquad(req: AuthRequest, res: Response) {
  const id = req.params.id as string

  const post = await prisma.squadPost.findUnique({ where: { id } })
  if (!post) return res.status(404).json({ error: 'Squad post não encontrado' })
  if (post.userId !== req.userId) {
    return res.status(403).json({ error: 'Sem permissão para apagar este post' })
  }

  await prisma.notification.deleteMany({ where: { squadPostId: id } })
  await prisma.squadPost.delete({ where: { id } })

  res.status(204).send()
}

export async function getSquad(req: Request, res: Response) {
  const id = req.params.id as string

  const post = await prisma.squadPost.findUnique({
    where: { id },
    include: {
      user: { select: { username: true, avatar: true } },
      notifications: {
        where: { type: 'JOIN_REQUEST', status: 'ACCEPTED' },
        select: { actor: { select: { username: true, avatar: true } } },
      },
    },
  })

  if (!post) return res.status(404).json({ error: 'Squad post não encontrado' })

  res.json({
    ...post,
    acceptedCount: post.notifications.length,
  })
}

export async function removeMember(req: AuthRequest, res: Response) {
  const postId = req.params.id as string
  const username = req.params.username as string

  const post = await prisma.squadPost.findUnique({ where: { id: postId } })
  if (!post) return res.status(404).json({ error: 'Squad post não encontrado' })
  if (post.userId !== req.userId) {
    return res.status(403).json({ error: 'Sem permissão para gerir este post' })
  }

  const member = await prisma.user.findUnique({ where: { username } })
  if (!member) return res.status(404).json({ error: 'Utilizador não encontrado' })

  const acceptedNotification = await prisma.notification.findFirst({
    where: {
      squadPostId: postId,
      actorId: member.id,
      type: 'JOIN_REQUEST',
      status: 'ACCEPTED',
    },
  })

  if (!acceptedNotification) {
    return res.status(404).json({ error: 'Este utilizador não está no squad' })
  }

  await prisma.notification.update({
    where: { id: acceptedNotification.id },
    data: { status: 'REMOVED' },
  })

  await prisma.squadPost.update({
    where: { id: postId },
    data: { playersNeeded: { increment: 1 } },
  })

  await prisma.notification.create({
    data: {
      recipientId: member.id,
      actorId: req.userId!,
      squadPostId: postId,
      type: 'KICKED',
      status: 'DECLINED',
    },
  })

  res.json({ success: true })
}
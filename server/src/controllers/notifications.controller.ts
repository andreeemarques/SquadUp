import { Response } from 'express'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middleware/auth'

export async function listNotifications(req: AuthRequest, res: Response) {
  const notifications = await prisma.notification.findMany({
    where: { recipientId: req.userId },
    include: {
      actor: { select: { username: true, avatar: true, ubisoftId: true } },
      squadPost: { select: { id: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 30,
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  res.json({ notifications, unreadCount })
}

export async function markAllRead(req: AuthRequest, res: Response) {
  await prisma.notification.updateMany({
    where: { recipientId: req.userId, read: false },
    data: { read: true },
  })
  res.json({ success: true })
}

export async function respondToNotification(req: AuthRequest, res: Response) {
  const id = req.params.id as string
  const { action } = req.body as { action: 'accept' | 'decline' }

  if (action !== 'accept' && action !== 'decline') {
    return res.status(400).json({ error: 'Invalid action' })
  }

  const notification = await prisma.notification.findUnique({ where: { id } })
  if (!notification) return res.status(404).json({ error: 'Notification not found' })
  if (notification.recipientId !== req.userId) {
    return res.status(403).json({ error: 'You are not the recipient of this notification' })
  }
  if (notification.status !== 'PENDING') {
    return res.status(409).json({ error: 'This request has already been answered.' })
  }

  const updated = await prisma.notification.update({
    where: { id },
    data: {
      status: action === 'accept' ? 'ACCEPTED' : 'DECLINED',
      read: true,
    },
  })

  if (action === 'accept' && notification.squadPostId) {
    await prisma.squadPost.updateMany({
      where: { id: notification.squadPostId, playersNeeded: { gt: 0 } },
      data: { playersNeeded: { decrement: 1 } },
    })
  }

  // Notifies the person who requested to join so they know the outcome.
  await prisma.notification.create({
    data: {
      recipientId: notification.actorId,
      actorId: req.userId!,
      squadPostId: notification.squadPostId,
      type: action === 'accept' ? 'JOIN_ACCEPTED' : 'JOIN_DECLINED',
      status: action === 'accept' ? 'ACCEPTED' : 'DECLINED',
    },
  })

  res.json(updated)
}
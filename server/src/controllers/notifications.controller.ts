import { Response } from 'express'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middleware/auth'

export async function listNotifications(req: AuthRequest, res: Response) {
  const notifications = await prisma.notification.findMany({
    where: { recipientId: req.userId },
    include: {
      actor: { select: { username: true, avatar: true } },
      squadPost: { select: { description: true } },
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
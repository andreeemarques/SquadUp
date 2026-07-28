import { Router } from 'express'
import {
  listNotifications,
  markAllRead,
  respondToNotification,
} from '../controllers/notifications.controller'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.get('/', requireAuth, listNotifications)
router.patch('/read-all', requireAuth, markAllRead)
router.patch('/:id/respond', requireAuth, respondToNotification)

export default router
import { Router } from 'express'
import { listNotifications, markAllRead } from '../controllers/notifications.controller'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.get('/', requireAuth, listNotifications)
router.patch('/read-all', requireAuth, markAllRead)

export default router
import { Router } from 'express'
import { getProfile } from '../controllers/users.controller'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.get('/me', requireAuth, getProfile)

export default router
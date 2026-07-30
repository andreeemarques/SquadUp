import { Router } from 'express'
import { getProfile, updateProfile, getPublicProfile } from '../controllers/users.controller'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.get('/me', requireAuth, getProfile)
router.patch('/me', requireAuth, updateProfile)
router.get('/:username', getPublicProfile)

export default router
import { Router } from 'express'
import { listSquads, createSquad, joinSquad } from '../controllers/squads.controller'
import { requireAuth, optionalAuth } from '../middleware/auth'

const router = Router()

router.get('/', optionalAuth, listSquads)
router.post('/', requireAuth, createSquad)
router.post('/:id/join', requireAuth, joinSquad)

export default router
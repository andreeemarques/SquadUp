import { Router } from 'express'
import { listSquads, createSquad, joinSquad } from '../controllers/squads.controller'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.get('/', listSquads)
router.post('/', requireAuth, createSquad)
router.post('/:id/join', requireAuth, joinSquad)

export default router
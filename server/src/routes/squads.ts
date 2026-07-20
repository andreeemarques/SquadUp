import { Router } from 'express'
import { listSquads, createSquad } from '../controllers/squads.controller'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.get('/', listSquads)
router.post('/', requireAuth, createSquad)

export default router
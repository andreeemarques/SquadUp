import { Router } from 'express'
import {
  listSquads,
  createSquad,
  joinSquad,
  getSquad,
  updateSquad,
  deleteSquad,
  listMySquads,
  removeMember,
} from '../controllers/squads.controller'
import { requireAuth, optionalAuth } from '../middleware/auth'

const router = Router()

router.get('/', optionalAuth, listSquads)
router.get('/mine', requireAuth, listMySquads)
router.get('/:id', getSquad)
router.post('/', requireAuth, createSquad)
router.post('/:id/join', requireAuth, joinSquad)
router.patch('/:id', requireAuth, updateSquad)
router.delete('/:id', requireAuth, deleteSquad)
router.delete('/:id/members/:username', requireAuth, removeMember)

export default router
import { Router } from 'express'
import { register, login, forgotPassword, resetPassword } from '../controllers/auth.controller'
import {
  forgotPasswordLimiter,
  resetPasswordLimiter,
  registerLimiter,
  loginLimiter,
} from '../middleware/rateLimit'

const router = Router()

router.post('/register', registerLimiter, register)
router.post('/login', loginLimiter, login)
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword)
router.post('/reset-password', resetPasswordLimiter, resetPassword)

export default router
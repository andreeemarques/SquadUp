import { Router } from 'express'
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
} from '../controllers/auth.controller'
import {
  forgotPasswordLimiter,
  resetPasswordLimiter,
  registerLimiter,
  loginLimiter,
  resendVerificationLimiter,
} from '../middleware/rateLimit'

const router = Router()

router.post('/register', registerLimiter, register)
router.post('/login', loginLimiter, login)
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword)
router.post('/reset-password', resetPasswordLimiter, resetPassword)
router.post('/verify-email', verifyEmail)
router.post('/resend-verification', resendVerificationLimiter, resendVerification)

export default router
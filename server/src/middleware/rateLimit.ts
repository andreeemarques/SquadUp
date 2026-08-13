import rateLimit from 'express-rate-limit'

export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // a maximum of 3 requests per IP within this interval
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many password reset requests. Please try again later.' },
})

export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // a maximum of 10 requests per IP within this interval
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many reset attempts. Please try again later.' },
})

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' },
})

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // a maximum of 5 registrations per IP within this interval
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many accounts created from this IP. Please try again later.' },
})

export const resendVerificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many verification requests. Please try again later.' },
})
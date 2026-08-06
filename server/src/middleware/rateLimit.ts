import rateLimit from 'express-rate-limit'

export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 3, // no máximo 3 pedidos por IP nesse intervalo
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados pedidos de recuperação. Tenta novamente mais tarde.' },
})

export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // um pouco mais permissivo, já que inclui erros de digitação da password
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas tentativas. Tenta novamente mais tarde.' },
})

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas tentativas de login. Tenta novamente mais tarde.' },
})

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // no máximo 5 registos por IP nesse intervalo
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas contas criadas a partir deste IP. Tenta novamente mais tarde.' },
})

export const resendVerificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados pedidos. Tenta novamente mais tarde.' },
})
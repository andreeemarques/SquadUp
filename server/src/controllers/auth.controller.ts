import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma'
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../schemas/auth.schema'
import { signToken } from '../utils/jwt'
import crypto from 'crypto'
import { sendPasswordResetEmail } from '../lib/mailer'

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
  const firstError = parsed.error.issues[0]
  return res.status(400).json({ error: firstError.message })
}

  const { username, email, password, ubisoftId, platform } = parsed.data
  const hashed = await bcrypt.hash(password, 10)

  try {
    const user = await prisma.user.create({
      data: { username, email, password: hashed, ubisoftId, platform },
    })
    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      ubisoftId: user.ubisoftId,
      platform: user.platform,
      avatar: user.avatar,
    })
  } catch {
    res.status(409).json({ error: 'Username ou email já existem' })
  }
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
  const firstError = parsed.error.issues[0]
  return res.status(400).json({ error: firstError.message })
}

  const { email, password } = parsed.data
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Credenciais inválidas' })
  }

  const token = signToken({ userId: user.id })
  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      ubisoftId: user.ubisoftId,
      platform: user.platform,
      avatar: user.avatar,
    },
  })
}

export async function forgotPassword(req: Request, res: Response) {
  const parsed = forgotPasswordSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message })
  }

  const { email } = parsed.data
  const user = await prisma.user.findUnique({ where: { email } })

  // Resposta genérica sempre — não confirma se o email existe ou não (evita enumeração de contas)
  const genericResponse = {
    message: 'Se esse email existir, vais receber um link de recuperação.',
  }

  if (!user) return res.json(genericResponse)

  const token = crypto.randomBytes(32).toString('hex')
  const expiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: token, resetTokenExpiry: expiry },
  })

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`

  try {
    await sendPasswordResetEmail(user.email, resetUrl)
  } catch (err) {
    console.error('Erro ao enviar email de recuperação:', err)
  }

  res.json(genericResponse)
}

export async function resetPassword(req: Request, res: Response) {
  const parsed = resetPasswordSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message })
  }

  const { token, password } = parsed.data

  const user = await prisma.user.findUnique({ where: { resetToken: token } })

  if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    return res.status(400).json({ error: 'Link inválido ou expirado. Pede um novo.' })
  }

  const hashed = await bcrypt.hash(password, 10)

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed, resetToken: null, resetTokenExpiry: null },
  })

  res.json({ success: true })
}
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma'
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, verifyEmailSchema, resendVerificationSchema } from '../schemas/auth.schema'
import { signToken } from '../utils/jwt'
import crypto from 'crypto'
import { sendPasswordResetEmail, sendVerificationEmail } from '../lib/mailer'

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message })
  }

  const { username, email, password, ubisoftId, platform } = parsed.data
  const hashed = await bcrypt.hash(password, 10)

  const verificationToken = crypto.randomBytes(32).toString('hex')
  const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashed,
        ubisoftId,
        platform,
        verificationToken,
        verificationTokenExpiry,
      },
    })

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`
    try {
      await sendVerificationEmail(user.email, verifyUrl)
    } catch (err) {
      console.error('Erro ao enviar email de verificação:', err)
    }

    res.status(201).json({
      message: 'Conta criada. Verifica o teu email para ativares a conta.',
    })
  } catch {
    res.status(409).json({ error: 'Username ou email já existem' })
  }
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message })
  }

  const { email, password } = parsed.data
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Credenciais inválidas' })
  }

  if (!user.emailVerified) {
    return res.status(403).json({ error: 'EMAIL_NOT_VERIFIED' })
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
      rank: user.rank,
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

  const isSamePassword = await bcrypt.compare(password, user.password)
  if (isSamePassword) {
    return res.status(400).json({ error: 'A nova password tem de ser diferente da atual.' })
  }

  const hashed = await bcrypt.hash(password, 10)

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed, resetToken: null, resetTokenExpiry: null },
  })

  res.json({ success: true })
}

export async function verifyEmail(req: Request, res: Response) {
  const parsed = verifyEmailSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message })
  }

  const { token } = parsed.data
  const user = await prisma.user.findUnique({ where: { verificationToken: token } })

  if (!user || !user.verificationTokenExpiry || user.verificationTokenExpiry < new Date()) {
    return res.status(400).json({ error: 'Link inválido ou expirado. Pede um novo.' })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, verificationToken: null, verificationTokenExpiry: null },
  })

  const jwtToken = signToken({ userId: user.id })
  res.json({
    token: jwtToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      ubisoftId: user.ubisoftId,
      platform: user.platform,
      avatar: user.avatar,
      rank: user.rank,
    },
  })
}

export async function resendVerification(req: Request, res: Response) {
  const parsed = resendVerificationSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message })
  }

  const { email } = parsed.data
  const user = await prisma.user.findUnique({ where: { email } })

  const genericResponse = {
    message: 'Se essa conta existir e ainda não estiver verificada, vais receber um novo email.',
  }

  if (!user || user.emailVerified) return res.json(genericResponse)

  const verificationToken = crypto.randomBytes(32).toString('hex')
  const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

  await prisma.user.update({
    where: { id: user.id },
    data: { verificationToken, verificationTokenExpiry },
  })

  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`
  try {
    await sendVerificationEmail(user.email, verifyUrl)
  } catch (err) {
    console.error('Erro ao reenviar email de verificação:', err)
  }

  res.json(genericResponse)
}
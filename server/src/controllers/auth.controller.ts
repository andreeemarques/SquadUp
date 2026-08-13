import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma'
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, verifyEmailSchema, resendVerificationSchema } from '../schemas/auth.schema'
import { signToken } from '../utils/jwt'
import crypto from 'crypto'
import { sendPasswordResetEmail, sendVerificationEmail } from '../lib/mailer'
import { hashToken } from '../utils/hash'

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message })
  }

  const { username, email, password, ubisoftId, platform } = parsed.data
  const hashed = await bcrypt.hash(password, 10)

  const rawVerificationToken = crypto.randomBytes(32).toString('hex')
  const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashed,
        ubisoftId,
        platform,
        verificationToken: hashToken(rawVerificationToken),
        verificationTokenExpiry,
      },
    })

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${rawVerificationToken}`
    try {
      await sendVerificationEmail(user.email, verifyUrl)
    } catch (err) {
      console.error('Error sending verification email:', err)
    }

    res.status(201).json({
      message: 'Account created. Please check your email to verify your account.',
    })
  } catch {
    res.status(409).json({ error: 'Username or email already exists' })
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
    return res.status(401).json({ error: 'Invalid credentials' })
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

  // Always a generic response — does not confirm whether the email exists (prevents account enumeration).
  const genericResponse = {
    message: 'If that email exists, you will receive a password reset link.',
  }

  if (!user) return res.json(genericResponse)

  const rawToken = crypto.randomBytes(32).toString('hex')
  const expiry = new Date(Date.now() + 60 * 60 * 1000)

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: hashToken(rawToken), resetTokenExpiry: expiry },
  })

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`

  try {
    await sendPasswordResetEmail(user.email, resetUrl)
  } catch (err) {
    console.error('Error sending password reset email:', err)
  }

  res.json(genericResponse)
}

export async function resetPassword(req: Request, res: Response) {
  const parsed = resetPasswordSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message })
  }

  const { token, password } = parsed.data

  const user = await prisma.user.findUnique({ where: { resetToken: hashToken(token) } })

  if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    return res.status(400).json({ error: 'Invalid or expired link. Please request a new one.' })
  }

  const isSamePassword = await bcrypt.compare(password, user.password)
  if (isSamePassword) {
    return res.status(400).json({ error: 'The new password must be different from the current one.' })
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
  const user = await prisma.user.findUnique({ where: { verificationToken: hashToken(token) } })

  if (!user || !user.verificationTokenExpiry || user.verificationTokenExpiry < new Date()) {
    return res.status(400).json({ error: 'Invalid or expired link. Please request a new one.' })
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
    message: 'If this account exists and has not yet been verified, you will receive a new email.',
  }

  if (!user || user.emailVerified) return res.json(genericResponse)

  const rawVerificationToken = crypto.randomBytes(32).toString('hex')
  const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

  await prisma.user.update({
    where: { id: user.id },
    data: { verificationToken: hashToken(rawVerificationToken), verificationTokenExpiry },
  })

  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${rawVerificationToken}`
  try {
    await sendVerificationEmail(user.email, verifyUrl)
  } catch (err) {
    console.error('Error resending verification email:', err)
  }

  res.json(genericResponse)
}
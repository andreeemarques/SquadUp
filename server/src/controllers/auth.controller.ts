import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma'
import { registerSchema, loginSchema } from '../schemas/auth.schema'
import { signToken } from '../utils/jwt'

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() })
  }

  const { username, email, password } = parsed.data
  const hashed = await bcrypt.hash(password, 10)

  try {
    const user = await prisma.user.create({
      data: { username, email, password: hashed },
    })
    res.status(201).json({ id: user.id, username: user.username, email: user.email })
  } catch {
    res.status(409).json({ error: 'Username ou email já existem' })
  }
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() })
  }

  const { email, password } = parsed.data
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Credenciais inválidas' })
  }

  const token = signToken({ userId: user.id })
  res.json({ token, user: { id: user.id, username: user.username, email: user.email } })
}
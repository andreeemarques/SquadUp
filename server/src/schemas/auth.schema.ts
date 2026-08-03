import { z } from 'zod'

export const platformEnum = z.enum(['PC', 'PlayStation', 'Xbox'])

const passwordSchema = z
  .string()
  .min(8, 'A password precisa de pelo menos 8 caracteres')
  .regex(/[a-zA-Z]/, 'A password precisa de pelo menos uma letra')
  .regex(/[0-9]/, 'A password precisa de pelo menos um número')

export const registerSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: passwordSchema,
  ubisoftId: z.string().min(2).max(50).optional(),
  platform: platformEnum.optional(),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: passwordSchema,
})
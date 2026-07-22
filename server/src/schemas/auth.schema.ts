import { z } from 'zod'

export const platformEnum = z.enum(['PC', 'PlayStation', 'Xbox'])

export const registerSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(8),
  ubisoftId: z.string().min(2).max(50).optional(),
  platform: platformEnum.optional(),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
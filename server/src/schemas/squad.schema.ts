import { z } from 'zod'

export const platformEnum = z.enum(['PC', 'PlayStation', 'Xbox'])
export const regionEnum = z.enum([
  'North_America',
  'Europe',
  'South_America',
  'Asia',
  'Oceania',
])
export const rankEnum = z.enum([
  'Copper',
  'Bronze',
  'Silver',
  'Gold',
  'Platinum',
  'Emerald',
  'Diamond',
  'Champion',
])
export const gameModeEnum = z.enum(['Ranked', 'Standard', 'Quick_Match'])
export const languageEnum = z.enum([
  'English',
  'Spanish',
  'French',
  'German',
  'Portuguese',
])

export const createSquadSchema = z.object({
  platform: platformEnum,
  region: regionEnum,
  rank: rankEnum,
  mode: gameModeEnum,
  language: languageEnum,
  micRequired: z.boolean(),
  playersNeeded: z.number().int().min(1).max(10),
  description: z.string().min(1).max(500),
})

export type CreateSquadInput = z.infer<typeof createSquadSchema>
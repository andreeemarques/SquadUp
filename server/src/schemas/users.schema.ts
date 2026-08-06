import { z } from 'zod'
import { platformEnum } from './auth.schema'

const ALL_OPERATORS = [
  'Ace', 'Amaru', 'Ash', 'Blackbeard', 'Blitz', 'Brava', 'Buck', 'Capitão',
  'Deimos', 'Dokkaebi', 'Finka', 'Flores', 'Fuze', 'Glaz', 'Gridlock', 'Grim',
  'Hibana', 'Iana', 'IQ', 'Jackal', 'Kali', 'Lion', 'Maverick', 'Montagne',
  'Nøkk', 'Nomad', 'Osa', 'Ram', 'Rauora', 'Sens', 'Sledge', 'Solid Snake',
  'Striker', 'Thatcher', 'Thermite', 'Twitch', 'Ying', 'Zero', 'Zofia',
  'Alibi', 'Aruni', 'Azami', 'Bandit', 'Castle', 'Caveira', 'Clash', 'Denari',
  'Doc', 'Echo', 'Ela', 'Fenrir', 'Frost', 'Goyo', 'Jäger', 'Kaid', 'Kapkan',
  'Lesion', 'Maestro', 'Melusi', 'Mira', 'Mozzie', 'Mute', 'Oryx', 'Pulse',
  'Rook', 'Sentry', 'Skopós', 'Smoke', 'Solis', 'Tachanka', 'Thorn',
  'Thunderbird', 'Tubarão', 'Valkyrie', 'Vigil', 'Wamai', 'Warden',
] as const

const rankEnum = z.enum([
  'Copper', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Emerald', 'Diamond', 'Champion',
])

export const updateProfileSchema = z.object({
  username: z.string().min(3).max(20).optional(),
  ubisoftId: z.string().min(2).max(50).optional(),
  platform: platformEnum.optional(),
  rank: rankEnum.optional(),
  bio: z.string().max(300).optional(),
  avatar: z.enum([
    '/avatars/operator-1.png',
    '/avatars/operator-2.png',
    '/avatars/operator-3.png',
    '/avatars/operator-4.png',
  ]).optional(),
  preferredOperators: z.array(z.string()).max(8).optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>